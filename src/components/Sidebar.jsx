import React, { useState, useMemo } from 'react';
import { Search, Building2, Bookmark, X, PanelLeftClose, Home, GitBranch, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../App';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { 
    DATA, 
    selectedCompanyId, 
    setSelectedCompanyId,
    sidebarView,
    setSidebarView,
    setIsSearchOpen,
    solved,
    isSidebarOpen,
    setIsSidebarOpen,
    logout
  } = useAppStore();

  const [filterText, setFilterText] = useState('');

  const filteredCompanies = useMemo(() => {
    if (!filterText) return DATA.COMPANIES;
    const q = filterText.toLowerCase();
    return DATA.COMPANIES.filter(c => c.name.toLowerCase().includes(q) || c.id.includes(q));
  }, [DATA.COMPANIES, filterText]);

  const getCompanyProgress = (companyId) => {
    const qs = DATA.QUESTIONS[companyId] || [];
    if (qs.length === 0) return { solved: 0, total: 0, percent: 0 };
    let solvedCount = 0;
    for (const q of qs) {
      if (solved[`${companyId}:${q.id}`]) solvedCount++;
    }
    return {
      solved: solvedCount,
      total: qs.length,
      percent: (solvedCount / qs.length) * 100
    };
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside 
          className={styles.sidebar}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 340, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className={styles.closeBtn}
                title="Close Sidebar"
              >
                <PanelLeftClose size={20} />
              </button>
            </div>
        
        <button className={styles.searchBtn} onClick={() => setIsSearchOpen(true)}>
          <Search size={18} />
          <span>Search everything...</span>
          <span className={styles.kbd}>Ctrl K</span>
        </button>
      </div>

      <div className={styles.nav}>

        <button 
          className={`${styles.navBtn} ${sidebarView === 'companies' && selectedCompanyId ? styles.active : ''}`}
          onClick={() => setSidebarView('companies')}
        >
          <Building2 size={16} /> Companies
        </button>
        <button 
          className={`${styles.navBtn} ${sidebarView === 'bookmarks' ? styles.active : ''}`}
          onClick={() => setSidebarView('bookmarks')}
        >
          <Bookmark size={16} /> Bookmarks
        </button>
      </div>

      {sidebarView === 'companies' && (
        <>
          <div className={styles.filterWrapper}>
            <input 
              type="text" 
              className={styles.companyFilter}
              placeholder="Filter companies..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
            {filterText && (
              <button className={styles.clearFilterBtn} onClick={() => setFilterText('')}>
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className={styles.list}>
            {filteredCompanies.map(company => {
              const isActive = selectedCompanyId === company.id;
              const progress = getCompanyProgress(company.id);
              
              return (
                <div 
                  key={company.id}
                  className={`${styles.companyItem} ${isActive ? styles.active : ''}`}
                  onClick={() => setSelectedCompanyId(company.id)}
                >
                  <div className={styles.companyInfo}>
                    <div className={styles.companyAvatar}>
                      {company.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.companyDetails}>
                      <div className={styles.companyName}>{company.name}</div>
                      {progress.percent > 0 && (
                        <div className={styles.companyProgress}>
                          <div 
                            className={styles.companyProgressFill} 
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.companyCount}>
                    {progress.solved > 0 ? `${progress.solved}/${company.questionCount}` : company.questionCount}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className={styles.footer}>
            <a 
              href="https://github.com/snehasishroy/leetcode-companywise-interview-questions" 
              target="_blank" 
              rel="noreferrer" 
              className={styles.creditLink}
            >
              <GitBranch size={14} />
              <span>Data by snehasishroy</span>
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
