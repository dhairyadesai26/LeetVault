import React, { createContext, useContext } from 'react';
import { useStore } from './hooks/useStore';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { SearchOverlay } from './components/SearchOverlay';
import { LandingPage } from './components/LandingPage/LandingPage';
import { AnimatePresence } from 'framer-motion';

export const StoreContext = createContext(null);

export const useAppStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useAppStore must be used within StoreProvider');
  return context;
};

export default function App() {
  const store = useStore();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (store.isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Loading Vault...</div>
      </div>
    );
  }

  if (!store.user) {
    return <LandingPage onLoginSuccess={(u) => store.setUser(u)} />;
  }

  return (
    <StoreContext.Provider value={{ ...store, isSearchOpen, setIsSearchOpen, isSidebarOpen, setIsSidebarOpen }}>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar />
        <MainContent />
        <AnimatePresence>
          {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
}
