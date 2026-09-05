import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'delivered', 'cancelled'],
      default: 'processing',
    },
    transactionId: {
      type: String, // Stripe Session ID or Razorpay Order ID
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Index for getting user orders quickly
orderSchema.index({ buyer: 1, createdAt: -1 });
// Index for seller to see sales
orderSchema.index({ 'products.seller': 1, paymentStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
