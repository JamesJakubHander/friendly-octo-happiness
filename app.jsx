
// Pilsen Patriots — main app
const { useState: useStateApp, useEffect: useEffectApp } = React;

function LangToggle({ lang, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', background: 'rgba(255,255,255,0.14)',
      borderRadius: 999, padding: 2, gap: 0,
      border: '1px solid rgba(255,255,255,0.2)',
    }}>
      {['en', 'cs'].map(code => {
        const active = lang === code;
        return (
          <button key={code} onClick={() => onChange(code)} style={{
            background: active ? '#fff' : 'transparent',
            color: active ? C.navy : '#fff',
            border: 'none', borderRadius: 999,
            padding: '4px 10px',
            fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 11,
            letterSpacing: 1, cursor: 'pointer',
          }}>{code.toUpperCase()}</button>
        );
      })}
    </div>
  );
}

function useIsMobile() {
  const q = '(max-width: 600px)';
  const [m, setM] = useStateApp(() => {
    try { return window.matchMedia(q).matches; } catch { return false; }
  });
  useEffectApp(() => {
    const mq = window.matchMedia(q);
    const fn = e => setM(e.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn); };
  }, []);
  return m;
}

function useIsDesktop() {
  const q = '(min-width: 900px)';
  const [m, setM] = useStateApp(() => {
    try { return window.matchMedia(q).matches; } catch { return false; }
  });
  useEffectApp(() => {
    const mq = window.matchMedia(q);
    const fn = e => setM(e.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn); };
  }, []);
  return m;
}

// ────────── DESKTOP SIDEBAR ──────────
function DesktopSidebar({ active, onChange, lang, onLang, dark, onDark, onFanID }) {
  const { team } = window.PP_DATA;
  const items = [
    { id: 'home',     icon: HomeIcon },
    { id: 'schedule', icon: ScheduleIcon },
    { id: 'roster',   icon: RosterIcon },
    { id: 'stats',    icon: StatsIcon },
    { id: 'news',     icon: NewsIcon },
  ];
  return (
    <aside style={{
      width: 256, flexShrink: 0, height: '100dvh', boxSizing: 'border-box',
      background: `linear-gradient(180deg, ${C.navyDeep} 0%, ${C.navy} 100%)`,
      color: '#fff', display: 'flex', flexDirection: 'column',
      padding: '26px 14px 18px', borderRight: `3px solid ${C.red}`,
    }}>
      {/* brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 6px 18px' }}>
        <PPLogo size={44} />
        <div>
          <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 16, lineHeight: 1.05, letterSpacing: 0.5 }}>PILSEN<br/>PATRIOTS</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 7 }}>
            <span style={{ background: C.red, color: '#fff', padding: '1px 7px', fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 11, borderRadius: 3, letterSpacing: 0.5 }}>{team.record}</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, opacity: 0.65, fontFamily: 'Inter', padding: '0 6px 14px' }}>{team.rank}</div>

      {/* nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(it => {
          const A = active === it.id;
          const Icon = it.icon;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 13, padding: '11px 12px',
              background: A ? 'rgba(255,255,255,0.12)' : 'transparent', border: 'none',
              borderLeft: A ? `3px solid ${C.red}` : '3px solid transparent',
              borderRadius: 8, cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <span style={{ opacity: A ? 1 : 0.78, display: 'flex' }}><Icon active={A} /></span>
              <span style={{
                fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: 1.2,
                color: A ? '#fff' : 'rgba(255,255,255,0.82)',
              }}>{t(it.id).toUpperCase()}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* fan id */}
      <button onClick={onFanID} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px', marginBottom: 14, width: '100%',
        background: C.red, color: '#fff', border: 'none', borderRadius: 8,
        fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: 1.5, cursor: 'pointer',
      }}>FAN ID</button>

      {/* lang + theme */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <LangToggle lang={lang} onChange={onLang} />
        <button onClick={() => onDark(!dark)} title="Theme" style={{
          background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 999, width: 36, height: 28, cursor: 'pointer', color: '#fff', fontSize: 13,
        }}>{dark ? '\u263e' : '\u2600'}</button>
      </div>
    </aside>
  );
}

