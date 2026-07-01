
// Pilsen Patriots — extras: Onboarding, Fan ID, Predict, Merch, Staff

// ─────────── ONBOARDING ───────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const slides = [
    { k: 'onboard1', icon: <PPLogo size={88} /> },
    { k: 'onboard2', icon: (
      <svg width="88" height="88" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke={C.red} strokeWidth="1.8"/>
        <circle cx="12" cy="10" r="3" fill={C.red}/>
      </svg>
    ) },
    { k: 'onboard3', icon: (
      <svg width="88" height="88" viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 14.6,9 22,9 16,13.5 18.2,21 12,16.5 5.8,21 8,13.5 2,9 9.4,9"
                 fill={C.red}/>
      </svg>
    ) },
  ];
  const s = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: `linear-gradient(180deg, ${C.navyDeep} 0%, ${C.navy} 100%)`,
      color: C.white,
      display: 'flex', flexDirection: 'column',
      padding: '60px 28px 36px',
    }}>
      {/* skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDone} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)',
          fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: 1.5,
          fontWeight: 600, cursor: 'pointer', padding: 4,
        }}>{t('skip').toUpperCase()}</button>
      </div>

      {/* content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 28, textAlign: 'center',
      }}>
        <div>{s.icon}</div>
        <div style={{
          fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 30,
          lineHeight: 1.1, letterSpacing: 0.5, maxWidth: 280,
        }}>{t(`${s.k}Title`)}</div>
        <div style={{
          fontFamily: 'Inter', fontSize: 15, lineHeight: 1.5,
          opacity: 0.85, maxWidth: 300,
        }}>{t(`${s.k}Body`)}</div>
      </div>

      {/* dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i === step ? C.red : 'rgba(255,255,255,0.3)',
            transition: 'all 0.2s',
          }} />
        ))}
      </div>

      {/* button */}
      <button onClick={() => isLast ? onDone() : setStep(step + 1)} style={{
        background: C.red, color: C.white, border: 'none', borderRadius: 10,
        padding: '16px', fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 15,
        letterSpacing: 1.5, cursor: 'pointer',
      }}>{(isLast ? t('getStarted') : t('next')).toUpperCase()}</button>
    </div>
  );
}

