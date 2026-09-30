import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  getSellerProducts,
  updateProduct,
  deleteProduct,
} from '../../services/sellerService';
import { ProductRecord } from '../../lib/supabase';

export const SellerProductList: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useCart();

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getSellerProducts(user.id);
      setProducts(data);
    } catch (err) {
      console.warn('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.id]);

  const handleToggleStock = async (product: ProductRecord) => {
    const updatedStatus = !product.in_stock;
    const { error } = await updateProduct(product.id, { in_stock: updatedStatus });
    if (error) {
      showToast(`Failed to update stock: ${error.message}`);
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, in_stock: updatedStatus } : p))
    );
    showToast(
      updatedStatus
        ? `"${product.title}" marked as In Stock`
        : `"${product.title}" marked as Out of Stock`
    );
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setIsDeletingId(id);
    const { error } = await deleteProduct(id);
    setIsDeletingId(null);
    if (error) {
      showToast(`Delete failed: ${error.message}`);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`"${title}" has been deleted.`);
  };

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = filterCategory === 'All' || p.category === filterCategory;
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, filterCategory, searchTerm]);

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[1200px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/seller/dashboard" className="hover:text-white transition-colors">Creator Studio</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Inventory & Products</span>
      </nav>

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Catalog & <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your screenplay editions, passes, and physical studio collectibles.
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white text-xs font-semibold shadow-[0_0_15px_rgba(216,19,149,0.3)] transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Item</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151515] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#d81395] text-white'
                  : 'bg-[#151515] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
          <p className="text-xs text-neutral-400">Loading catalog items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#151515] border border-white/10 text-center space-y-4">
          <Package className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No items found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchTerm || filterCategory !== 'All'
              ? 'Try adjusting your search query or category filter.'
              : 'You haven’t published any items yet. Add your first film script or pass to start selling.'}
          </p>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d81395] text-white text-xs font-semibold shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Item</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#151515] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-neutral-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Item</th>
                  <th className="py-3.5 px-4">Tier / Category</th>
                  <th className="py-3.5 px-4">Price (SOL)</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-neutral-900 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-white truncate text-xs" title={p.title}>
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                            {p.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                          {p.tier} Tier
                        </span>
                        <div className="text-[11px] text-neutral-400">{p.category}</div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-white text-xs">
                        <span className="text-[#f4bb28]">{p.price_sol} SOL</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        ~Rp {((p.price_sol || 0) * 2500000).toLocaleString('id-ID')}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          p.in_stock
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Click to toggle stock status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.in_stock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{p.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${p.slug}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                          title="View live in marketplace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/seller/products/edit/${p.id}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={isDeletingId === p.id}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete product"
                        >
                          {isDeletingId === p.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
