import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, animate } from 'framer-motion'
import HeroChart from './components/HeroChart'
import { Reveal, stagger, fadeUp, ease } from './components/Reveal'
import * as I from './components/Icons'

const TICKERS = [
  ['CAC 40', true], ['S&P 500', true], ['MSCI WORLD', false], ['OR', true],
  ['EUR/USD', false], ['BTC', true], ['STOXX 600', true], ['NASDAQ', false],
]

const SUPPORTS = ['Actions', 'ETF & trackers', 'Indices', 'Produits structurés', 'Options', 'Matières premières', 'Crypto-actifs']

const STEPS = [
  { n: '01', title: 'Mesurer', icon: <I.TrendUp className="green" size={24} />, text: "Chaque actif est comparé à sa tendance logarithmique de long terme. L'écart est exprimé en écarts-types : vous savez objectivement si le prix est cher ou bon marché." },
  { n: '02', title: 'Doser', icon: <I.Bars className="green" size={24} />, text: 'Selon la zone, votre versement est modulé. Les rendements historiques à 1, 3 et 5 ans par zone d\'achat vous montrent pourquoi.' },
  { n: '03', title: 'Être alerté', icon: <I.Bell className="amber" size={22} />, text: "Un changement de zone, un pivot, un seuil franchi : vous recevez le signal avant même d'ouvrir votre tableau de bord." },
]

const ZONES = [
  { range: '> +2 σ', color: 'var(--red)', label: 'Euphorie, prix très tendu', mult: '× 0,5' },
  { range: '+1 à +2 σ', color: 'var(--orange)', label: 'Au-dessus de la tendance', mult: '× 0,75' },
  { range: '−0,5 à +1 σ', color: 'var(--text)', label: 'Zone neutre', mult: '× 1' },
  { range: '−1 à −0,5 σ', color: 'var(--green)', label: 'Achat favorable', mult: '× 1,25', active: true },
  { range: '−2 à −1 σ', color: 'var(--green)', label: "Zone d'achat renforcée", mult: '× 1,5' },
  { range: '< −2 σ', color: 'var(--green)', label: 'Capitulation, opportunité rare', mult: '× 2' },
]

const TOOLS = [
  { t: 'Détection de pics', d: "ZigZag adaptatif basé sur l'ATR, simulation achat-vente et seuil optimal.", ic: I.Peaks, on: true },
  { t: 'Retracements de Fibonacci', d: 'Repérage automatique des supports et résistances sur tout actif.', ic: I.Fibo, on: true },
  { t: 'Écart à la tendance', d: 'Écart en % du prix par rapport à sa tendance logarithmique.', ic: I.Spread, on: true },
  { t: 'Rendements futurs par zone', d: "Rendement médian historique à 1, 3 et 5 ans selon la zone d'achat.", ic: I.Signal, on: true },
  { t: "Points d'entrée historiques", d: 'Niveaux de prix historiquement bas par rapport à la tendance.', ic: I.Download, on: true },
  { t: 'Temps passé par zone', d: "Répartition du temps passé dans chaque zone d'écart-type.", ic: I.Clock, on: true },
  { t: "Vitesse d'éloignement", d: "Accélération ou ralentissement de l'écart du prix à sa tendance.", ic: I.Gauge, on: true },
  { t: 'Stratégies sur options', d: 'Combinaisons calls, puts, spreads et leurs sensibilités.', ic: I.Fork, on: false },
  { t: 'Analyse de portefeuille', d: 'Vision consolidée des positions, de leur poids et du risque combiné.', ic: I.Pie, on: false },
  { t: 'Analyse de performance', d: 'Rendement dans le temps comparé à un indice de référence.', ic: I.LineChart, on: false },
  { t: "Variation d'un sous-jacent", d: "Sensibilité d'un instrument aux mouvements de son sous-jacent.", ic: I.Spread, on: false },
  { t: 'Maximum drawdown', d: 'Plus fort recul historique depuis un sommet : le risque réel.', ic: I.Drawdown, on: false },
]