// ─────────── FAN ID MODAL ───────────
function FanIDModal({ onClose, user }) {
  const { fan } = window.PP_DATA;
  const displayName = user?.displayName || user?.email?.split('@')[0] || fan.name;
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    const auth = initFirebase();
    if (auth) {
      const { signOut } = window.firebaseLib;
      try { await signOut(auth); } catch (e) {}
    }
    onClose();
  };

  return (
    <ModalShell onClose={onClose} accent={C.red}>
      <div style={{ padding: '8px 16px 24px' }}>
        {/* card */}
        <div style={{
          background: `linear-gradient(135deg, ${C.navyDeep} 0%, ${C.navy} 60%, ${C.redDark} 100%)`,
          color: C.white, borderRadius: 16, padding: '22px 20px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(10,31,68,0.25)',
        }}>
          {/* star pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.8px)',
            backgroundSize: '18px 18px',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <PPLogo size={40} />
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontSize: 11, letterSpacing: 2,
              fontWeight: 700, opacity: 0.8,
            }}>{t('memberCard').toUpperCase()}</div>
          </div>

          <div style={{ marginTop: 24, position: 'relative' }}>
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontSize: 11, letterSpacing: 1.5,
              fontWeight: 600, opacity: 0.7,
            }}>MEMBER</div>
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 24,
              marginTop: 2, letterSpacing: 0.5,
            }}>{displayName}</div>
            {user?.email && (
              <div style={{
                fontFamily: 'Inter', fontSize: 12, marginTop: 4, opacity: 0.85,
              }}>{user.email}</div>
            )}
          </div>

          <div style={{
            marginTop: 20, display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', position: 'relative',
          }}>
            <div>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 10, letterSpacing: 1.5, opacity: 0.7 }}>SEAT</div>
              <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, marginTop: 2 }}>{fan.seat}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 10, letterSpacing: 1.5, opacity: 0.7 }}>{t('memberPoints').toUpperCase()}</div>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 22, fontWeight: 700, marginTop: 2 }}>{fan.points.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* QR */}
        <div style={{
          marginTop: 20, padding: 20, background: C.white,
          borderRadius: 14, border: `1px solid ${C.line}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <FakeQR size={180} />
          <div style={{
            fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: 1.5,
            color: C.mute, fontWeight: 600,
          }}>{t('scanToEnter').toUpperCase()}</div>
        </div>

        <div style={{ marginTop: 14, fontFamily: 'Inter', fontSize: 12, color: C.mute, textAlign: 'center' }}>
          {fan.since}
        </div>

        {/* sign out */}
        <button onClick={handleSignOut} style={{
          marginTop: 20, width: '100%', padding: '12px',
          background: 'transparent', color: C.mute,
          border: `1.5px solid ${C.line}`, borderRadius: 8, cursor: 'pointer',
          fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: 1.2,
        }}>{t('authSignOut').toUpperCase()}</button>
      </div>
    </ModalShell>
  );
}

function FakeQR({ size = 160 }) {
  // pseudo-random but deterministic dot grid that looks like a QR code
  const cells = 21;
  const dot = size / cells;
  const seed = 'patriots';
  const filled = (x, y) => {
    // 3 corner finders
    if ((x < 7 && y < 7) || (x > cells - 8 && y < 7) || (x < 7 && y > cells - 8)) {
      const lx = x > cells - 8 ? x - (cells - 7) : x;
      const ly = y > cells - 8 ? y - (cells - 7) : y;
      return lx === 0 || lx === 6 || ly === 0 || ly === 6 ||
             (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
    }
    // deterministic noise
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed.length) * 43758.5453;
    return (n - Math.floor(n)) > 0.55;
  };
  const rects = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (filled(x, y)) rects.push(<rect key={`${x}-${y}`} x={x * dot} y={y * dot} width={dot} height={dot} fill={C.navy} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#fff" />
      {rects}
    </svg>
  );
}

// ─────────── HOME SECTIONS ───────────
function FanCard({ onOpen }) {
  const { fan } = window.PP_DATA;
  const user = window.PP_AUTH_USER;
  const displayName = user?.displayName || user?.email?.split('@')[0] || fan.name;
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const subtitle = user ? (user.email || fan.member) : fan.member;
  return (
    <div style={{ padding: '0 16px' }}>
      <div onClick={onOpen} style={{
        background: `linear-gradient(110deg, ${C.navyDeep} 0%, ${C.navy} 65%, ${C.redDark} 130%)`,
        color: C.white, borderRadius: 12, padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1.4px)',
          backgroundSize: '14px 14px',
        }} />
        <div style={{
          width: 44, height: 44, borderRadius: 22,
          background: 'rgba(255,255,255,0.18)', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 18,
        }}>{initials}</div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600 }}>{displayName}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, opacity: 0.8, marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{
          fontFamily: 'Oswald, sans-serif', fontSize: 11, letterSpacing: 1.5,
          fontWeight: 700, color: C.white, position: 'relative',
          padding: '6px 10px', border: '1.5px solid rgba(255,255,255,0.45)', borderRadius: 6,
        }}>{user ? t('memberCard').toUpperCase() : t('authSignIn').toUpperCase()}</div>
      </div>
    </div>
  );
}

function PredictBlock() {
  const { team } = window.PP_DATA;
  const [pick, setPick] = useState(null);
  const [done, setDone] = useState(false);
  const opts = [
    { id: 'pilsen', label: t('predictPilsen'), color: C.red },
    { id: 'tie',    label: t('predictTie'),    color: C.mute },
    { id: 'opp',    label: t('predictOpp'),    color: C.navy },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <Card>
        <div style={{ padding: '16px 16px 14px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 4,
          }}>
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 12,
              letterSpacing: 1.5, color: C.red,
            }}>{t('predict').toUpperCase()}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: C.mute }}>
              {team.nextGame.date}
            </div>
          </div>
          <div style={{
            fontFamily: 'Inter', fontSize: 14, color: C.ink, fontWeight: 600,
            marginBottom: 12,
          }}>{t('predictPrompt')}</div>

          {!done ? (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                {opts.map(o => {
                  const sel = pick === o.id;
                  return (
                    <button key={o.id} onClick={() => setPick(o.id)} style={{
                      flex: 1, padding: '12px 8px', cursor: 'pointer',
                      background: sel ? o.color : C.white,
                      color: sel ? C.white : C.ink,
                      border: `1.5px solid ${sel ? o.color : C.line}`,
                      borderRadius: 8,
                      fontFamily: 'Oswald, sans-serif', fontWeight: 600,
                      fontSize: 12, letterSpacing: 0.5,
                    }}>{o.label}</button>
                  );
                })}
              </div>
              <button onClick={() => pick && setDone(true)} disabled={!pick} style={{
                marginTop: 10, width: '100%', padding: '12px',
                background: pick ? C.navy : C.line,
                color: pick ? C.white : C.mute,
                border: 'none', borderRadius: 8, cursor: pick ? 'pointer' : 'default',
                fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 12,
                letterSpacing: 1.5,
              }}>{t('submit').toUpperCase()}</button>
            </>
          ) : (
            <div style={{
              padding: '14px', textAlign: 'center', background: C.cream, borderRadius: 8,
              fontFamily: 'Inter', fontSize: 13, color: C.ink, fontWeight: 600,
            }}>
              <span style={{ color: C.red, marginRight: 6 }}>✓</span>
              {t('pickSubmitted')}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function MerchStrip() {
  const { merch } = window.PP_DATA;
  return (
    <>
      <SectionTitle action={t('shopAll')}>{t('shop')}</SectionTitle>
      <div style={{
        display: 'flex', gap: 10, padding: '0 16px',
        overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none',
      }}>
        {merch.map(m => (
          <div key={m.id} style={{
            flexShrink: 0, width: 140, background: C.white,
            border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden',
            cursor: 'pointer',
          }}>
            <div style={{
              height: 100, background: m.id.includes('home') ? C.navy : (m.id.includes('away') ? C.cream : (m.id.includes('snapback') || m.id.includes('hoodie') ? C.navyDeep : C.red)),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 28,
              color: m.id.includes('away') ? C.navy : C.white,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 6, left: 6, fontSize: 9,
                letterSpacing: 1, fontWeight: 600, opacity: 0.7,
              }}>PP</div>
              {m.short}
            </div>
            <div style={{ padding: '8px 10px' }}>
              <div style={{
                fontFamily: 'Inter', fontSize: 12, color: C.ink, fontWeight: 600,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{m.name}</div>
              <div style={{
                fontFamily: 'Oswald, sans-serif', fontSize: 13, fontWeight: 700,
                color: C.red, marginTop: 2,
              }}>{m.price} Kč</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────── STAFF (used inside Roster) ───────────
function StaffList() {
  const { staff } = window.PP_DATA;
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {staff.map(s => (
        <Card key={s.name}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 25,
              background: s.accent === 'red' ? C.red : C.navy, color: C.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 16,
            }}>{s.short}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter', fontSize: 15, color: C.ink, fontWeight: 600,
              }}>{s.name}</div>
              <div style={{ fontSize: 12, color: C.mute, fontFamily: 'Inter', marginTop: 2 }}>
                {s.role}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

window.Onboarding = Onboarding;
window.FanIDModal = FanIDModal;
window.FanCard = FanCard;
window.PredictBlock = PredictBlock;
window.MerchStrip = MerchStrip;
window.StaffList = StaffList;
