import React, { useEffect, useState } from 'react';
import { api, getToken, setToken } from './api.js';
import { t as tr } from './i18n.js';
import { Icon } from './icons.jsx';
import { Toast, formatPhone } from './components.jsx';
import { Otp } from './UserApp.jsx';
import UserApp from './UserApp.jsx';
import Admin, { AdminLogin } from './Admin.jsx';

export default function App() {
  const [ready, setReady] = useState(false);
  const [splash, setSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [toast, setToast] = useState('');
  const [mode, setMode] = useState(location.pathname.startsWith('/admin') ? 'admin' : 'app');
  const [deferred, setDeferred] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const lang = user?.language || localStorage.getItem('akel_lang') || 'ru';
  const theme = user?.theme || localStorage.getItem('akel_theme') || 'light';
  const t = (k, v) => tr(lang, k, v);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('akel_theme', theme);
    localStorage.setItem('akel_lang', lang);
  }, [theme, lang]);

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setDeferred(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  useEffect(() => {
    (async () => {
      try { setSettings(await api.settings()); } catch {}
      if (getToken()) {
        try { setUser(await api.me()); } catch { setToken(''); }
      }
      setReady(true);
      setTimeout(() => setSplash(false), 1600);
    })();
  }, []);

  useEffect(() => {
    const onPop = () => setMode(location.pathname.startsWith('/admin') ? 'admin' : 'app');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goAdmin = () => { history.pushState({}, '', '/admin'); setMode('admin'); };
  const goApp = () => { history.pushState({}, '', '/'); setMode('app'); };

  const showToast = (x) => setToast(x);

  if (splash || !ready) {
    return (
      <>
        <div className="app-bg"><div className="orb a" /><div className="orb b" /><div className="orb c" /></div>
        <div className="phone">
          <div className="splash">
            <img className="splash-logo" src="/icon.png" alt="Akelcargo" />
            <h1>Akelcargo</h1>
            <p>{t('splashTag')}</p>
            <div className="splash-bar"><span /></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="app-bg"><div className="orb a" /><div className="orb b" /><div className="orb c" /></div>
      <div className={'phone ' + (mode === 'admin' && user?.isAdmin ? 'admin-app' : '')}>
        {showInstall && deferred && (
          <div className="install-banner glass-2">
            <img src="/icon.png" width="36" height="36" style={{ borderRadius: 10 }} alt="" />
            <div style={{ flex: 1 }}><b>Akelcargo</b><div className="small">{t('install')}</div></div>
            <button className="btn" style={{ width: 'auto', padding: '8px 14px' }} onClick={async () => { deferred.prompt(); setShowInstall(false); }}>OK</button>
            <button onClick={() => setShowInstall(false)}><Icon.Close size={18} /></button>
          </div>
        )}
        {mode === 'admin' ? (
          user?.isAdmin ? (
            <Admin user={user} settings={settings} setSettings={setSettings} onExit={goApp} />
          ) : (
            <AdminLogin onOk={(u) => { setUser(u); }} />
          )
        ) : !user ? (
          <Login t={t} onOk={setUser} goAdmin={goAdmin} />
        ) : (
          <UserApp
            user={user} setUser={setUser} settings={settings} setSettings={setSettings}
            t={t} lang={lang} theme={theme} toast={toast} showToast={showToast}
          />
        )}
        {mode === 'app' && user?.isAdmin && (
          <button onClick={goAdmin} style={{ position: 'absolute', top: 8, right: 8, zIndex: 30, fontSize: 11, fontWeight: 800, color: 'var(--red)' }}>ADMIN</button>
        )}
        <Toast text={toast} onDone={() => setToast('')} />
      </div>
    </>
  );
}

function Login({ t, onOk, goAdmin }) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone');
  const [code, setCode] = useState(['', '', '', '']);
  const [wa, setWa] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const send = async () => {
    setBusy(true); setErr('');
    try {
      const r = await api.requestOtp(phone);
      setWa(r);
      setStep('code');
    } catch {
      setErr('Рақам нодуруст');
    }
    setBusy(false);
  };

  const verify = async (digits) => {
    const c = (digits || code).join('');
    if (c.length < 4) return;
    setBusy(true); setErr('');
    try {
      const r = await api.verifyOtp(phone, c);
      setToken(r.token);
      onOk(r.user);
    } catch {
      setErr('Рамз нодуруст');
    }
    setBusy(false);
  };

  useEffect(() => {
    if (code.join('').length === 4) verify(code);
    // eslint-disable-next-line
  }, [code]);

  return (
    <div className="login">
      <div className="brand-row">
        <img src="/icon.png" alt="" />
        <div><h2>Akelcargo</h2><div className="small">{t('splashTag')}</div></div>
      </div>
      {step === 'phone' ? (
        <>
          <h1>{t('loginTitle')}</h1>
          <p className="muted">{t('loginSub')}</p>
          <div className="field">
            <label>{t('phone')}</label>
            <div className="input-wrap">
              <span className="input-ico"><Icon.Phone size={18} /></span>
              <input className="input" inputMode="tel" placeholder="+992 90 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          {err && <p className="danger">{err}</p>}
          <button className="btn" disabled={busy} onClick={send}>{busy ? t('sending') : t('sendCode')}</button>
          <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={goAdmin}>{t('admin')}</button>
        </>
      ) : (
        <>
          <h1>{t('codeTitle')}</h1>
          <p className="muted">{t('codeSub')} · {formatPhone(phone)}</p>
          <Otp code={code} setCode={setCode} />
          {err && <p className="danger">{err}</p>}
          {wa && (
            <div className="wa">
              <div className="wa-head">
                <div className="wa-av">A</div>
                <div>
                  <b>{wa.from || 'Akelcargo'}</b>
                  <span>~ Akelcargo</span>
                </div>
              </div>
              <div className="wa-enc">🔒 {t('waProtected')}</div>
              <div className="wa-bubble">
                <p>{wa.message || `${t('waCode')}: ${wa.previewCode || '••••'}`}</p>
                <time>{new Date().toTimeString().slice(0, 5)}</time>
              </div>
            </div>
          )}
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={() => setStep('phone')}>{t('changePhone')}</button>
        </>
      )}
    </div>
  );
}
