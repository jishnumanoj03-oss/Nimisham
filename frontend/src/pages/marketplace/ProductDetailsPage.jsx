import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Download, ShieldCheck, User, Tag, LayoutGrid } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { toast } from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Checking purchase status logic goes here, assuming a service method later
  const [hasPurchased, setHasPurchased] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getProductById(id);
      setProduct(data.data);
      // In a real app, we'd also check purchase status here
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleDownloadFree = async () => {
    if (!user) {
      toast.error('Please login to download free items');
      navigate('/auth/login');
      return;
    }
    setDownloading(true);
    try {
      // In reality, this hits the secure backend endpoint
      const data = await marketplaceService.getDownloadUrl(product._id);
      window.open(data.url, '_blank');
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to initiate download');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="py-32 text-center text-gray-500">Loading product...</div>;
  if (error || !product) return <div className="py-32 text-center text-red-500">{error || 'Product not found'}</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: Product Image */}
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-200 min-h-[400px]">
            <img 
              src={product.previewImage?.url} 
              alt={product.title}
              className="max-w-full max-h-[600px] object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              {product.isFree && (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Free Resource
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
              <Avatar src={product.seller?.avatar} size="md" />
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium text-gray-900">{product.seller?.name}</p>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 flex-1">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1.5 rounded-md">
                    <Tag size={12} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Area */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {product.isFree ? 'Free' : `$${product.price.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <ShieldCheck size={14} className="text-green-500" /> Secure transaction
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Download size={14} /> Instant delivery
                  </span>
                </div>
              </div>

              {hasPurchased ? (
                <Button className="w-full py-4 text-lg" variant="secondary" onClick={handleDownloadFree} isLoading={downloading}>
                  <Download className="mr-2" /> Download Asset
                </Button>
              ) : product.isFree ? (
                <Button className="w-full py-4 text-lg" onClick={handleDownloadFree} isLoading={downloading}>
                  <Download className="mr-2" /> Download Free
                </Button>
              ) : cart.find(item => item._id === product._id) ? (
                <Button className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="mr-2" /> View in Cart
                </Button>
              ) : (
                <Button className="w-full py-4 text-lg" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2" /> Add to Cart
                </Button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
