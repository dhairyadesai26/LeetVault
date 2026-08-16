import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, FileText, X, Check, Star, ExternalLink } from 'lucide-react';
import { useAppStore } from '../App';
import { motion } from 'framer-motion';
import styles from './SearchOverlay.module.css';
import mainStyles from './MainContent.module.css';

export function SearchOverlay({ onClose }) {
  const { DATA, setSelectedCompanyId, setSidebarView, toggleSolved, isSolved, toggleBookmark, isBookmarked } = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const searchResults = React.useMemo(() => {
    if (query.length < 2) return { companies: [], questions: [] };
    
    const q = query.toLowerCase();
    const companies = DATA.COMPANIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 5);
    
    const questions = [];
    const seen = new Set();
    
    for (const company of DATA.COMPANIES) {
      const qs = DATA.QUESTIONS[company.id] || [];
      for (const question of qs) {
        if (seen.has(question.id)) continue;
        if (question.title.toLowerCase().includes(q) || question.id.toString() === q) {
          seen.add(question.id);
          questions.push({ ...question, companyName: company.name, companyId: company.id });
          if (questions.length >= 8) break;
        }
      }
      if (questions.length >= 8) break;
    }
    
    return { companies, questions };
  }, [query, DATA]);

  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        className={styles.modal}
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className={styles.inputWrapper}>
          <Search size={24} color="var(--accent-primary)" />
          <input 
            ref={inputRef}
            className={styles.input}
            placeholder="Search companies or questions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={18} />
            </button>
          )}
          <span className={styles.kbd}>ESC</span>
        </div>
        
        <div className={styles.results}>
          {query.length < 2 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Type at least 2 characters to search
            </div>
          ) : (
            <>
              {searchResults.companies.length > 0 && (
                <div>
                  <div className={styles.groupTitle}>Companies</div>
                  {searchResults.companies.map(c => (
                    <div 
                      key={c.id} 
                      className={styles.resultItem}
                      onClick={() => {
                        setSelectedCompanyId(c.id);
                        setSidebarView('companies');
                        onClose();
                      }}
                    >
                      <div className={styles.icon}><Building2 size={18} /></div>
                      <div className={styles.resultText}>
                        <div className={styles.resultTitle}>{c.name}</div>
                        <div className={styles.resultSub}>{c.questionCount} questions</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults.questions.length > 0 && (
                <div>
                  <div className={styles.groupTitle}>Questions</div>
                  {searchResults.questions.map(q => {
                    const solved = isSolved(q.companyId, q.id);
                    const bookmarked = isBookmarked(q.id);

                    return (
                      <div key={q.id} className={styles.resultItem}>
                        <div className={styles.icon}><FileText size={18} /></div>
                        <div className={styles.resultText}>
                          <div className={styles.resultTitle}>
                            <a href={q.url} target="_blank" rel="noreferrer" className={styles.titleLink}>
                              {q.id}. {q.title} <ExternalLink size={12} style={{marginLeft: '4px', display: 'inline-block'}} />
                            </a>
                          </div>
                          <div className={styles.resultSub}>
                            <span className={`${mainStyles.badge} ${mainStyles[q.difficulty.toLowerCase()]}`}>
                              {q.difficulty}
                            </span>
                            <span style={{ margin: '0 8px', color: 'var(--border-strong)' }}>•</span>
                            <span style={{fontFamily: 'var(--font-mono)'}}>Acc: {q.acceptance}%</span>
                            <span style={{ margin: '0 8px', color: 'var(--border-strong)' }}>•</span>
                            <span style={{fontFamily: 'var(--font-mono)'}}>Freq: {q.frequency}%</span>
                            <span style={{ margin: '0 8px', color: 'var(--border-strong)' }}>•</span>
                            {q.companyName}
                          </div>
                        </div>
                        <div className={styles.actions}>
                          <div 
                            className={`${mainStyles.checkbox} ${solved ? mainStyles.checked : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSolved(q.companyId, q.id);
                            }}
                            title={solved ? "Mark as unsolved" : "Mark as solved"}
                            style={{ width: '24px', height: '24px' }}
                          >
                            {solved && <Check size={14} strokeWidth={3} />}
                          </div>
                          <button 
                            className={`${mainStyles.bookmarkBtn} ${bookmarked ? mainStyles.active : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(q);
                            }}
                            title={bookmarked ? "Remove bookmark" : "Add bookmark"}
                            style={{ padding: '6px' }}
                          >
                            <Star size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {searchResults.companies.length === 0 && searchResults.questions.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No results found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
