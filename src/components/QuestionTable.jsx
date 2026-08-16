import React from 'react';
import { ExternalLink, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../App';
import styles from './MainContent.module.css'; // Reusing styles

export function QuestionTable({ questions, sortConfig, handleSort, companyId, className = '' }) {
  const { toggleSolved, isSolved, toggleBookmark, isBookmarked } = useAppStore();

  return (
    <div className={className}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '40px' }}>✓</th>
            <th onClick={() => handleSort('id')} className={sortConfig?.key === 'id' ? styles.sorted : ''}>#</th>
            <th onClick={() => handleSort('title')} className={sortConfig?.key === 'title' ? styles.sorted : ''}>Title</th>
            <th onClick={() => handleSort('difficulty')} className={sortConfig?.key === 'difficulty' ? styles.sorted : ''}>Difficulty</th>
            <th onClick={() => handleSort('acceptance')} className={sortConfig?.key === 'acceptance' ? styles.sorted : ''}>Acceptance</th>
            <th onClick={() => handleSort('frequency')} className={sortConfig?.key === 'frequency' ? styles.sorted : ''}>Frequency</th>
            <th style={{ width: '40px' }}>★</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {questions.map(q => {
              // Ensure we have the correct companyId for the question
              const compId = q.companyId || companyId || 'unknown';
              const solved = isSolved(compId, q.id);
              const bookmarked = isBookmarked(q.id);
              
              return (
                <motion.tr 
                  key={`${compId}-${q.id}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`${styles.tableRow} ${solved ? styles.solved : ''}`}
                >
                  <td>
                    <div 
                      className={`${styles.checkbox} ${solved ? styles.checked : ''}`}
                      onClick={() => toggleSolved(compId, q.id)}
                    >
                      {solved && <Check size={14} strokeWidth={3} />}
                    </div>
                  </td>
                  <td className={styles.idCol}>{q.id}</td>
                  <td>
                    <a href={q.url} target="_blank" rel="noreferrer" className={styles.titleLink}>
                      {q.title} <ExternalLink size={14} />
                    </a>
                    {q.companyName && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {q.companyName}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[q.difficulty.toLowerCase()]}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className={styles.mono}>{q.acceptance}%</td>
                  <td>
                    <div className={styles.freqBarContainer}>
                      <div className={styles.freqBar}>
                        <div className={styles.freqBarFill} style={{ width: `${q.frequency}%` }} />
                      </div>
                      <span className={styles.mono}>{q.frequency}%</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`${styles.bookmarkBtn} ${bookmarked ? styles.active : ''}`}
                      onClick={() => toggleBookmark({ ...q, companyId: compId })}
                    >
                      <Star size={18} fill={bookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {questions.length === 0 && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No questions found.</p>
        </div>
      )}
    </div>
  );
}
