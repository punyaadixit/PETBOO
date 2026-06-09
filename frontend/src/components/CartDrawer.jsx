import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="cart-drawer" role="dialog" aria-label="Shopping Cart">
        {/* Header */}
        <div className="cart-drawer__header">
          <h3>
            <ShoppingCart size={22} />
            My Cart
            {totalItems > 0 && <span className="cart-drawer__count">{totalItems}</span>}
          </h3>
          <button className="cart-drawer__close" onClick={onClose} title="Close Cart">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">
              <ShoppingBag size={36} />
            </div>
            <p>Your cart is empty</p>
            <small>Add some pet goodies from the shop!</small>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              <ShoppingBag size={16} /> Browse Shop
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item, i) => (
                <div
                  className="cart-item"
                  key={item.id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="cart-item__image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      '🛍️'
                    )}
                  </div>
                  <div className="cart-item__info">
                    <div className="cart-item__name">{item.name}</div>
                    <div className="cart-item__price">₹{item.price.toLocaleString()}</div>
                  </div>
                  <div className="cart-item__controls">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      title="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cart-item__qty">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      title="Increase"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-drawer__footer">
              <div className="cart-drawer__totals">
                <div className="cart-drawer__total-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="cart-drawer__total-row">
                  <span>Delivery</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Free</span>
                </div>
                <div className="cart-drawer__total-row cart-drawer__total-row--grand">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="cart-drawer__actions">
                <button className="btn btn-sm cart-drawer__clear" onClick={clearCart}>
                  <Trash2 size={14} /> Clear
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => { onClose(); navigate('/checkout'); }}>
                  Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
