import { useLocation } from 'react-router-dom';
import { Search, Bell, ShoppingCart, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import CartDrawer from './CartDrawer';
import DarkModeToggle from './DarkModeToggle';
import './TopNav.css';

const PAGE_TITLES = {
  '/':           'Dashboard',
  '/pets':       'My Pets',
  '/chat':       'Cuddles AI',
  '/shop':       'Pet Shop',
  '/fresh-food': 'Fresh Food',
  '/admin':      'Admin Panel',
};

export default function TopNav() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const pageTitle = Object.entries(PAGE_TITLES).find(
    ([path]) => path === '/' ? pathname === '/' : pathname.startsWith(path)
  )?.[1] || 'PetSphere';

  useEffect(() => {
    const handleClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCartClose = useCallback(() => setCartOpen(false), []);

  return (
    <>
      <header className="topnav">
        <div className="topnav__left">
          <h2 className="topnav__title">{pageTitle}</h2>
        </div>

        <div className="topnav__right">
          <DarkModeToggle />
          
          {/* Search */}
          <div className="topnav__search">
            <Search size={16} className="topnav__search-icon" />
            <input
              type="text"
              className="topnav__search-input"
              placeholder="Search anything…"
            />
          </div>

          {/* Cart */}
          <button
            className="topnav__icon-btn"
            title="Cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={19} />
            {totalItems > 0 && <span className="topnav__badge">{totalItems}</span>}
          </button>

          {/* Notifications */}
          <div className="topnav__notifications" ref={notificationDropdownRef}>
            <button 
              className="topnav__icon-btn" 
              title="Notifications"
              onClick={(e) => { 
                e.stopPropagation(); 
                setNotificationsOpen(p => !p);
                setHasUnreadNotifications(false); 
              }}
            >
              <Bell size={19} />
              {hasUnreadNotifications && <span className="topnav__dot" />}
            </button>

            {notificationsOpen && (
              <div className="topnav__dropdown topnav__dropdown--notifications">
                <div className="topnav__dropdown-header">
                  <p className="topnav__dropdown-name">Notifications</p>
                  <small>You have 2 new messages</small>
                </div>
                <div className="topnav__dropdown-divider" />
                <div className="topnav__dropdown-item">
                  <div className="notification-item">
                    {hasUnreadNotifications && <span className="notification-dot"></span>}
                    <div>
                      <p>Buddy's vaccine is due soon!</p>
                      <small>2 hours ago</small>
                    </div>
                  </div>
                </div>
                <div className="topnav__dropdown-item">
                  <div className="notification-item">
                    {hasUnreadNotifications && <span className="notification-dot"></span>}
                    <div>
                      <p>New pet supply discount available</p>
                      <small>5 hours ago</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="topnav__profile" ref={profileDropdownRef}>
            <button
              className="topnav__avatar"
              onClick={(e) => { e.stopPropagation(); setProfileOpen(p => !p); }}
            >
              <User size={18} />
            </button>

            {profileOpen && (
              <div className="topnav__dropdown">
                <div className="topnav__dropdown-header">
                  <p className="topnav__dropdown-name">
                    {user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0] || 'Guest'}
                  </p>
                  <small>{user?.email || 'Not signed in'}</small>
                </div>
                <div className="topnav__dropdown-divider" />
                <button className="topnav__dropdown-item logout" onClick={signOut}>
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={handleCartClose} />
    </>
  );
}
