import { useState, useEffect } from 'react';
import { Salad, ShoppingCart, Plus, Leaf, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import GlassCard from '../components/GlassCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import './FreshFoodPage.css';

export default function FreshFoodPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/products?category=Fresh Food');
        setProducts(res.products || []);
      } catch (err) {
        console.error('Fresh food fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getCartQty = (id) => items.find(i => i.id === id)?.quantity || 0;

  return (
    <div className="fresh-page">
      {/* Banner */}
      <GlassCard className="fresh-page__banner">
        <div className="fresh-page__banner-content">
          <div className="fresh-page__banner-icon">
            <Leaf size={28} />
          </div>
          <div>
            <h2>Fresh Pet Food <span className="gradient-text">Delivered Daily</span></h2>
            <p>Nutritious, vet-approved fresh meals made with real ingredients. Delivered to your door.</p>
          </div>
        </div>
        <div className="fresh-page__delivery-info">
          <div className="fresh-page__delivery-badge">
            <Clock size={14} />
            <span>Morning orders → Same-day delivery</span>
          </div>
          <div className="fresh-page__delivery-badge">
            <Clock size={14} />
            <span>Evening orders → Next-day delivery</span>
          </div>
        </div>
      </GlassCard>

      {/* Products */}
      {loading ? (
        <div className="fresh-page__grid">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Salad}
          title="Fresh food coming soon"
          description="We're preparing delicious fresh meals for your pets. Stay tuned!"
        />
      ) : (
        <div className="fresh-page__grid">
          {products.map((product, i) => (
            <GlassCard key={product.id} className="fresh-card" glow="teal" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="fresh-card__img-wrap">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="fresh-card__img" loading="lazy" />
                ) : (
                  <div className="fresh-card__img-placeholder">🥗</div>
                )}
              </div>
              <div className="fresh-card__info">
                <h4>{product.name}</h4>
                {product.description && <p>{product.description}</p>}
                <div className="fresh-card__footer">
                  <span className="fresh-card__price">₹{product.price.toLocaleString()}</span>
                  <button className="btn btn-sm btn-primary" onClick={() => addItem(product)}>
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
