import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const MyProductsSection = ({ userId, isOwnProfile, profileName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await marketplaceService.getProducts({ seller: userId });
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Shop</h3>
        </div>
        <div className="h-32 bg-nim-surface border border-nim-border rounded-nim-lg animate-pulse flex items-center justify-center text-nim-text-muted">
          Loading products...
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    if (!isOwnProfile) return null; // Don't show empty shop for other users

    return (
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5 text-nim-text-muted" />
          <h3 className="text-h4 text-nim-text">Shop</h3>
        </div>
        <EmptyState 
          title="No products yet" 
          description="You haven't published any digital products to the marketplace yet."
          className="bg-nim-surface border border-nim-border rounded-nim-lg"
        >
          <Link to="/seller/dashboard">
            <Button variant="outline" className="mt-4">Start Selling</Button>
          </Link>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-nim-text-muted" />
        <h3 className="text-h4 text-nim-text">
          {isOwnProfile ? 'My Products' : `Shop ${profileName}'s Products`}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-nim-elevated rounded-2xl border border-nim-border overflow-hidden flex flex-col group hover:shadow-nim-lg transition-all">
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
              <div className="absolute top-2 right-2">
                <span className="bg-black/70 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-bold">
                  {product.isFree ? 'Free' : `$${product.price.toFixed(2)}`}
                </span>
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${product._id}`}>
                <h4 className="text-md font-bold text-nim-text group-hover:text-nim-accent transition-colors line-clamp-1">
                  {product.title}
                </h4>
              </Link>
              <p className="text-xs text-nim-text-muted mt-1 uppercase tracking-wider">{product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyProductsSection;
