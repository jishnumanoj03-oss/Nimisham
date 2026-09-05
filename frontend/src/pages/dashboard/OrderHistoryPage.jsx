import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900">Order History</h1>
          <p className="text-gray-500 mt-2">View your past transactions and purchases.</p>
        </div>
        <Button variant="outline" onClick={fetchOrders} className="flex items-center gap-2">
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">You haven't made any purchases yet.</p>
          <Link to="/search">
            <Button>Explore Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Order Placed</p>
                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Total</p>
                    <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Order # </span>
                  <span className="font-mono text-gray-900">{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                </div>
              </div>

              <div className="p-6">
                <ul className="divide-y divide-gray-100">
                  {order.products.map(item => (
                    <li key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-6">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.product?.previewImage?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link to={`/product/${item.product?._id}`} className="font-semibold text-lg text-gray-900 hover:text-primary-600 transition-colors">
                          {item.product?.title || 'Unknown Product'}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Sold by {item.seller?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.priceAtPurchase.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
