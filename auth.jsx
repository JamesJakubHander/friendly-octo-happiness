// Pilsen Patriots — Firebase Auth

// ── Firebase init (runs once on load) ───────────────────────────────────────
let _auth = null;
let _authReady = false;

function initFirebase() {
  if (_auth) return _auth;
  const cfg = window.PP_FIREBASE_CONFIG;
  if (!cfg || cfg.apiKey === 'YOUR_API_KEY') {
    console.warn('[PP] Firebase not configured — auth disabled.');
    return null;
  }
  try {
    const { initializeApp, getAuth } = window.firebaseLib;
    const app = initializeApp(cfg);
    _auth = getAuth(app);
    return _auth;
  } catch (e) {
    console.error('[PP] Firebase init failed:', e);
    return null;
  }
}

// ── Auth state hook ──────────────────────────────────────────────────────────
// Returns { user, loading } — user is null when signed out.
function useAuth() {
  const [user, setUser] = React.useState(undefined); // undefined = still loading
  React.useEffect(() => {
    const auth = initFirebase();
    if (!auth) { setUser(null); return; }
    const { onAuthStateChanged } = window.firebaseLib;
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null));
    return unsub;
  }, []);
  return { user, loading: user === undefined };
}

// ── Sign-in / Sign-up sheet ──────────────────────────────────────────────────
function AuthModal({ onClose }) {
  const [mode, setMode] = React.useState('signin'); // 'signin' | 'signup'
  const [name,  setName]  = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pass,  setPass]  = React.useState('');
  const [error, setError] = React.useState('');
  const [busy,  setBusy]  = React.useState(false);

  const friendly = (code) => ({
    'auth/email-already-in-use': 'That email already has an account — try signing in.',
    'auth/invalid-email':        'Enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/user-not-found':       'No account found with that email.',
    'auth/wrong-password':       'Incorrect password.',
    'auth/invalid-credential':   'Incorrect email or password.',
    'auth/network-request-failed': 'Network error — check your connection.',
  }[code] || 'Something went wrong. Try again.');

  const submit = async () => {
    if (!email || !pass || (mode === 'signup' && !name)) {
      setError('Please fill in all fields.'); return;
    }
    const auth = initFirebase();
    if (!auth) { setError('Auth not configured.'); return; }
    const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = window.firebaseLib;
    setBusy(true); setError('');
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      onClose();
    } catch (e) {
      setError(friendly(e.code));
    } finally {
      setBusy(false);
    }
  };

  const field = (label, value, onChange, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontFamily: 'Oswald, sans-serif', fontSize: 11,
        letterSpacing: 1.2, fontWeight: 600, color: C.mute, marginBottom: 6,
        textTransform: 'uppercase',
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => { onChange(e.target.value); setError(''); }}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        autoComplete={type === 'password' ? (mode === 'signup' ? 'new-password' : 'current-password') : (label === 'Email' ? 'email' : 'name')}
        style={{
          width: '100%', padding: '12px 14px', border: `1.5px solid ${C.line}`,
          borderRadius: 8, fontFamily: 'Inter', fontSize: 14, color: C.ink,
          background: '#fff', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = C.navy}
        onBlur={e => e.target.style.borderColor = C.line}
      />
    </div>
  );

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: C.cream, display: 'flex', flexDirection: 'column',
    }}>
      {/* header */}
      <div style={{
        background: C.navy, color: C.white, padding: '50px 16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.18)', border: 'none', color: C.white,
          width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 600,
        }}>←</button>
        <span style={{
          fontFamily: 'Oswald, sans-serif', fontSize: 14, letterSpacing: 1.5, fontWeight: 600,
        }}>{t('back').toUpperCase()}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 40px' }}>
        {/* logo + title */}
        <div style={{
          background: C.navy, padding: '0 20px 28px', color: C.white,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <PPLogo size={52} />
          <div>
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 22,
              letterSpacing: 0.5, lineHeight: 1.1,
            }}>PILSEN PATRIOTS</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, opacity: 0.75, marginTop: 4 }}>
              {mode === 'signup' ? t('authCreateAccount') : t('authWelcomeBack')}
            </div>
          </div>
        </div>
        <div style={{ height: 3, background: C.red }} />

        {/* mode tabs */}
        <div style={{
          display: 'flex', margin: '24px 16px 20px',
          background: '#e9e6de', borderRadius: 10, padding: 3,
        }}>
          {[['signin', t('authSignIn')], ['signup', t('authCreateAccount')]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 8,
              background: mode === m ? '#fff' : 'transparent',
              color: mode === m ? C.navy : C.mute,
              fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 12,
              letterSpacing: 1.2, cursor: 'pointer',
              boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
              transition: 'all 0.15s',
            }}>{label.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          {mode === 'signup' && field(t('authName'), name, setName, 'text', 'Jakub Novák')}
          {field('Email', email, setEmail, 'email', 'jakub@example.cz')}
          {field(t('authPassword'), pass, setPass, 'password', '••••••••')}

          {error && (
            <div style={{
              marginBottom: 14, padding: '10px 12px', background: '#FFF0F0',
              border: `1px solid #FFD0D0`, borderRadius: 8,
              fontFamily: 'Inter', fontSize: 13, color: C.red, lineHeight: 1.4,
            }}>{error}</div>
          )}

          <button
            onClick={submit}
            disabled={busy}
            style={{
              width: '100%', padding: '15px', border: 'none', borderRadius: 10,
              background: busy ? C.mute : C.red, color: '#fff', cursor: busy ? 'default' : 'pointer',
              fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 14,
              letterSpacing: 1.5, transition: 'background 0.15s',
            }}
          >
            {busy ? '...' : (mode === 'signup' ? t('authCreateAccount') : t('authSignIn')).toUpperCase()}
          </button>

          <div style={{
            marginTop: 18, textAlign: 'center', fontFamily: 'Inter', fontSize: 13, color: C.mute,
          }}>
            {mode === 'signin' ? t('authNoAccount') : t('authHaveAccount')}{' '}
            <span
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
              style={{ color: C.red, fontWeight: 600, cursor: 'pointer' }}
            >
              {mode === 'signin' ? t('authCreateAccount') : t('authSignIn')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.useAuth     = useAuth;
window.initFirebase = initFirebase;
window.AuthModal   = AuthModal;