function App() {
  const [tab, setTab] = useStateApp('home');
  const [modal, setModal] = useStateApp(null);
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useStateApp(() => {
    try { return localStorage.getItem('pp_onboarded') !== '1'; } catch { return true; }
  });
  const [t_, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "heroStyle": "navy",
    "accentRed": true,
    "showCountdown": true,
    "lang": "en",
    "dark": false
  }/*EDITMODE-END*/);

  window.PP_LANG = t_.lang || 'en';
  window.PP_AUTH_USER = user ?? null;
  const [, forceTick] = useStateApp(0);
  useEffectApp(() => {
    window.setPPTheme(!!t_.dark);
    forceTick(x => x + 1);
  }, [t_.dark, t_.lang]);

  // Pull hosted live data once on launch, then re-render.
  useEffectApp(() => {
    if (window.PP_LOAD_LIVE) {
      window.PP_LOAD_LIVE().then(ok => { if (ok) forceTick(x => x + 1); });
    }
  }, []);

  const goTo = (id) => { setModal(null); setTab(id); };
  const openPlayer = (player) => setModal({ kind: 'player', data: player });
  const openGame   = (game)   => setModal({ kind: 'game',   data: game });
  const openNews   = (news)   => setModal({ kind: 'news',   data: news });
  const openFanID  = ()       => setModal({ kind: user ? 'fan' : 'auth' });
  const closeModal = () => setModal(null);
  const finishOnboarding = () => {
    try { localStorage.setItem('pp_onboarded', '1'); } catch {}
    setOnboarding(false);
  };

  window.PP_LangToggle = () => <LangToggle lang={t_.lang} onChange={v => setTweak('lang', v)} />;

  const screens = {
    home:     <HomeScreen     tweaks={t_} openNews={openNews} openGame={openGame} goTo={goTo} openFanID={openFanID} />,
    schedule: <ScheduleScreen tweaks={t_} openGame={openGame} />,
    roster:   <RosterScreen   tweaks={t_} openPlayer={openPlayer} />,
    stats:    <StatsScreen    tweaks={t_} />,
    news:     <NewsScreen     tweaks={t_} openNews={openNews} />,
  };

  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  const appInner = (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: C.cream }}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
        {screens[tab]}
      </div>
      {modal && modal.kind === 'player' && <PlayerModal player={modal.data} onClose={closeModal} />}
      {modal && modal.kind === 'game'   && <GameModal   game={modal.data}   onClose={closeModal} />}
      {modal && modal.kind === 'news'   && <NewsModal   news={modal.data}   onClose={closeModal} />}
      {modal && modal.kind === 'fan'    && <FanIDModal user={user} onClose={closeModal} />}
      {modal && modal.kind === 'auth'   && <AuthModal onClose={closeModal} />}
      {onboarding && <Onboarding onDone={finishOnboarding} />}
      <TabBar active={tab} onChange={setTab} />
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', fontFamily: 'Inter, system-ui, sans-serif', background: isDesktop ? C.cream : C.outerBg }}>
      {isDesktop ? (
        <div style={{ position: 'relative', height: '100dvh', display: 'flex', overflow: 'hidden', background: C.cream }}>
          <DesktopSidebar
            active={tab} onChange={setTab}
            lang={t_.lang} onLang={v => setTweak('lang', v)}
            dark={!!t_.dark} onDark={v => setTweak('dark', v)}
            onFanID={openFanID}
          />
          <main style={{ flex: 1, height: '100dvh', overflowY: 'auto' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', minHeight: '100%' }}>
              {screens[tab]}
            </div>
          </main>
          {modal && modal.kind === 'player' && <PlayerModal player={modal.data} onClose={closeModal} />}
          {modal && modal.kind === 'game'   && <GameModal   game={modal.data}   onClose={closeModal} />}
          {modal && modal.kind === 'news'   && <NewsModal   news={modal.data}   onClose={closeModal} />}
          {modal && modal.kind === 'fan'    && <FanIDModal user={user} onClose={closeModal} />}
          {modal && modal.kind === 'auth'   && <AuthModal onClose={closeModal} />}
          {onboarding && <Onboarding onDone={finishOnboarding} />}
        </div>
      ) : (
        <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cream }}>
          <div style={{
            width: '100%', height: '100dvh', maxWidth: 520,
            position: 'relative', overflow: 'hidden', background: C.cream,
          }}>
            {appInner}
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t_.dark}
          onChange={v => setTweak('dark', v)} />
        <TweakSection label="Hero style" />
        <TweakRadio label="Banner" value={t_.heroStyle}
          options={['navy', 'red', 'stripes']}
          onChange={v => setTweak('heroStyle', v)} />
        <TweakSection label="Details" />
        <TweakToggle label="Red accent line under titles" value={t_.accentRed}
          onChange={v => setTweak('accentRed', v)} />
        <TweakToggle label="Show countdown banner" value={t_.showCountdown}
          onChange={v => setTweak('showCountdown', v)} />
        <TweakSection label="Demo" />
        <TweakButton label="Show onboarding"
          onClick={() => { try { localStorage.removeItem('pp_onboarded'); } catch {}; setOnboarding(true); }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