const ALERTS = [
  [I.Pulse, "Changement de zone d'écart-type"],
  [I.Peaks, 'Pivot détecté (ZigZag ATR)'],
  [I.Sliders, 'Seuil de prix ou de Fibonacci franchi'],
  [I.Calendar, 'Rappel de versement DCA avec montant suggéré'],
]

const NOTIFS = [
  ['maintenant', 'MSCI World entre en zone d\'achat renforcée (−1,1 σ). Versement suggéré : 300 €.'],
  ['il y a 2 h', 'DE000FD3PPA9 : seuil optimal atteint (2,75 %). Pivot haussier confirmé.'],
  ['hier', 'Rappel : votre versement DCA mensuel est prévu demain.'],
]

function Nav() {
  return (
    <motion.header className="nav" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.7, ease }}>
      <div className="container nav-inner">
        <div className="nav-left">
          <a href="#" className="brand">
            <img src="/logo-mark.png" alt="VegaDesk" />
            <span>VegaDesk</span>
          </a>
          <nav className="nav-links">
            <a href="#outils">Outils</a>
            <a href="#methode">DCA intelligent</a>
            <a href="#alertes">Alertes</a>
            <a href="#acces">Accès</a>
          </nav>
        </div>
        <div className="nav-right">
          <span className="market-status"><span className="pulse-dot" /> Marchés ouverts</span>
          <a href="#acces" className="btn btn-light">Se connecter</a>
        </div>
      </div>
    </motion.header>
  )
}

