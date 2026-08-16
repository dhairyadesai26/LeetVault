import { useState, useEffect, useCallback, useMemo } from 'react';
import DATA from '../data.json';
import { account, databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, Permission, Role } from '../lib/appwrite';

export function useStore() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [theme, setTheme] = useState('dark');
  const [bookmarks, setBookmarks] = useState({});
  const [solved, setSolved] = useState({});
  
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [sidebarView, setSidebarView] = useState('companies'); // 'companies' | 'bookmarks'
  
  const [period, setPeriod] = useState('all');
  const [difficulty, setDifficulty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sortConfig, setSortConfig] = useState({ key: 'frequency', direction: 'desc' });

  // Init auth state
  useEffect(() => {
    account.get()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setIsInitializing(false));
  }, []);

  // Fetch or create user document on login
  useEffect(() => {
    if (user) {
      databases.getDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, user.$id)
        .then(doc => {
          if (doc.bookmarks) setBookmarks(JSON.parse(doc.bookmarks));
          if (doc.solved) setSolved(JSON.parse(doc.solved));
          if (doc.theme) setTheme(doc.theme);
        })
        .catch(err => {
          console.error("Appwrite getDocument error:", err);
          if (err.code === 404) {
            databases.createDocument(
              APPWRITE_DATABASE_ID, 
              APPWRITE_COLLECTION_ID, 
              user.$id, 
              {
                bookmarks: '{}',
                solved: '{}',
                theme: 'dark'
              },
              [
                Permission.read(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id))
              ]
            ).catch(e => console.error("Appwrite createDocument error:", e));
          }
        });
    } else {
      setBookmarks({});
      setSolved({});
      setTheme('dark');
    }
  }, [user]);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const syncToCloud = useCallback((data) => {
    if (!user) return;
    databases.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, user.$id, data).catch(console.error);
  }, [user]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      syncToCloud({ theme: next });
      return next;
    });
  }, [syncToCloud]);

  const logout = useCallback(async () => {
    await account.deleteSession('current');
    setUser(null);
  }, []);

  // Solved logic
  const toggleSolved = useCallback((companyId, questionId) => {
    setSolved(prev => {
      const key = `${companyId}:${questionId}`;
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      syncToCloud({ solved: JSON.stringify(next) });
      return next;
    });
  }, [syncToCloud]);

  const isSolved = useCallback((companyId, questionId) => {
    return !!solved[`${companyId}:${questionId}`];
  }, [solved]);

  // Bookmarks logic
  const toggleBookmark = useCallback((question) => {
    setBookmarks(prev => {
      const next = { ...prev };
      if (next[question.id]) {
        delete next[question.id];
      } else {
        next[question.id] = question;
      }
      syncToCloud({ bookmarks: JSON.stringify(next) });
      return next;
    });
  }, [syncToCloud]);

  const isBookmarked = useCallback((questionId) => {
    return !!bookmarks[questionId];
  }, [bookmarks]);

  // Filtering and Sorting
  const filteredQuestions = useMemo(() => {
    if (!selectedCompanyId) return [];
    
    let qs = DATA.QUESTIONS[selectedCompanyId] || [];

    if (period !== 'all') {
      qs = qs.filter(q => q.periods.includes(period));
    }

    if (difficulty) {
      qs = qs.filter(q => q.difficulty === difficulty);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      qs = qs.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.id.toString().includes(q)
      );
    }

    // Sort
    qs = [...qs].sort((a, b) => {
      let va = a[sortConfig.key];
      let vb = b[sortConfig.key];
      
      if (sortConfig.key === 'title') {
        va = va.toLowerCase();
        vb = vb.toLowerCase();
      } else if (sortConfig.key === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        va = order[va] || 0;
        vb = order[vb] || 0;
      }
      
      if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
      if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return qs;
  }, [selectedCompanyId, period, difficulty, searchQuery, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: key === 'title' ? 'asc' : 'desc' };
    });
  }, []);

  return {
    DATA,
    user, setUser, isInitializing, logout,
    theme, toggleTheme,
    bookmarks, toggleBookmark, isBookmarked,
    solved, toggleSolved, isSolved,
    selectedCompanyId, setSelectedCompanyId,
    sidebarView, setSidebarView,
    period, setPeriod,
    difficulty, setDifficulty,
    searchQuery, setSearchQuery,
    sortConfig, handleSort,
    filteredQuestions
  };
}
