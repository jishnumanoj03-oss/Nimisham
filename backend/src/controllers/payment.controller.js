import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PurchaseAccess from '../models/PurchaseAccess.js';
import { AppError } from '../middleware/errorHandler.js';

// Using a placeholder or actual env variable for stripe secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_replace_me_before_production', {
  apiVersion: '2023-10-16',
});

// Create a checkout session
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { productIds } = req.body;
    const buyerId = req.user._id;

    if (!productIds || productIds.length === 0) {
      throw new AppError('No products provided for checkout', 400);
    }

    // 1. Fetch real prices from the DB
    const products = await Product.find({ 
      _id: { $in: productIds },
      status: 'active',
      visibility: 'public'
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products are unavailable or invalid', 400);
    }

    // 2. Create the pending order in MongoDB
    let totalAmount = 0;
    const orderProducts = products.map(p => {
      totalAmount += p.price;
      return {
        product: p._id,
        seller: p.seller,
        priceAtPurchase: p.price
      };
    });

    if (totalAmount <= 0) {
      throw new AppError('Total amount must be greater than 0 for payment', 400);
    }

    const order = await Order.create({
      buyer: buyerId,
      products: orderProducts,
      totalAmount,
      currency: 'usd', // Assuming USD for now
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    // 3. Create Stripe Checkout Session
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          description: product.description.substring(0, 200),
          images: product.previewImage?.url ? [product.previewImage.url] : [],
        },
        unit_amount: Math.round(product.price * 100), // Stripe uses cents
      },
      quantity: 1, // Digital products only need 1
    }));

    // Generate success/cancel URLs based on current origin or env var
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${clientUrl}/dashboard/purchases?success=true&order_id=${order._id}`,
      cancel_url: `${clientUrl}/cart?canceled=true`,
      client_reference_id: order._id.toString(), // Important for webhook matching
      metadata: {
        orderId: order._id.toString(),
        buyerId: buyerId.toString()
      }
    });

    // Update order with transaction ID
    order.transactionId = session.id;
    await order.save();

    res.status(200).json({ 
      success: true, 
      data: { sessionId: session.id, url: session.url } 
    });

  } catch (error) {
    next(error);
  }
};

// Webhook for Stripe events
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

  let event;

  try {
    // IMPORTANT: req.body must be raw buffer for stripe.webhooks.constructEvent to work.
    // Ensure index.js uses express.raw({type: 'application/json'}) for this route.
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    // If not using real Stripe credentials yet, bypass signature validation for local testing if needed.
    // DO NOT DO THIS IN PRODUCTION.
    if (process.env.NODE_ENV === 'development' && !process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('Bypassing webhook signature validation for local testing.');
      try {
        event = JSON.parse(req.body.toString());
      } catch (e) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId || session.client_reference_id;

    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        console.error(`Order not found for session ${session.id}`);
        return res.status(404).end();
      }

      if (order.paymentStatus === 'completed') {
        // Idempotency check: already processed
        return res.status(200).end();
      }

      // Update Order Status
      order.paymentStatus = 'completed';
      order.transactionId = session.payment_intent; // Save the actual payment intent
      await order.save();

      // Generate PurchaseAccess records
      const accessPromises = order.products.map(item => {
        return PurchaseAccess.create({
          user: order.buyer,
          product: item.product,
          order: order._id,
          isActive: true
        }).catch(err => {
          // If it fails due to unique constraint, it means access already exists. Ignore.
          if (err.code !== 11000) throw err;
        });
      });

      await Promise.all(accessPromises);
      
      console.log(`Order ${orderId} successfully completed and access granted.`);
      
    } catch (err) {
      console.error('Error processing successful checkout session:', err);
      return res.status(500).end();
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).end();
};
