import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Download, Search } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await marketplaceService.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nim-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto text-center text-nim-error">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nim-bg pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-nim-text mb-4">
            Digital Marketplace
          </h1>
          <p className="text-lg text-nim-text-secondary">
            Discover premium presets, templates, and digital assets crafted by top creators.
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-nim-elevated rounded-2xl border border-dashed border-nim-border">
            <ShoppingBag className="w-16 h-16 mx-auto text-nim-text-muted mb-4" />
            <h3 className="text-2xl font-bold text-nim-text mb-2">Marketplace is empty right now.</h3>
            <p className="text-nim-text-secondary mb-6">Check back later for new digital products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const inCart = cart.some(item => item._id === product._id);
              
              return (
                <div key={product._id} className="bg-nim-elevated rounded-2xl border border-nim-border overflow-hidden flex flex-col group hover:shadow-nim-lg transition-all duration-300 hover:-translate-y-1">
                  
                  {/* Image Preview */}
                  <Link to={`/product/${product._id}`} className="block relative aspect-video bg-nim-bg-secondary overflow-hidden">
                    {product.previewImage?.url ? (
                      <img 
                        src={product.previewImage.url} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-nim-text-muted">
                        No Preview
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.isFree && (
                        <span className="bg-green-500/90 text-white text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                          Free
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-auto">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-bold text-nim-text mb-1 line-clamp-2 group-hover:text-nim-accent transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-nim-text-secondary truncate">
                          by <Link to={`/profile/${product.seller?.username}`} className="hover:text-nim-accent">{product.seller?.name}</Link>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-nim-border flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-nim-text">
                          {product.isFree ? 'Free' : `$${product.price.toFixed(2)}`}
                        </span>
                      </div>
                      
                      {inCart ? (
                        <Link to="/cart" className="w-full">
                          <Button variant="secondary" className="w-full justify-center">
                            View in Cart
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          onClick={() => addToCart(product)} 
                          className="w-full justify-center flex items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" /> Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
