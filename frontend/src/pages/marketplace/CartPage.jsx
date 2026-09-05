import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import paymentService from '../../services/paymentService';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      const session = await paymentService.createCheckoutSession(cart.map(item => item._id));
      if (session.url) {
        window.location.href = session.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added any digital products, presets, or prompts to your cart yet.
        </p>
        <Button onClick={() => navigate('/search')}>Explore Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="font-medium text-gray-900">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
              <button 
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>
            
            <ul className="divide-y divide-gray-100">
              {cart.map(product => (
                <li key={product._id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                  <Link to={`/product/${product._id}`} className="block w-full sm:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={product.previewImage?.url} alt={product.title} className="w-full h-full object-cover" />
                  </Link>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link to={`/product/${product._id}`} className="font-semibold text-lg text-gray-900 hover:text-primary-600 transition-colors">
                          {product.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">by {product.seller?.name}</p>
                        <span className="inline-block mt-2 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          {product.category}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex justify-end mt-4 sm:mt-0">
                      <button 
                        onClick={() => removeFromCart(product._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-sm font-medium"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
            <h2 className="text-xl font-serif text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-base font-medium text-gray-900">Total</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                <p className="text-xs text-gray-500 mt-1">USD</p>
              </div>
            </div>

            <Button 
              className="w-full py-4 text-lg mb-4 group" 
              onClick={handleCheckout}
              isLoading={isCheckingOut}
            >
              Checkout <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck size={16} className="text-green-600" />
              Secure encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
