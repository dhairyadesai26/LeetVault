import React from 'react';
import { useAppStore } from '../App';
import { Sun, Moon, ExternalLink, Check, Star, X, PanelLeft, Search, GitBranch, Bell, User, Home, Code2, Terminal, Blocks, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionTable } from './QuestionTable';
import styles from './MainContent.module.css';

const PERIOD_LABELS = {
  'thirty-days': 'Last 30 Days',
  'three-months': 'Last 3 Months',
  'six-months': 'Last 6 Months',
  'more-than-six-months': '6+ Months',
  'all': 'All Time',
};
const PERIOD_ORDER = ['thirty-days', 'three-months', 'six-months', 'more-than-six-months', 'all'];

function HeroGraphic() {
  return (
    <div className={styles.heroContainer}>
      <motion.div 
        className={`${styles.heroCard} ${styles.heroCardLeft}`}
        animate={{ y: [0, -10, 0], rotate: [-6, -4, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Blocks size={24} className={styles.heroIconSmall} />
      </motion.div>
      
      <motion.div 
        className={`${styles.heroCard} ${styles.heroCardRight}`}
        animate={{ y: [0, 10, 0], rotate: [6, 4, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Terminal size={24} className={styles.heroIconSmall} />
      </motion.div>

      <motion.div 
        className={styles.heroCardCenter}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className={styles.heroGlow} />
        <Code2 size={48} strokeWidth={1.5} className={styles.heroIconMain} />
      </motion.div>
    </div>
  );
}

function TopHeader({ title }) {
  const { user, theme, toggleTheme, isSidebarOpen, setIsSidebarOpen, setIsSearchOpen, setSidebarView, setSelectedCompanyId, logout } = useAppStore();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);
  const [showProfile, setShowProfile] = React.useState(false);
  
  return (
    <header className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isSidebarOpen && (
          <button className={styles.themeToggle} onClick={() => setIsSidebarOpen(true)}>
            <PanelLeft size={20} />
          </button>
        )}
        <div className={styles.logo}>
          <img src="/logo.jpg" alt="Logo" className={styles.logoImg} />
          <div className={styles.logoText}>
            <span className="text-gradient">Leet</span>Vault
          </div>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 8px' }} />
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          className={styles.navBtn} 
          onClick={() => {
            setSidebarView('companies');
            setSelectedCompanyId(null);
          }}
          title="Trending Questions"
        >
          <Home size={16} /> Home
        </button>
        <button className={styles.navBtn} onClick={() => setIsSearchOpen(true)} title="Global Search">
          <Search size={16} /> Search
        </button>
        <button className={styles.themeToggle} onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div style={{ position: 'relative' }}>
          <button 
            className={styles.themeToggle} 
            title="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
              setShowProfile(false);
            }}
          >
            <Bell size={18} />
            {hasUnread && <span className={styles.notificationBadge}></span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={styles.notificationPopup}
              >
                <div className={styles.notificationHeader}>
                  <h4>What's New</h4>
                  <button onClick={() => setShowNotifications(false)} className={styles.closeNotification}>
                    <X size={14} />
                  </button>
                </div>
                <div className={styles.notificationBody}>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationDot}></span>
                    <p>New updates and features are coming out soon! Stay tuned for awesome new features.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            className={styles.profileAvatarBtn} 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <User size={18} />}
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={styles.profilePopup}
              >
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatarLarge}>
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : <User size={24} />}
                  </div>
                  <div>
                    <div className={styles.profileName}>{user?.name || 'User'}</div>
                    <div className={styles.profileEmail}>{user?.email || ''}</div>
                  </div>
                </div>
                <div className={styles.profileBody}>
                  <button className={styles.logoutBtn} onClick={logout}>
                     <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

export function MainContent() {
  const { 
    DATA, theme, toggleTheme,
    sidebarView, selectedCompanyId,
    period, setPeriod,
    difficulty, setDifficulty,
    sortConfig, handleSort,
    filteredQuestions,
    solved, toggleSolved, isSolved,
    toggleBookmark, isBookmarked,
    isSidebarOpen, setIsSidebarOpen,
    bookmarks
  } = useAppStore();

  const company = selectedCompanyId ? DATA.COMPANIES.find(c => c.id === selectedCompanyId) : null;

  const globalStats = React.useMemo(() => {
    const uniqueQuestions = new Set();
    const qDiffMap = new Map();
    let easy = 0, medium = 0, hard = 0;
    
    for (const compQs of Object.values(DATA.QUESTIONS)) {
      for (const q of compQs) {
        if (!uniqueQuestions.has(q.id)) {
          uniqueQuestions.add(q.id);
          qDiffMap.set(String(q.id), q.difficulty);
          if (q.difficulty === 'Easy') easy++;
          else if (q.difficulty === 'Medium') medium++;
          else if (q.difficulty === 'Hard') hard++;
        }
      }
    }

    const uniqueSolved = new Set();
    let solvedEasy = 0, solvedMedium = 0, solvedHard = 0;

    for (const key of Object.keys(solved)) {
      const [, qId] = key.split(':');
      if (qId && !uniqueSolved.has(qId)) {
        uniqueSolved.add(qId);
        const diff = qDiffMap.get(qId);
        if (diff === 'Easy') solvedEasy++;
        else if (diff === 'Medium') solvedMedium++;
        else if (diff === 'Hard') solvedHard++;
      }
    }
    
    return {
      totalCompanies: DATA.COMPANIES.length,
      totalQuestions: uniqueQuestions.size,
      totalSolved: uniqueSolved.size,
      totalBookmarks: Object.keys(bookmarks).length,
      easy, medium, hard,
      solvedEasy, solvedMedium, solvedHard
    };
  }, [DATA, solved, bookmarks]);

  const companyStats = React.useMemo(() => {
    if (!company) return null;
    let solvedEasy = 0;
    let solvedMedium = 0;
    let solvedHard = 0;
    let solvedTotal = 0;
    
    const qs = DATA.QUESTIONS[company.id] || [];
    for (const q of qs) {
      if (solved[`${company.id}:${q.id}`]) {
        solvedTotal++;
        if (q.difficulty === 'Easy') solvedEasy++;
        else if (q.difficulty === 'Medium') solvedMedium++;
        else if (q.difficulty === 'Hard') solvedHard++;
      }
    }
    
    return { solvedEasy, solvedMedium, solvedHard, solvedTotal };
  }, [company, DATA, solved]);

  const [randomQuestions] = React.useState(() => {
    const topCompanies = ['google', 'amazon', 'facebook', 'apple', 'microsoft', 'netflix', 'bloomberg', 'uber', 'meta'];
    const targetCompanies = DATA.COMPANIES.filter(c => topCompanies.includes(c.name.toLowerCase()));
    
    const pool = [];
    const seen = new Set();
    
    for (const c of targetCompanies) {
      const qs = DATA.QUESTIONS[c.id] || [];
      for (const q of qs.slice(0, 10)) {
        if (!seen.has(q.id)) {
          seen.add(q.id);
          pool.push({ ...q, companyId: c.id, companyName: c.name });
        }
      }
    }
    
    return pool.sort(() => 0.5 - Math.random()).slice(0, 50);
  });

  if (sidebarView === 'bookmarks') {
    const bookmarkedQuestions = Object.values(bookmarks);

    return (
      <main className={styles.main}>
        <TopHeader title="⭐ Bookmarks" />
        <div style={{ padding: '32px' }}>
          <QuestionTable 
            questions={bookmarkedQuestions} 
            sortConfig={{ key: 'id' }} 
            handleSort={() => {}} 
          />
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className={styles.main}>
        <TopHeader title="Welcome to LeetVault" />
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '40px', textAlign: 'center', flexShrink: 0, marginTop: '20px' }}>
            <HeroGraphic />
            <h2 className="text-gradient" style={{ fontSize: '32px', fontWeight: 800, marginTop: '16px' }}>Explore Premium Questions</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
              Select a company from the sidebar or press <kbd style={{ background: 'var(--bg-surface-elevated)', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--border-subtle)' }}>Ctrl K</kbd> to search globally.
            </p>
          </div>

          <div style={{ padding: '0 32px' }}>
            <div className={styles.statsBar}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Solved</div>
                <div className={`${styles.statValue} text-gradient`}>
                  {globalStats.totalSolved} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {globalStats.totalQuestions}</span>
                </div>
                <div className={styles.statSub}>Across {globalStats.totalCompanies} companies</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Easy Solved</div>
                <div className={styles.statValue} style={{ color: 'var(--easy-color)' }}>
                  {globalStats.solvedEasy} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {globalStats.easy}</span>
                </div>
                <div className={styles.statSub}>{Math.round((globalStats.solvedEasy / globalStats.easy) * 100) || 0}% completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Medium Solved</div>
                <div className={styles.statValue} style={{ color: 'var(--medium-color)' }}>
                  {globalStats.solvedMedium} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {globalStats.medium}</span>
                </div>
                <div className={styles.statSub}>{Math.round((globalStats.solvedMedium / globalStats.medium) * 100) || 0}% completed</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Hard Solved</div>
                <div className={styles.statValue} style={{ color: 'var(--hard-color)' }}>
                  {globalStats.solvedHard} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {globalStats.hard}</span>
                </div>
                <div className={styles.statSub}>{Math.round((globalStats.solvedHard / globalStats.hard) * 100) || 0}% completed</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 32px 32px', flex: 1, marginTop: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-secondary)' }}>Trending Questions</h3>
            <QuestionTable 
              questions={randomQuestions} 
              sortConfig={{ key: 'frequency' }} 
              handleSort={() => {}} 
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <TopHeader title={company.name} />

      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Solved</div>
          <div className={`${styles.statValue} text-gradient`}>
            {companyStats.solvedTotal} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {company.questionCount}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Easy</div>
          <div className={styles.statValue} style={{ color: 'var(--easy-color)' }}>
            {companyStats.solvedEasy} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {company.easy}</span>
          </div>
          <div className={styles.statSub}>{Math.round(company.easy ? (companyStats.solvedEasy / company.easy * 100) : 0)}% done</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Medium</div>
          <div className={styles.statValue} style={{ color: 'var(--medium-color)' }}>
            {companyStats.solvedMedium} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {company.medium}</span>
          </div>
          <div className={styles.statSub}>{Math.round(company.medium ? (companyStats.solvedMedium / company.medium * 100) : 0)}% done</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Hard</div>
          <div className={styles.statValue} style={{ color: 'var(--hard-color)' }}>
            {companyStats.solvedHard} <span style={{fontSize: '18px', color: 'var(--text-muted)'}}>/ {company.hard}</span>
          </div>
          <div className={styles.statSub}>{Math.round(company.hard ? (companyStats.solvedHard / company.hard * 100) : 0)}% done</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.periodTabs}>
          {PERIOD_ORDER.map(p => {
            const isAvail = company.periods.includes(p);
            return (
              <button 
                key={p}
                className={`${styles.periodTab} ${period === p ? styles.active : ''} ${!isAvail ? styles.disabled : ''}`}
                onClick={() => isAvail && setPeriod(p)}
              >
                {PERIOD_LABELS[p]}
              </button>
            )
          })}
        </div>
        
        <div className={styles.diffFilters}>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button
              key={d}
              className={`${styles.diffBtn} ${styles[d.toLowerCase()]} ${difficulty === d ? styles.active : ''}`}
              onClick={() => setDifficulty(difficulty === d ? null : d)}
            >
              {d}
            </button>
          ))}
          {(period !== 'all' || difficulty !== null) && (
            <button 
              className={styles.clearFiltersBtn}
              onClick={() => { setPeriod('all'); setDifficulty(null); }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <QuestionTable 
        questions={filteredQuestions} 
        sortConfig={sortConfig} 
        handleSort={handleSort} 
        companyId={company.id} 
        className={styles.tableContainer}
      />
    </main>
  );
}
