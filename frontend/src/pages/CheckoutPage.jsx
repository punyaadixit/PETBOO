import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag, ArrowLeft, Trash2, Plus, Minus,
  CreditCard, Truck, ShieldCheck, CheckCircle2, Tag
} from 'lucide-react';

const DELIVERY_FEE = 49;

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = cart, 2 = details, 3 = success
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', pincode: '',
    paymentMethod: 'cod',
  });

  const discount = couponApplied ? Math.round(totalPrice * 0.1) : 0;
  const grandTotal = totalPrice + (items.length ? DELIVERY_FEE : 0) - discount;

  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === 'PETCARE10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code.');
      setCouponApplied(false);
    }
  };

  const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      clearCart();
      setStep(3);
    }, 2000);
  };

  /* ── Empty cart ── */
  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ maxWidth: 600, margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add some items from the shop first!</p>
        <Link to="/shop" style={{
          background: 'linear-gradient(135deg, #059669, #0d9488)', color: '#fff',
          padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 700,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <ShoppingBag size={18} /> Go to Shop
        </Link>
      </div>
    );
  }

  /* ── Success State ── */
  if (step === 3) {
    return (
      <div style={{ maxWidth: 520, margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #059669, #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
        }}>
          <CheckCircle2 size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>Order Placed! 🎉</h1>
        <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
          Thank you for your order. Your furry friend's goodies are on their way!
        </p>
        <p style={{ color: '#059669', fontWeight: 600, marginBottom: '2rem' }}>
          Estimated delivery: 3-5 business days
        </p>
        <button
          onClick={() => navigate('/shop')}
          style={{
            background: 'linear-gradient(135deg, #059669, #0d9488)', color: '#fff',
            border: 'none', padding: '0.75rem 2rem', borderRadius: '0.75rem',
            fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          }}
        >
          <ShoppingBag size={18} /> Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => step === 1 ? navigate('/shop') : setStep(1)}
          style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#475569' }}>
          <ArrowLeft size={16} /> {step === 1 ? 'Back to Shop' : 'Back to Cart'}
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          {step === 1 ? 'Your Cart' : 'Checkout'}
        </h1>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        {['Cart', 'Delivery & Payment'].map((label, idx) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8rem',
              background: step > idx ? 'linear-gradient(135deg,#059669,#0d9488)' : step === idx + 1 ? 'linear-gradient(135deg,#059669,#0d9488)' : '#e2e8f0',
              color: step >= idx + 1 ? '#fff' : '#94a3b8',
            }}>{idx + 1}</div>
            <span style={{ fontWeight: 600, color: step === idx + 1 ? '#059669' : '#94a3b8', fontSize: '0.875rem' }}>{label}</span>
            {idx < 1 && <div style={{ width: 40, height: 2, background: step > 1 ? '#059669' : '#e2e8f0', borderRadius: 99 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left Column */}
        <div>
          {step === 1 ? (
            /* ── STEP 1: Cart Items ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: '#fff', borderRadius: '1rem', padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                  display: 'flex', gap: '1rem', alignItems: 'center',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '0.75rem', background: '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0,
                  }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} /> : '🛍️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: 99, fontWeight: 600 }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={13} />
                    </button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg,#059669,#0d9488)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={13} />
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 80 }}>
                    <div style={{ fontWeight: 800, color: '#059669', fontSize: '1.05rem' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>₹{item.price} each</div>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    style={{ background: '#fef2f2', border: 'none', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              {/* Coupon */}
              <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={16} color="#059669" /> Coupon Code
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                    placeholder="Enter coupon (try PETCARE10)"
                    style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                  />
                  <button onClick={handleCoupon}
                    style={{ padding: '0.6rem 1.25rem', borderRadius: '0.65rem', background: 'linear-gradient(135deg,#059669,#0d9488)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    Apply
                  </button>
                </div>
                {couponApplied && <p style={{ color: '#059669', fontWeight: 600, margin: '0.5rem 0 0', fontSize: '0.85rem' }}>✅ 10% discount applied!</p>}
                {couponError && <p style={{ color: '#ef4444', margin: '0.5rem 0 0', fontSize: '0.85rem' }}>{couponError}</p>}
              </div>
            </div>
          ) : (
            /* ── STEP 2: Delivery & Payment Form ── */
            <form onSubmit={handlePlaceOrder}>
              {/* Delivery */}
              <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={18} color="#059669" /> Delivery Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { name: 'name', label: 'Full Name', placeholder: 'Rahul Sharma', full: false },
                    { name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', full: false },
                    { name: 'email', label: 'Email Address', placeholder: 'rahul@email.com', full: true },
                    { name: 'address', label: 'Street Address', placeholder: '123, Sector 6, Bhilai', full: true },
                    { name: 'city', label: 'City', placeholder: 'Bhilai', full: false },
                    { name: 'pincode', label: 'Pin Code', placeholder: '490006', full: false },
                  ].map(field => (
                    <div key={field.name} style={{ gridColumn: field.full ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>{field.label}</label>
                      <input
                        required name={field.name} value={form[field.name]}
                        onChange={handleFormChange} placeholder={field.placeholder}
                        style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#059669'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={18} color="#059669" /> Payment Method
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { value: 'cod', label: 'Cash on Delivery', emoji: '💵' },
                    { value: 'upi', label: 'UPI (GPay / PhonePe / Paytm)', emoji: '📱' },
                    { value: 'card', label: 'Credit / Debit Card', emoji: '💳' },
                  ].map(method => (
                    <label key={method.value} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem',
                      borderRadius: '0.75rem', border: `2px solid ${form.paymentMethod === method.value ? '#059669' : '#e2e8f0'}`,
                      background: form.paymentMethod === method.value ? '#f0fdf4' : '#fff',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <input type="radio" name="paymentMethod" value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleFormChange} style={{ accentColor: '#059669' }} />
                      <span style={{ fontSize: '1.25rem' }}>{method.emoji}</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isPlacing} style={{
                width: '100%', padding: '1rem', borderRadius: '0.85rem',
                background: 'linear-gradient(135deg, #059669, #0d9488)',
                color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem',
                cursor: isPlacing ? 'not-allowed' : 'pointer', opacity: isPlacing ? 0.8 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                {isPlacing ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite', width: 20, height: 20 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <><ShieldCheck size={20} /> Place Order — ₹{grandTotal.toLocaleString()}</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column — Order Summary */}
        <div style={{
          background: '#fff', borderRadius: '1.25rem', padding: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
          position: 'sticky', top: '1rem',
        }}>
          <h3 style={{ fontWeight: 800, color: '#1e293b', margin: '0 0 1.25rem', fontSize: '1.1rem' }}>Order Summary</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#475569' }}>{item.name} <span style={{ color: '#94a3b8' }}>×{item.quantity}</span></span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>Delivery</span>
              <span style={{ fontWeight: 600 }}>₹{DELIVERY_FEE}</span>
            </div>
            {couponApplied && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#059669' }}>Coupon (PETCARE10)</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>−₹{discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #f1f5f9',
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#059669' }}>₹{grandTotal.toLocaleString()}</span>
          </div>

          {step === 1 && (
            <button onClick={() => setStep(2)} style={{
              width: '100%', marginTop: '1.25rem', padding: '0.9rem',
              borderRadius: '0.85rem', background: 'linear-gradient(135deg,#059669,#0d9488)',
              color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              Proceed to Checkout →
            </button>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
            <ShieldCheck size={13} /> Secure checkout • Free returns
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
