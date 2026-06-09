import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Tag, Search } from 'lucide-react';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import GlassCard from '../components/GlassCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import './ShopPage.css';

const CATEGORIES = ['All', 'Packaged Food', 'Toys', 'Accessories'];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, items } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const params = activeCategory === 'All'
          ? '?excludeCategory=Fresh Food'
          : `?category=${encodeURIComponent(activeCategory)}`;
        const res = await api.get(`/products${params}`);
        setProducts(res.products || []);
      } catch (err) {
        console.error('Products fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    load();
  }, [activeCategory]);

  const filtered = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

  const getCartQty = (id) => items.find(i => i.id === id)?.quantity || 0;

  return (
    <div className="shop-page">
      <div className="shop-page__header">
        <div>
          <p style={{ fontWeight: 600 }}>{filtered.length} products available</p>
        </div>
        <div className="shop-page__search">
          <Search size={16} />
          <input
            className="input-field"
            placeholder="Search products…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="shop-page__tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`shop-page__tab ${activeCategory === cat ? 'shop-page__tab--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="shop-page__grid">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Tag} title="No products found" description="Try a different category or search term." />
      ) : (
        <div className="shop-page__grid">
          {filtered.map((product, i) => (
            <GlassCard key={product.id} className="product-card" glow="pink" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="product-card__img-wrap">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="product-card__img" loading="lazy" />
                ) : (
                  <div className="product-card__img-placeholder">🛍️</div>
                )}
                <span className="badge badge-teal product-card__badge">{product.category}</span>
              </div>
              <div className="product-card__info">
                <h4 className="product-card__name">{product.name}</h4>
                {product.description && (
                  <p className="product-card__desc">{product.description}</p>
                )}
                <div className="product-card__footer">
                  <span className="product-card__price">₹{product.price.toLocaleString()}</span>
                  {getCartQty(product.id) > 0 ? (
                    <span className="badge badge-purple">
                      <ShoppingCart size={12} /> {getCartQty(product.id)} in cart
                    </span>
                  ) : null}
                  <button className="btn btn-sm btn-primary product-card__add" onClick={() => addItem(product)}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
