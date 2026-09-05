import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Download, Package, CheckCircle2, Clock } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const MyPurchasesPage = () => {
  const [searchParams] = useSearchParams();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  // Check if we just returned from a successful Stripe checkout
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Payment successful! Your digital products are now available.');
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await marketplaceService.getMyPurchases();
      setPurchases(data.data);
    } catch (error) {
      toast.error('Failed to load your purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (productId) => {
    setDownloading(productId);
    try {
      const data = await marketplaceService.getDownloadUrl(productId);
      window.open(data.url, '_blank');
      toast.success('Download initiated');
      // Refresh to update download count
      fetchPurchases();
    } catch (error) {
      toast.error('Failed to access download. Please contact support.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-gray-900">My Purchases</h1>
        <p className="text-gray-500 mt-2">Access and download your purchased digital goods, presets, and artwork.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading purchases...</div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-500 mb-6">Discover amazing resources and presets in the marketplace.</p>
          <Link to="/search">
            <Button>Explore Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {purchases.map(access => (
            <div key={access._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              
              <Link to={`/product/${access.product._id}`} className="aspect-video bg-gray-100 overflow-hidden relative">
                <img 
                  src={access.product.previewImage?.url} 
                  alt={access.product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-900 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 size={14} className="text-green-500" /> Owned
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1 block">
                    {access.product.category}
                  </span>
                  <Link to={`/product/${access.product._id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                      {access.product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    by {access.product.seller?.name}
                  </p>
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> Purchased {new Date(access.grantedAt).toLocaleDateString()}
                    </span>
                    <span>{access.downloadCount} Downloads</span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleDownload(access.product._id)}
                    isLoading={downloading === access.product._id}
                  >
                    <Download size={18} className="mr-2" /> 
                    Download Asset
                  </Button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchasesPage;
