import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import AnimatedBackground from '../components/AnimatedBackground';
import './AppLayout.css';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <AnimatedBackground />
      <div className="app-layout__container">
        <Sidebar />
        <div className="app-layout__main">
          <TopNav />
          <main className="app-layout__content page-enter" key={location.pathname}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
