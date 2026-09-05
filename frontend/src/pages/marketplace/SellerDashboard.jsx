import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, Image as ImageIcon, Link as LinkIcon, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import marketplaceService from '../../services/marketplaceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { toast } from 'react-hot-toast';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Photography',
    tags: '',
    price: 0,
    isFree: false,
    visibility: 'draft',
    downloadUrl: '', // In reality, this would be a file upload to Cloudinary. For MVP, text field.
    previewImageUrl: '', // Simplified preview image handling for MVP
    previewImagePublicId: 'placeholder_id'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getSellerProducts();
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        tags: product.tags.join(', '),
        price: product.price,
        isFree: product.isFree,
        visibility: product.visibility,
        downloadUrl: product.downloadUrl || '',
        previewImageUrl: product.previewImage?.url || '',
        previewImagePublicId: product.previewImage?.publicId || 'placeholder_id'
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        category: 'Photography',
        tags: '',
        price: 0,
        isFree: false,
        visibility: 'draft',
        downloadUrl: '',
        previewImageUrl: '',
        previewImagePublicId: 'placeholder_id'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.previewImageUrl || !formData.downloadUrl) {
      toast.error('Preview image and Download asset URL are required');
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        price: formData.isFree ? 0 : Number(formData.price),
        previewImage: {
          url: formData.previewImageUrl,
          publicId: formData.previewImagePublicId
        }
      };

      if (editingProduct) {
        await marketplaceService.updateProduct(editingProduct._id, payload);
        toast.success('Product updated successfully');
      } else {
        await marketplaceService.createProduct(payload);
        toast.success('Product created successfully');
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your digital products and listings</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} /> New Product
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Start selling your photography, presets, or prompts.</p>
          <Button onClick={() => handleOpenModal()}>Create your first product</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                        <img src={product.previewImage?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.isFree ? 'Free' : `$${product.price}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.visibility === 'public' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {product.visibility === 'public' ? <Eye size={12} /> : <EyeOff size={12} />}
                      {product.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simplified Modal for MVP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="text-2xl font-serif">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <Input 
                    label="Title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    options={[
                      { value: 'Photography', label: 'Photography' },
                      { value: 'AI Art', label: 'AI Art' },
                      { value: 'Presets', label: 'Presets' },
                      { value: 'AI Prompts', label: 'AI Prompts' },
                      { value: 'Digital Resource', label: 'Digital Resource' }
                    ]}
                  />
                </div>

                <div>
                  <Input 
                    label="Tags (comma separated)" 
                    value={formData.tags} 
                    onChange={e => setFormData({...formData, tags: e.target.value})} 
                  />
                </div>

                <div className="col-span-2 p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-200">
                  <h3 className="font-medium flex items-center gap-2"><ImageIcon size={18} /> Asset Delivery (URLs for MVP)</h3>
                  <Input 
                    label="Preview Image URL" 
                    value={formData.previewImageUrl} 
                    onChange={e => setFormData({...formData, previewImageUrl: e.target.value})} 
                    placeholder="https://..."
                    required 
                  />
                  <Input 
                    label="Secure Download Asset URL (Zip, PDF, etc)" 
                    value={formData.downloadUrl} 
                    onChange={e => setFormData({...formData, downloadUrl: e.target.value})} 
                    placeholder="https://..."
                    required 
                  />
                  <p className="text-xs text-gray-500">In production, these would use Cloudinary upload widgets.</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isFree}
                      onChange={e => setFormData({...formData, isFree: e.target.checked})}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Is Free Product?</span>
                  </label>
                  
                  {!formData.isFree && (
                    <div className="flex-1 ml-4">
                      <Input 
                        type="number" 
                        label="Price (USD)" 
                        min="0.50" 
                        step="0.01"
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} 
                        required={!formData.isFree}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <Select 
                    value={formData.visibility}
                    onChange={e => setFormData({...formData, visibility: e.target.value})}
                    options={[
                      { value: 'draft', label: 'Draft (Hidden)' },
                      { value: 'public', label: 'Public (Live on Marketplace)' }
                    ]}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