function Ticker() {
  const items = [...TICKERS, ...TICKERS]
  return (
    <div className="ticker">
      <div className="ticker-live">LIVE</div>
      <div className="ticker-track">
        {items.map(([n, up], i) => (
          <span key={i} className="ticker-item">
            <span className="name">{n}</span>
            <span>[VALEUR]</span>
            <span className={up ? 'green' : 'red'}>{up ? '▲' : '▼'} 0,00%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const words = (s, extra = 0) =>
    s.split(' ').map((w, i) => (
      <motion.span key={w + i} className="word" variants={fadeUp} custom={i + extra}>
        {w}&nbsp;
      </motion.span>
    ))
  return (
    <section className="hero">
      <div className="grid-bg" />
      <div className="hero-glow" />
      <div className="container hero-inner">
        <div>
          <motion.div className="badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <b>BÊTA</b> Plateforme gratuite pendant le développement
          </motion.div>
          <motion.h1 variants={stagger(0.07, 0.2)} initial="hidden" animate="show">
            {words('Investissez au bon moment.')}
            <em>{words('Pas au hasard.')}</em>
          </motion.h1>
          <motion.p className="hero-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.75, ease }}>
            VegaDesk mesure où se situe un actif par rapport à sa tendance de long terme et vous dit quand renforcer votre DCA. Actions, ETF, indices, produits structurés : les outils des desks professionnels, et une alerte au moment où ça compte.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9, ease }}>
            <a href="#acces" className="btn btn-green">Commencer gratuitement <I.Arrow /></a>
            <a href="#outils" className="btn btn-ghost">Explorer les outils</a>
          </motion.div>
          <motion.div className="hero-checks" variants={stagger(0.1, 1.1)} initial="hidden" animate="show">
            {['Aucune carte bancaire', "12 modules d'analyse", 'Actifs illimités'].map((t) => (
              <motion.span key={t} variants={fadeUp}><I.Check className="green" /> {t}</motion.span>
            ))}
          </motion.div>
        </div>
        <HeroChart />
      </div>
    </section>
  )
}

function Supports() {
  return (
    <div className="supports">
      <motion.div className="container supports-inner" variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.span variants={fadeUp}>Analysez tous vos supports</motion.span>
        <div className="chips">
          {SUPPORTS.map((s) => (
            <motion.span key={s} className="chip" variants={fadeUp}>{s}</motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function Counter({ from, to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(from)
  useEffect(() => {
    if (!inView) return
    const c = animate(from, to, { duration: 1.6, delay: 0.6, ease, onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, from, to])
  return <span ref={ref}>{v}{suffix}</span>
}

function Method() {
  return (
    <section className="section" id="methode">
      <div className="container">
        <div className="method-head">
          <Reveal>
            <div className="eyebrow">01 — La méthode</div>
            <h2 className="section-title">Le DCA, <span className="muted-italic">mais piloté par les données.</span></h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p>Investir chaque mois lisse votre prix d'entrée. Investir davantage quand le marché est bas par rapport à sa tendance, et moins quand il s'emballe, l'améliore.</p>
          </Reveal>
        </div>

        <motion.div className="steps" variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {STEPS.map((s) => (
            <motion.div key={s.n} className="card step" variants={fadeUp}>
              <div className="step-top"><span className="n">{s.n}</span>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <Reveal className="card modulation">
          <div>
            <div className="label">Grille de modulation · Exemple</div>
            <h3>Chaque zone a son multiplicateur.</h3>
            <p>Définissez votre versement de base, VegaDesk ajuste le montant selon la position du prix. Grille entièrement personnalisable.</p>
            <div className="amounts">
              <div><div className="k">Versement de base</div><div className="v">200 €</div></div>
              <div><div className="k">Ce mois-ci</div><div className="v amber"><Counter from={200} to={250} suffix=" €" /></div></div>
            </div>
          </div>
          <div>
            <div className="zones-head"><span>ZONE</span><span>LECTURE</span><span>VERSEMENT</span></div>
            <motion.div variants={stagger(0.09, 0.2)} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {ZONES.map((z) => (
                <motion.div
                  key={z.range}
                  className={`zone${z.active ? ' active' : ''}`}
                  variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }}
                >
                  <span className="range" style={{ color: z.color }}>{z.range}</span>
                  <span>{z.label}{z.active && <span className="green"> · position actuelle</span>}</span>
                  <span className="mult">{z.mult}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Tools() {
  const [filter, setFilter] = useState('all')
  const filters = [
    ['all', `Tous · ${TOOLS.length}`],
    ['on', `Disponibles · ${TOOLS.filter((t) => t.on).length}`],
    ['wip', `En cours · ${TOOLS.filter((t) => !t.on).length}`],
  ]
  const list = TOOLS.filter((t) => filter === 'all' || (filter === 'on' ? t.on : !t.on))
  return (
    <section className="section" id="outils">
      <div className="container">
        <div className="tools-head">
          <Reveal>
            <div className="eyebrow">02 — Les outils</div>
            <h2 className="section-title">Un desk pro, <span className="muted-italic">module par module.</span></h2>
          </Reveal>
          <Reveal delay={0.1} className="filters">
            {filters.map(([k, label]) => (
              <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>
                {filter === k && <motion.div layoutId="filter-pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span>{label}</span>
              </button>
            ))}
          </Reveal>
        </div>
        <motion.div className="tools-grid" layout variants={stagger(0.05)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <AnimatePresence mode="popLayout">
            {list.map((t) => (
              <motion.div
                key={t.t}
                layout
                className={`card tool${t.on ? ' on' : ''}`}
                variants={fadeUp}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                animate="show"
              >
                <div className="tool-top">
                  <div className="tool-ic"><t.ic /></div>
                  <span className={`status ${t.on ? 'on' : 'wip'}`}>{t.on ? 'Disponible' : 'En cours'}</span>
                </div>
                <h4>{t.t}</h4>
                <p>{t.d}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function Alerts() {
  const phoneRef = useRef(null)
  const inView = useInView(phoneRef, { once: true, margin: '-120px' })
  return (
    <section className="section" id="alertes">
      <div className="container">
        <Reveal className="card alerts">
          <div>
            <div className="eyebrow">03 — Les alertes · Bientôt</div>
            <h2 className="section-title">Un signal. <em className="italic">Au bon moment.</em></h2>
            <p className="alerts-lead">Un pivot se forme, un seuil est franchi, votre actif entre en zone d'achat : vous le savez sans surveiller les écrans. Configurez vos règles une fois, VegaDesk veille pour vous.</p>
            <motion.ul className="alert-list" variants={stagger(0.1, 0.3)} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {ALERTS.map(([Ic, t]) => (
                <motion.li key={t} variants={fadeUp}><span className="ai"><Ic size={15} /></span>{t}</motion.li>
              ))}
            </motion.ul>
            <div className="channels">
              {['E-MAIL', 'SMS', 'PUSH'].map((c) => <span key={c} className="c">{c}</span>)}
              <em>Canal en cours de définition</em>
            </div>
          </div>

          <motion.div
            ref={phoneRef}
            className="phone"
            initial={{ opacity: 0, y: 60, rotate: 2 }}
            animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
            transition={{ duration: 1, ease }}
          >
            <motion.div className="phone-screen" animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="island" />
              <div className="clock">9:41</div>
              <div className="date">mardi 22 septembre</div>
              <div className="notifs">
                {NOTIFS.map(([when, text], i) => (
                  <motion.div
                    key={when}
                    className="notif"
                    initial={{ opacity: 0, y: -24, scale: 0.92 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ delay: 0.8 + (NOTIFS.length - 1 - i) * 0.55, type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <img src="/logo-mark.png" alt="" />
                    <div>
                      <div className="row"><b>VegaDesk</b><span>{when}</span></div>
                      <p>{text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="section pricing" id="acces">
      <div className="container">
        <Reveal>
          <div className="eyebrow">04 — L'accès</div>
          <h2 className="section-title">Gratuit pour analyser. <span className="muted-italic">Premium pour être prévenu.</span></h2>
        </Reveal>
        <motion.div className="plans" variants={stagger(0.15)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.div className="card plan" variants={fadeUp}>
            <div className="plan-top"><h4>Plateforme</h4><span className="tag on">Disponible</span></div>
            <div className="price"><b>0 €</b><span>pendant la bêta</span></div>
            <ul>
              {["Tous les modules d'analyse", 'Tableau de bord personnalisable', 'Actifs illimités'].map((t) => (
                <li key={t}><I.Check className="green" />{t}</li>
              ))}
            </ul>
            <a href="#" className="btn btn-light">Créer mon accès gratuit</a>
          </motion.div>
          <motion.div className="card plan premium" variants={fadeUp}>
            <div className="plan-top"><h4>Alertes</h4><span className="tag" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>Bientôt</span></div>
            <div className="price"><b>[PRIX]</b><span>/ mois</span></div>
            <ul>
              {['Tout le plan Plateforme', 'Alertes zones, pivots et seuils', 'DCA modulé avec montant suggéré'].map((t) => (
                <li key={t}><I.Check className="amber" />{t}</li>
              ))}
            </ul>
            <a href="#" className="btn btn-amber-outline">Être prévenu du lancement</a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <div className="container">
      <Reveal className="cta" y={40}>
        <svg className="cta-line" viewBox="0 0 560 220" preserveAspectRatio="none">
          <motion.path
            d="M0 200 L30 160 L58 130 L88 170 L120 172 L150 125 L188 145 L222 178 L255 210 L285 165 L312 133 L348 155 L378 168 L410 118 L440 60 L470 45 L500 60 L530 70 L560 50"
            fill="none" stroke="#1f9d68" strokeWidth="2.5" strokeLinejoin="round" opacity=".55"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
          />
        </svg>
        <div>
          <h2>Arrêtez de deviner.<br /><em>Commencez à mesurer.</em></h2>
          <p>Accès gratuit pendant la phase de développement. Aucune carte bancaire requise.</p>
        </div>
        <a href="#" className="btn btn-dark">Se connecter <I.Arrow /></a>
      </Reveal>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <a href="#" className="brand"><img src="/logo-mark.png" alt="VegaDesk" /><span>VegaDesk</span></a>
          <div className="footer-links">
            <a href="#outils">Outils</a>
            <a href="#alertes">Alertes</a>
            <a href="#">Mentions légales</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <p>VegaDesk est un outil d'aide à l'analyse et ne constitue pas un conseil en investissement. Les performances passées ne préjugent pas des performances futures. Tout investissement comporte un risque de perte en capital. Données affichées sur cette page à titre d'illustration.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Ticker />
      <Hero />
      <Supports />
      <Method />
      <Tools />
      <Alerts />
      <Pricing />
      <CTA />
      <Footer />
    </>
  )
}
