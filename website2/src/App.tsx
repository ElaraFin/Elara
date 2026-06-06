import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRight, Check, Grid3X3, LineChart, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

const heroVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4';
const cinematicVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260215_121759_424f8e9c-d8bd-4974-9567-52709dfb6842.mp4';

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

function Logo() {
  return <div className="text-[26px] font-black tracking-[-0.08em] lowercase">elara</div>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        animate={{
          top: scrolled ? 18 : 28,
          width: scrolled ? 760 : 880,
          backgroundColor: scrolled ? 'rgba(28,28,28,.78)' : 'rgba(20,20,20,.58)',
          boxShadow: scrolled ? '0 18px 80px rgba(0,0,0,.22)' : '0 10px 40px rgba(0,0,0,.10)'
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
        className="fixed left-1/2 z-50 hidden -translate-x-1/2 items-center justify-between rounded-full px-5 py-3 text-white backdrop-blur-2xl md:flex"
      >
        <div className="flex items-center gap-9 text-[14px] font-medium text-white/82">
          <a href="#product" className="hover:text-white">Product</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </div>
        <Logo />
        <div className="flex items-center gap-5 text-[14px] font-medium">
          <a href="#security" className="text-white/82 hover:text-white">Security</a>
          <a href="#" className="text-white/82 hover:text-white">Log in</a>
          <button className="rounded-full bg-white px-5 py-2.5 text-black transition hover:scale-[1.03]">Join beta</button>
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full bg-white/15 hover:bg-white/25"><Grid3X3 size={18}/></button>
        </div>
      </motion.nav>

      <nav className="fixed left-4 right-4 top-4 z-50 flex items-center justify-between rounded-full bg-black/65 px-4 py-3 text-white backdrop-blur-2xl md:hidden">
        <Logo />
        <button onClick={() => setOpen(true)}><Menu /></button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f7f7f2] p-7 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between"><Logo /><button onClick={() => setOpen(false)}><X /></button></div>
              <div className="mt-16 flex flex-col gap-7 text-3xl font-semibold tracking-tight">
                {['Product','How it works','Pricing','Technology','Security','Company'].map(x => <a key={x} onClick={() => setOpen(false)} href={`#${x.toLowerCase().split(' ')[0]}`}>{x}</a>)}
              </div>
              <button className="mt-auto rounded-full bg-black px-6 py-4 text-white">Join private beta</button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const stats = [
    ['Patrimonio unificato', 'Banche, broker, immobili'],
    ['Quant engine', 'MVO, Black-Litterman, Sharpe'],
    ['AI companion', 'Insight e scenari what-if']
  ];
  return (
    <section className="min-h-screen bg-white p-2 md:p-3">
      <div className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-[2rem] bg-black md:min-h-[calc(100vh-24px)] md:rounded-[2.1rem]">
        <video src={heroVideo} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full scale-125 object-cover object-left-top opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
        <Navbar />
        <motion.div initial="hidden" animate="visible" variants={reveal} className="relative z-10 flex min-h-[calc(100vh-16px)] flex-col justify-end px-6 pb-20 pt-28 text-white md:px-[10vw] md:pb-24">
          <div className="mb-7 w-max rounded-full bg-white/12 px-5 py-2.5 text-sm font-medium backdrop-blur-xl">Private beta now open</div>
          <h1 className="max-w-[950px] text-[16vw] font-semibold leading-[.86] tracking-[-.085em] md:text-[9vw] lg:text-[96px]">Quantitative finance,<br />for every investor.</h1>
          <p className="mt-7 max-w-2xl text-xl leading-tight text-white/88 md:text-[28px]">Unifica il tuo patrimonio e ottimizzalo con modelli quantitativi e intelligenza artificiale: conti, broker, immobili e asset manuali in una sola dashboard.</p>
          <div className="mt-9 flex items-center gap-5">
            <button className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-[1.03]">Join beta <ArrowRight className="transition group-hover:translate-x-1" size={18}/></button>
            <button className="rounded-full px-7 py-4 font-semibold text-white transition hover:bg-white/10">Watch demo</button>
          </div>
          <div className="mt-20 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
            {stats.map((s, i) => <div key={s[0]} className="border-white/25 md:border-l md:pl-6"><p className="font-bold">{s[0]}</p><p className="mt-1 text-sm text-white/78">{s[1]}</p></div>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Trust() {
  return <section className="bg-white px-6 py-24 text-center">
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
      <p className="mx-auto max-w-xl text-sm text-black/55">Built for investors who want institutional-level portfolio intelligence without complexity.</p>
      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-10 text-3xl font-bold tracking-tighter text-black/20 md:gap-16">
        <span>PSD2</span><span>GDPR</span><span>AES-256</span><span>Read-only</span><span>ISO-ready</span>
      </div>
    </motion.div>
  </section>
}

function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Connect your wealth',
      desc: 'Collega banche, broker, carte e asset manuali in un workspace sicuro e read-only.',
      visual: 'connect'
    },
    {
      n: '2',
      title: 'Map your net worth',
      desc: 'Visualizza patrimonio, conti collegati, asset allocation e variazioni in tempo reale.',
      visual: 'dashboard'
    },
    {
      n: '3',
      title: 'AI insight',
      desc: 'Ricevi sintesi intelligenti, alert e azioni prioritarie costruite sui tuoi dati finanziari.',
      visual: 'insights'
    },
    {
      n: '4',
      title: 'Quant models',
      desc: 'Simula portafogli, frontiera efficiente, rischio, rendimento e ottimizzazione quantitativa.',
      visual: 'quant'
    }
  ];

  return <section id="how" className="bg-white px-4 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1440px]">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="text-center">
        <h2 className="text-5xl font-semibold tracking-[-.065em] md:text-7xl">How it works</h2>
        <p className="mt-4 text-lg text-black/50">It starts with your financial data, then becomes intelligent portfolio action.</p>
      </motion.div>

      <div className="mt-14 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="group"
          >
            <div className="relative aspect-[1.05/1] overflow-hidden rounded-[1.35rem] bg-[#f0f0ec]">
              <div className="absolute left-4 top-4 z-20 grid size-8 place-items-center rounded-lg bg-black/18 text-sm font-semibold text-white backdrop-blur-md">{step.n}</div>
              <StepVisual type={step.visual} />
            </div>
            <div className="pt-7">
              <h3 className="text-3xl font-semibold tracking-[-.055em] md:text-[32px]">{step.title}</h3>
              <p className="mt-3 max-w-[320px] text-[17px] leading-[1.18] text-black/72">{step.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
}

function StepVisual({ type }: { type: string }) {
  if (type === 'connect') {
    return <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,#ffffff,transparent_28%),linear-gradient(135deg,#dfe5ec,#bfc7bf_48%,#202020_49%,#0f0f0f)]">
      <div className="absolute -left-20 bottom-[-8%] h-[88%] w-[82%] rounded-tr-[10rem] bg-black/82" />
      <div className="absolute right-5 top-10 w-[76%] rounded-[1.5rem] bg-black/72 p-4 text-white shadow-2xl backdrop-blur-xl transition duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02]">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-white/12"><ShieldCheck size={20}/></div>
          <div><p className="font-semibold leading-tight">Secure aggregation</p><p className="text-xs text-white/55">PSD2 · Read-only</p></div>
          <Check className="ml-auto" size={18}/>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-white/70">
          <span className="rounded-full bg-white/10 py-2">Bank</span><span className="rounded-full bg-white/10 py-2">Broker</span><span className="rounded-full bg-white/10 py-2">Assets</span>
        </div>
      </div>
      <div className="absolute bottom-7 left-7 right-7 rounded-2xl bg-white/12 p-3 text-white backdrop-blur-md">
        <div className="flex items-center justify-between text-xs"><span>3 accounts connected</span><span className="text-[#c6ff6e]">Live</span></div>
      </div>
    </div>
  }

  if (type === 'dashboard') {
    return <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#f7f7f4,#e6e4de_52%,#d6d2c7)]">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_12%,white,transparent_32%),radial-gradient(circle_at_90%_85%,#c8c2b5,transparent_28%)]" />
      <div className="absolute left-5 right-5 top-6 rounded-[1.4rem] border border-black/10 bg-[#111111] p-4 text-white shadow-[0_32px_90px_rgba(0,0,0,.25)] transition duration-700 group-hover:-translate-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/35">Portfolio overview</p>
            <h4 className="mt-1 text-3xl font-semibold tracking-[-.07em]">€157,005</h4>
          </div>
          <span className="rounded-full bg-[#c6ff6e]/15 px-3 py-1 text-xs font-semibold text-[#c6ff6e]">+12.4%</span>
        </div>

        <div className="mt-4 grid grid-cols-[1.1fr_.9fr] gap-3">
          <div className="rounded-2xl bg-white/[.06] p-3">
            <p className="text-[10px] text-white/35">Net worth history</p>
            <svg viewBox="0 0 210 95" className="mt-2 h-24 w-full overflow-visible">
              <path d="M0 72 C22 58, 36 68, 54 50 S94 58, 118 39 S164 43, 208 16" fill="none" stroke="#c6ff6e" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 72 C22 58, 36 68, 54 50 S94 58, 118 39 S164 43, 208 16 L208 96 L0 96 Z" fill="#c6ff6e" opacity=".15" />
              <line x1="0" y1="84" x2="210" y2="84" stroke="white" strokeOpacity=".1" />
              <line x1="0" y1="44" x2="210" y2="44" stroke="white" strokeOpacity=".08" />
            </svg>
          </div>
          <div className="space-y-2">
            {[
              ['Liquid', '62%'],
              ['Invested', '31%'],
              ['Physical', '7%']
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/[.06] p-3">
                <div className="flex justify-between text-[11px]"><span className="text-white/45">{label}</span><b>{value}</b></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c6ff6e]" style={{width:value}} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white/[.06] p-3">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white/30"><span>Connected source</span><span>Status</span></div>
          {[
            ['Trade Republic', 'Broker', '€62.4K'],
            ['Intesa Sanpaolo', 'Bank', '€18.8K'],
            ['Manual assets', 'Physical', '€75.8K']
          ].map(([name, type, amount]) => (
            <div key={name} className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl bg-black/35 px-3 py-2 text-xs">
              <div><p className="font-semibold">{name}</p><p className="text-white/35">{type}</p></div>
              <div className="text-right"><p>{amount}</p><span className="inline-block size-2 rounded-full bg-[#c6ff6e]" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  }

  if (type === 'insights') {
    return <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_80%_18%,#b979ff,transparent_28%),linear-gradient(135deg,#23103b,#7b39fc_55%,#d9c1ff)]">
      <div className="absolute left-1/2 top-8 h-[115%] w-[68%] -translate-x-1/2 rounded-[2.7rem] bg-white p-4 shadow-[0_28px_90px_rgba(0,0,0,.24)] transition duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02]">
        <div className="mx-auto mb-6 h-5 w-24 rounded-full bg-black" />
        <p className="font-black lowercase tracking-[-.06em]">elara</p>
        <div className="mt-7 rounded-3xl bg-[#101010] p-4 text-white">
          <p className="text-xs text-white/45">AI insight</p>
          <h4 className="mt-2 text-[24px] font-semibold leading-none tracking-[-.05em]">3 priority actions</h4>
          <div className="mt-5 space-y-3 text-xs text-white/75">
            <p className="rounded-xl bg-white/10 p-3">Reduce single-stock risk</p>
            <p className="rounded-xl bg-white/10 p-3">Review idle liquidity</p>
            <p className="rounded-xl bg-white/10 p-3">Rebalance ETF allocation</p>
          </div>
        </div>
      </div>
    </div>
  }

  return <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#f4f4f1,#dfddd6)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,white,transparent_30%),radial-gradient(circle_at_88%_80%,rgba(0,0,0,.16),transparent_35%)]" />
    <div className="absolute left-4 right-4 top-5 rounded-[1.4rem] border border-black/10 bg-[#0f0f0f] p-4 text-white shadow-[0_34px_100px_rgba(0,0,0,.28)] transition duration-700 group-hover:-translate-y-2">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-white/35">Quant engine</p>
          <h4 className="mt-1 text-2xl font-semibold tracking-[-.06em]">Portfolio optimizer</h4>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">Sharpe 1.42</div>
      </div>

      <div className="mt-4 grid grid-cols-[1.35fr_.65fr] gap-3">
        <div className="rounded-2xl bg-white/[.06] p-3">
          <div className="flex items-center justify-between text-[10px] text-white/35"><span>Efficient frontier</span><span>Risk / Return</span></div>
          <svg viewBox="0 0 250 132" className="mt-2 h-32 w-full overflow-visible">
            <defs>
              <linearGradient id="frontier" x1="0" x2="1"><stop offset="0" stopColor="#c6ff6e"/><stop offset="1" stopColor="#ffffff"/></linearGradient>
            </defs>
            {[24,48,72,96].map(y => <line key={y} x1="6" x2="244" y1={y} y2={y} stroke="white" strokeOpacity=".08" />)}
            {[48,96,144,192].map(x => <line key={x} x1={x} x2={x} y1="8" y2="116" stroke="white" strokeOpacity=".06" />)}
            <path d="M18 104 C54 82, 78 61, 112 45 S178 27, 232 18" fill="none" stroke="url(#frontier)" strokeWidth="4" strokeLinecap="round" />
            <path d="M20 106 C62 98, 92 84, 126 69 S182 56, 226 50" fill="none" stroke="white" strokeOpacity=".34" strokeWidth="2" strokeDasharray="5 7" />
            {[38,72,112,154,198].map((x, i) => <circle key={x} cx={x} cy={[91,72,51,36,24][i]} r="4.5" fill={i===3?'#7b39fc':'#fff'} />)}
            <text x="8" y="128" fill="white" opacity=".35" fontSize="9">Volatility</text><text x="190" y="128" fill="white" opacity=".35" fontSize="9">Expected return</text>
          </svg>
        </div>
        <div className="space-y-2">
          {[
            ['MVO', '34%'],
            ['Risk parity', '41%'],
            ['BL model', '25%']
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/[.06] p-3">
              <p className="text-[10px] text-white/35">{label}</p>
              <p className="mt-1 text-lg font-semibold tracking-[-.04em]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-white/[.06] p-3">
        {[.12,.04,.22,.08,.04,.31,.15,.11,.22,.15,.46,.20,.08,.11,.20,.39].map((v,i)=><div key={i} className="aspect-square rounded-md" style={{background:`rgba(198,255,110,${0.08 + v})`}} />)}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-white/35"><span>Covariance matrix</span><span>Rebalance proposal ready</span></div>
    </div>
  </div>
}

const areaData = [20,28,24,35,41,39,54,58,67,74,86,96].map((value, i)=>({ i, value }));
function PhoneMockup() {
  return <div className="relative mx-auto h-[560px] w-[300px] rounded-[3rem] bg-black p-4 shadow-[0_40px_120px_rgba(0,0,0,.3)]">
    <div className="h-full rounded-[2.4rem] bg-[#101010] p-6 text-white">
      <div className="flex justify-between text-sm text-white/45"><span>9:41</span><span>elara</span></div>
      <p className="mt-9 text-white/45">Net worth</p>
      <h3 className="mt-2 text-4xl font-semibold tracking-tighter">€157,005</h3>
      <p className="mt-2 text-sm text-[#b7ff6a]">+12.4% this year</p>
      <div className="mt-10 h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={areaData}><Area dataKey="value" type="monotone" stroke="#c6ff6e" fill="#c6ff6e" fillOpacity={0.18} strokeWidth={4}/></AreaChart></ResponsiveContainer></div>
      <div className="mt-12 grid grid-cols-2 gap-5">
        <div><LineChart size={22}/><p className="mt-3 text-white/45">Risk score</p><p className="text-2xl font-semibold">72</p></div>
        <div><Sparkles size={22}/><p className="mt-3 text-white/45">Insights</p><p className="text-2xl font-semibold">5</p></div>
      </div>
    </div>
  </div>
}

function CopilotSection() {
  const questions = [
    {
      q: 'Am I taking too much risk?',
      a: 'Your portfolio risk is moderately high: 42% is concentrated in three positions and volatility is above your target profile. Elara would reduce single-stock exposure and move part of the excess risk into diversified ETFs.'
    },
    {
      q: 'Is my portfolio diversified?',
      a: 'You are diversified across asset classes, but not enough across geographies. Most of your exposure is Europe-focused. Adding global equity and short-term bond exposure would improve balance without changing your long-term strategy.'
    },
    {
      q: 'How can I optimize taxes?',
      a: 'You could improve tax efficiency by prioritizing accumulation ETFs where appropriate, avoiding unnecessary sales, and reviewing underperforming positions for potential tax-loss harvesting opportunities.'
    },
    {
      q: 'How much liquidity should I keep?',
      a: 'Based on your current net worth and spending profile, Elara would keep 6–9 months of expenses liquid. The remaining idle cash could be allocated gradually using a risk-controlled portfolio plan.'
    }
  ];
  const [active, setActive] = useState(0);

  return <section id="product" className="bg-white px-3 pb-24">
    <div className="grid min-h-screen overflow-hidden rounded-[2rem] bg-[#f4f3ef] md:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-[520px] overflow-hidden bg-black p-6 md:p-10">
        <video src={cinematicVideo} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_25%,rgba(123,57,252,.45),transparent_34%),linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.86))]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative z-10 flex h-full flex-col justify-between text-white"
        >
          <div>
            <p className="w-max rounded-full bg-white/12 px-4 py-2 text-xs font-semibold backdrop-blur-xl">Interactive demo</p>
            <h2 className="mt-7 max-w-xl text-5xl font-semibold leading-[.9] tracking-[-.075em] md:text-7xl">Talk to your financial copilot</h2>
            <p className="mt-6 max-w-md text-xl leading-tight text-white/65">Ask Elara about risk, allocation, liquidity and portfolio actions using your connected wealth data.</p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 text-sm md:max-w-md">
            {[
              ['Risk score', '72/100'],
              ['Insights ready', '5'],
              ['Connected sources', '4'],
              ['Idle liquidity', '€18.4K']
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <p className="text-white/45">{label}</p><p className="mt-1 text-2xl font-semibold tracking-[-.04em]">{value}</p>
            </div>)}
          </div>
        </motion.div>
      </div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={reveal} className="flex items-center p-5 md:p-12">
        <div className="w-full rounded-[2rem] border border-black/10 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-black/10 p-5 md:p-7">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#efeaff] text-[#7b39fc]"><Sparkles size={20}/></div>
              <div><p className="font-bold">Elara AI</p><p className="flex items-center gap-2 text-sm text-black/45"><span className="size-2 rounded-full bg-emerald-400"/> Active copilot</p></div>
            </div>
            <span className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">Live analysis</span>
          </div>

          <div className="min-h-[430px] p-5 md:p-8">
            <div className="flex items-start gap-4">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#efeaff] text-[#7b39fc]"><Sparkles size={17}/></div>
              <div className="max-w-[560px] rounded-[1.4rem] bg-[#f6f6f4] p-5 text-[16px] leading-relaxed text-black/82">
                Hi, I’m Elara, your financial copilot. I’ve analysed your portfolio. What would you like to know?
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: .35, ease: [0.16, 1, 0.3, 1] as const }}
                className="mt-6 flex items-start gap-4"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-black text-white"><LineChart size={17}/></div>
                <div className="max-w-[620px] rounded-[1.4rem] bg-black p-5 text-[16px] leading-relaxed text-white shadow-soft">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-white/35">{questions[active].q}</p>
                  {questions[active].a}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-black/10 p-5 md:p-7">
            <div className="flex flex-wrap gap-3">
              {questions.map((item, i) => <button
                key={item.q}
                onClick={() => setActive(i)}
                className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${active === i ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/60 hover:border-black/30 hover:text-black'}`}
              >{item.q}</button>)}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-full border border-black/10 bg-white p-2 pl-5 shadow-sm">
              <span className="flex-1 text-black/35">Ask me anything about your wealth...</span>
              <button className="grid size-12 place-items-center rounded-full bg-[#7b39fc] text-white transition hover:scale-105"><ArrowRight size={20}/></button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
}

function FeatureTable() {
  const rows = [
    ['Net worth tracking', 'Real-time wealth dashboard'],
    ['Portfolio optimization', 'Mean-Variance, Black-Litterman, Risk Parity'],
    ['AI companion', 'Ask questions about your real portfolio'],
    ['Physical assets', 'Track homes, vehicles and other manual assets'],
    ['Risk analytics', 'Sharpe ratio, volatility, concentration and drawdown'],
    ['Security', 'Read-only access, encryption and privacy-first design'],
    ['Reports', 'Monthly insights and export-ready summaries']
  ];
  return <section className="bg-white px-5 py-28">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-5xl font-semibold tracking-[-.06em] md:text-6xl">What used to require a private analyst is now simple</h2>
      <p className="mt-5 text-lg text-black/50">Everything you need to monitor, understand and optimize your financial life.</p>
    </div>
    <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[1.5rem] bg-[#fafafa]">
      {rows.map((r, i)=><div key={r[0]} className={`grid gap-4 px-5 py-5 text-lg md:grid-cols-2 ${i%2===0?'bg-black/[.025]':''}`}><div className="font-medium">{r[0]}</div><div className="text-black/55">{r[1]}</div></div>)}
    </div>
    <div className="mt-10 text-center"><button className="rounded-full bg-black px-8 py-4 font-semibold text-white">Join private beta</button></div>
  </section>
}

function Pricing() {
  const plans: Array<[string, string, string, string, string[]]> = [
    ['Starter','Free','forever','Track wealth and explore core features.',['3 connected accounts','Real-time net worth','Basic charts','Monthly report']],
    ['Pro','€6.99','/month','For investors who want portfolio intelligence.',['Unlimited accounts','Optimization algorithms','Physical assets','What-if simulations','CSV / Excel export']],
    ['Advanced','€21.99','/month','For complex portfolios and advanced needs.',['Everything in Pro','Multi-portfolio management','API access','Custom integrations','Priority onboarding']]
  ];
  return <section id="pricing" className="bg-[#f6f6f4] px-5 py-28">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.35em] text-black/35">Pricing</p><h2 className="mt-5 text-5xl font-black leading-[.9] tracking-[-.07em] md:text-7xl">Choose the plan that's right for you</h2><p className="mt-6 max-w-xl text-xl leading-snug text-black/50">Transparent pricing, no hidden costs. Cancel anytime, no contractual obligations.</p></div>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {plans.map((p,i)=><motion.div key={p[0]} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} className={`${i===1?'bg-black text-white shadow-soft':'bg-white text-black'} relative rounded-[1.6rem] border border-black/10 p-8`}>
          {i===1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-2 text-xs font-bold uppercase tracking-[.25em] text-black">Most popular</div>}
          <p className={`text-xs font-bold uppercase tracking-[.28em] ${i===1?'text-white/45':'text-black/35'}`}>{p[0]}</p>
          <div className="mt-7 flex items-end gap-2"><span className="text-6xl font-black tracking-[-.08em]">{p[1]}</span><span className={i===1?'text-white/55':'text-black/45'}>{p[2]}</span></div>
          <p className={`mt-7 min-h-[56px] leading-snug ${i===1?'text-white/62':'text-black/55'}`}>{p[3]}</p>
          <div className={`my-8 h-px ${i===1?'bg-white/15':'bg-black/10'}`} />
          <div className="space-y-4">{(p[4] as string[]).map(f=><div key={f} className="flex gap-3"><Check size={18} className={i===1?'text-white':'text-black'}/><span className={i===1?'text-white/78':'text-black/60'}>{f}</span></div>)}</div>
          <button className={`${i===1?'bg-white text-black':'bg-black text-white'} mt-10 w-full rounded-full py-4 font-semibold`}>{i===0?'Start free':'Join beta'}</button>
        </motion.div>)}
      </div>
    </div>
  </section>
}

function FinalCard() {
  return <section className="relative bg-white px-3 pb-3 pt-20">
    <div className="absolute inset-x-0 top-0 h-64 bg-black"><video src={heroVideo} autoPlay loop muted playsInline className="h-full w-full object-cover opacity-50" /></div>
    <div className="relative mx-auto grid max-w-[calc(100vw-24px)] gap-12 rounded-[2rem] bg-white p-8 shadow-soft md:grid-cols-[1.1fr_1fr_1fr_1fr] md:p-14">
      <div>
        <Logo />
        <p className="mt-6 max-w-md text-black/55">Portfolio Intelligence & Net Worth Optimization. Quantitative models, AI and unified wealth tracking for modern investors.</p>
        <div className="mt-8 flex gap-2"><input placeholder="Your email" className="min-w-0 flex-1 rounded-full border border-black/15 px-5 py-4 outline-none"/><button className="rounded-full bg-black px-6 text-white">Sign up</button></div>
      </div>
      <div><p className="mb-5 text-black/35">Product</p>{['How it works','Portfolio overview','Optimization','AI companion','Pricing'].map(x=><a className="mb-4 block" key={x}>{x}</a>)}</div>
      <div><p className="mb-5 text-black/35">Technology</p>{['Mean-Variance','Black-Litterman','Risk Parity','Security','GDPR'].map(x=><a className="mb-4 block" key={x}>{x}</a>)}</div>
      <div><p className="mb-5 text-black/35">Company</p>{['Team','Blog','Careers','Contact','Beta access'].map(x=><a className="mb-4 block" key={x}>{x}</a>)}</div>
      <div className="border-t border-black/10 pt-8 text-sm text-black/35 md:col-span-4">© 2026 Elara. All rights reserved. No support bot included.</div>
    </div>
  </section>
}

function App() {
  return <main>
    <Hero />
    <Trust />
    <HowItWorks />
    <CopilotSection />
    <FeatureTable />
    <Pricing />
    <FinalCard />
  </main>
}

export default App;
