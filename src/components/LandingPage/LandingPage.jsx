import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { account, ID } from '../../lib/appwrite';
import styles from './LandingPage.module.css';
import { Building2, Code2, TrendingUp, Sparkles, Terminal, GitBranch } from 'lucide-react';
import DATA from '../../data.json';

const COMPANIES = [
  "Google", "Amazon", "Meta", "Apple", "Netflix", "Microsoft",
  "Bloomberg", "Uber", "Lyft", "Stripe", "Airbnb", "ByteDance"
];

export function LandingPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState('');

  const uniqueCount = React.useMemo(() => {
    const ids = new Set();
    for (const compQs of Object.values(DATA.QUESTIONS)) {
      for (const q of compQs) {
        ids.add(q.id);
      }
    }
    return ids.size;
  }, []);

  // Handle email verification if returning from magic link
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    if (userId && secret) {
      setLoading(true);
      setShowAuth(true);
      account.updateVerification(userId, secret)
        .then(() => {
          setSuccessMsg('Email verified successfully! You can now log in.');
          setIsLogin(true);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          setError('Verification failed: ' + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!isLogin && !otpStep) {
        // Step 1: Sign up
        await account.create(ID.unique(), email, password, name);
        // Step 2: Login temporarily to send verification email
        await account.createEmailPasswordSession(email, password);
        await account.createEmailVerification(window.location.origin + window.location.pathname);
        // Step 3: Logout to prevent bypassing MFA
        await account.deleteSession('current');

        setSuccessMsg('Account created! Please check your email to verify your address before logging in.');
        setIsLogin(true);
        setOtpStep(false);
        setPassword('');
        setLoading(false);
        return;
      }

      if (!otpStep) {
        // Step 1: Password Authentication
        try {
          await account.createEmailPasswordSession(email, password);

          // Step 2: Check verification and try to create MFA Challenge
          const user = await account.get();
          if (!user.emailVerification) {
            await account.deleteSession('current');
            throw new Error('Your email address is not verified. Please check your inbox for the verification link.');
          }

          if (!user.mfa) {
            await account.updateMFA(true);
          }

          const challenge = await account.createMFAChallenge('email');
          setChallengeId(challenge.$id);
          setOtpStep(true);
        } catch (authError) {
          // If the account already has MFA enabled, Appwrite throws this error upon login or getting the account.
          // This means the password was correct, and we can proceed directly to the OTP challenge!
          if (authError.message === 'More factors are required to complete the sign in process.' || authError.type === 'user_more_factors_required' || authError.code === 401) {
            try {
              const challenge = await account.createMFAChallenge('email');
              setChallengeId(challenge.$id);
              setOtpStep(true);
            } catch (mfaErr) {
              await account.deleteSession('current');
              throw new Error('Security Error: ' + (mfaErr.message || 'Unable to initiate Two-Factor Authentication.'));
            }
          } else {
            throw authError;
          }
        }
      } else {
        // Step 3: Verify OTP
        try {
          await account.updateMFAChallenge(challengeId, otp);
          const user = await account.get();
          onLoginSuccess(user);
        } catch (otpError) {
          throw new Error('Invalid OTP. Please check the 6-digit code and try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroBackground}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.noiseOverlay} />
      </div>

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src="/logo.jpg" alt="Logo" className={styles.logoImg} />
          <div className={styles.logoText}>LeetVault</div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.badge}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Premium Access Only
          </div>
          <h1 className={styles.title}>Master Your Next<br />Tech Interview.</h1>
          <p className={styles.subtitle}>
            Unlock {uniqueCount.toLocaleString()}+ exclusive company-wise interview questions. Track your progress, bookmark hard problems, and get hired faster at top tech giants.
          </p>
          <button
            className={styles.getStartedBtn}
            onClick={() => setShowAuth(true)}
          >
            Get Started Now <Terminal size={20} style={{ marginLeft: '12px' }} />
          </button>
        </motion.div>
      </main>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {/* Duplicate the array twice for seamless infinite scrolling */}
          {[...COMPANIES, ...COMPANIES, ...COMPANIES].map((company, i) => (
            <div key={i} className={styles.companyLogo}>
              {company}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.featuresGrid}>
        <motion.div
          className={styles.featureCard}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ y: -5 }}
        >
          <div className={styles.featureIcon}><Building2 size={28} /></div>
          <h3 className={styles.featureTitle}>Company Specific</h3>
          <p className={styles.featureDesc}>Filter questions by top tech companies including Google, Amazon, Meta, and Apple. Focus your prep on where you're interviewing.</p>
        </motion.div>

        <motion.div
          className={styles.featureCard}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          whileHover={{ y: -5 }}
        >
          <div className={styles.featureIcon}><Code2 size={28} /></div>
          <h3 className={styles.featureTitle}>Track Progress</h3>
          <p className={styles.featureDesc}>Mark questions as solved and watch your completion percentage grow. See exactly how ready you are for the real thing.</p>
        </motion.div>

        <motion.div
          className={styles.featureCard}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ y: -5 }}
        >
          <div className={styles.featureIcon}><TrendingUp size={28} /></div>
          <h3 className={styles.featureTitle}>Cloud Sync</h3>
          <p className={styles.featureDesc}>Your bookmarks, preferences, and progress are securely synced using a blazing fast Appwrite cloud database infrastructure.</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAuth && (
          <div className={styles.modalOverlay}>
            <motion.div
              className={styles.authContainer}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button className={styles.closeModalBtn} onClick={() => { setShowAuth(false); setOtpStep(false); }}>×</button>
              <h2 className={styles.authTitle}>{otpStep ? 'Two-Factor Auth' : isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className={styles.authSubtitle}>
                {otpStep ? 'Enter the 6-digit OTP sent to your email.' : isLogin ? 'Enter your details to access your vault.' : 'Sign up to start tracking your progress.'}
              </p>

              {error && <div className={styles.error}>{error}</div>}
              {successMsg && <div className={styles.error} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }}>{successMsg}</div>}

              <form onSubmit={handleSubmit}>
                {!otpStep ? (
                  <div className={styles.inputGroup}>
                    {!isLogin && (
                      <input
                        type="text"
                        placeholder="Full Name"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    )}
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className={styles.input}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                ) : (
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      placeholder="Enter OTP (e.g. 123456)"
                      className={styles.input}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      minLength={6}
                      maxLength={6}
                      style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '24px' }}
                    />
                  </div>
                )}

                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? 'Processing...' : otpStep ? 'Verify OTP' : isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              {!otpStep && (
                <div className={styles.toggleText}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    className={styles.toggleLink}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <a
            href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
            target="_blank"
            rel="noreferrer"
            className={styles.footerLink}
          >
            <GitBranch size={14} /> Data by snehasishroy
          </a>
          <span className={styles.footerDot}>•</span>
          <span className={styles.footerCredit}>
            <Code2 size={14} /> Developed by Dhairya
          </span>
        </div>
      </footer>
    </div>
  );
}
