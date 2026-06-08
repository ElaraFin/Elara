import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRight, Check, Grid3X3, LineChart, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';


const heroVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4';
const heroVideo_old = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260207_050933_33e2620d-09cd-43a2-80ef-4cdbb42f4194.mp4';
const cinematicVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260215_121759_424f8e9c-d8bd-4974-9567-52709dfb6842.mp4';

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

function Logo() {
  return <div className="text-[26px] font-black tracking-[-0.08em] lowercase">elara</div>;
}

function InstitutionStrip() {
  const logos = [
    { name: "Università di Pisa", src: "/logos/unipi.jpg" },
    { name: "Politecnico di Torino", src: "/logos/polito.jpg" },
    { name: "Università di Bologna", src: "/logos/unibo.jpg" },
    { name: "I3P", src: "/logos/i3p.jpg" },
  ];

  return (
    <section className="bg-white px-6 pt-14 pb-8 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={reveal}
        className="mx-auto max-w-5xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/35">
          Where we started
        </p>

        <div className="relative mx-auto mt-7 max-w-4xl overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

          <div className="flex w-max animate-logo-scroll items-center gap-10">
            {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex h-16 w-44 shrink-0 items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-12 max-w-full object-contain grayscale opacity-35 transition duration-300 hover:grayscale-0 hover:opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
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
  return (
    <section className="min-h-screen bg-white p-2 md:p-3">
      <div className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-[2rem] bg-black md:min-h-[calc(100vh-24px)] md:rounded-[2.1rem]">
        <video src={heroVideo} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full scale-125 object-cover object-left-top brightness-125 saturate-150 contrast-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        <Navbar />
        <motion.div initial="hidden" animate="visible" variants={reveal} className="relative z-10 flex min-h-[calc(100vh-16px)] flex-col justify-center px-6 pt-20 text-white md:px-[10vw] md:pt-24">
          <div className="mb-7 w-max rounded-full bg-white/12 px-5 py-2.5 text-sm font-medium backdrop-blur-xl">Private beta now open</div>
          <h1 className="max-w-[950px] text-[16vw] font-semibold leading-[.86] tracking-[-.085em] md:text-[9vw] lg:text-[96px]">Quantitative finance,<br />in your pocket.</h1>
          <p className="mt-7 max-w-2xl text-xl leading-tight text-white/88 md:text-[28px]">Unifica il tuo patrimonio e ottimizzalo con modelli quantitativi e intelligenza artificiale.</p>
          <div className="mt-9 flex items-center gap-5">
            <button className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-[1.03]">Join beta <ArrowRight className="transition group-hover:translate-x-1" size={18}/></button>
            <button className="rounded-full px-7 py-4 font-semibold text-white transition hover:bg-white/10">Watch demo</button>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="bg-white px-6 pt-8 pb-16 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={reveal}
        className="mx-auto max-w-6xl"
      >
        <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-black/55 md:text-[15px]">
          Built for investors who want institutional-level portfolio intelligence without complexity.
        </p>

        <div className="mx-auto mt-9 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-3xl font-bold tracking-tighter text-black/20 md:gap-x-16">
          <span>PSD2</span>
          <span>GDPR</span>
          <span>AES-256</span>
          <span>Read-only</span>
          <span>ISO-ready</span>
        </div>
      </motion.div>
    </section>
  );
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
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_78%_18%,#b979ff,transparent_28%),linear-gradient(135deg,#201038,#6f35f5_52%,#d8c4ff)]">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-10 h-[120%] w-[78%] -translate-x-1/2 rounded-[3rem] bg-white/12 blur-3xl" />
      <div className="absolute -right-20 top-24 size-56 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -left-20 bottom-10 size-48 rounded-full bg-black/25 blur-3xl" />

      {/* Step number */}
      <div className="absolute left-6 top-6 z-30 grid size-11 place-items-center rounded-2xl bg-white/15 text-xl font-bold text-white/75 backdrop-blur-md">
        1
      </div>

      {/* Phone — same style as section 3 */}
      <div className="absolute left-1/2 top-8 z-20 h-[118%] w-[70%] -translate-x-1/2 rounded-[2.9rem] bg-white p-4 shadow-[0_28px_90px_rgba(0,0,0,.28)] transition duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02]">
        {/* Dynamic island */}
        <div className="mx-auto mb-5 h-5 w-24 rounded-full bg-black" />

        {/* Phone header */}
        <div className="flex items-center justify-between">
          <p className="font-black lowercase tracking-[-.06em] text-black">
            elara
          </p>

          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold text-white">
            Live
          </span>
        </div>

        {/* Phone screen */}
        <div className="relative mt-5 h-[275px] overflow-hidden rounded-[2rem] bg-[#101010] p-4 text-white">
          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(198,255,110,.14),transparent_25%),radial-gradient(circle_at_18%_10%,rgba(255,255,255,.12),transparent_26%)]" />

          {/* Wallet-style card stack */}
          <div className="absolute left-1/2 top-[24px] z-20 h-[230px] w-[236px] -translate-x-1/2">
            {/* Card 1 - Banco BPM */}
            <div className="absolute left-1/2 top-0 h-[82px] w-[214px] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-white/15 bg-white shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#edf7fb_0%,#ffffff_45%,#dceef1_100%)]" />
              <div className="relative flex h-full items-center justify-center px-5">
                <img
                  src="/logos/bpm.png"
                  alt="Banco BPM"
                  className="max-h-12 max-w-[174px] object-contain"
                />
              </div>
            </div>

            {/* Card 2 - UniCredit */}
            <div className="absolute left-1/2 top-[50px] h-[82px] w-[222px] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-white/15 bg-white shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#f4f4f4_45%,#e8e8e8_100%)]" />
              <div className="relative flex h-full items-center justify-center px-5">
                <img
                  src="/logos/unicredit.png"
                  alt="UniCredit"
                  className="max-h-12 max-w-[184px] object-contain"
                />
              </div>
            </div>

            {/* Card 3 - Trade Republic */}
            <div className="absolute left-1/2 top-[100px] h-[82px] w-[230px] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-white/15 bg-black shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#050505_0%,#171717_52%,#000000_100%)]" />
              <div className="relative flex h-full items-center justify-center px-5">
                <img
                  src="/logos/traderepublic.png"
                  alt="Trade Republic"
                  className="max-h-10 max-w-[190px] object-contain"
                />
              </div>
            </div>

            {/* Card 4 - Revolut */}
            <div className="absolute left-1/2 top-[150px] h-[82px] w-[236px] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#5faee8] shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#77c7ff_0%,#3e95d8_55%,#1f6eb5_100%)]" />
              <div className="relative flex h-full items-center justify-center px-5">
                <img
                  src="/logos/revolut.png"
                  alt="Revolut"
                  className="max-h-12 max-w-[184px] object-contain"
                />
              </div>
            </div>
          </div>

          {/* Bottom mini status */}
          <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                4 sources connected
              </span>

              <span className="text-[#c6ff6e]">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
  type CopilotQuestion = {
  q: string;
  title: string;
  summary: string;
  metrics: [string, string][];
  chartType: 'risk' | 'pie' | 'tax' | 'liquidity';
  bars: [string, number][];
};

  const questions: CopilotQuestion[] = [
    {
      q: 'Am I taking too much risk?',
      title: 'Risk is moderately high, mainly due to concentration.',
      summary:
        'Your portfolio risk score is 72/100. The main driver is concentration: 42% of the portfolio is held in three positions. This means that a small number of assets can move your total net worth more than expected. A possible improvement would be to gradually reduce single-position exposure and move part of the risk into broader, diversified ETF exposure.',
      metrics: [
        ['Risk score', '72/100'],
        ['Top 3', '42%'],
        ['Volatility', '18.6%']
      ],
      chartType: 'risk',
      bars: [
        ['Stocks', 42],
        ['ETFs', 31],
        ['Crypto', 14],
        ['Cash', 13]
      ]
    },
    {
      q: 'Is my portfolio diversified?',
      title: 'Diversification is good by asset class, weaker by geography.',
      summary:
        'You are diversified across different asset classes, but geographic exposure is still unbalanced. Europe represents 61% of the portfolio, while global and US exposure are relatively low compared with a neutral benchmark. This does not mean the portfolio is wrong, but it means your results depend heavily on one macro area.',
      metrics: [
        ['Europe', '61%'],
        ['US', '18%'],
        ['Global', '24%']
      ],
      chartType: 'pie',
      bars: [
        ['Europe', 61],
        ['US', 18],
        ['Global', 24],
        ['EM', 7]
      ]
    },
    {
      q: 'How can I optimize taxes?',
      title: 'Tax efficiency can improve by reducing unnecessary turnover.',
      summary:
        'The portfolio appears reasonably tax efficient, but there is room to reduce avoidable tax drag. The main levers are limiting unnecessary sales, prioritizing accumulation instruments where appropriate, and reviewing underperforming positions only when there is a clear portfolio reason. Tax optimization should support the strategy, not drive it alone.',
      metrics: [
        ['Tax drag', '1.2%'],
        ['Accum.', '58%'],
        ['Turnover', 'Med']
      ],
      chartType: 'tax',
      bars: [
        ['Accumulation', 58],
        ['Distributing', 24],
        ['Realized gains', 12],
        ['Offsets', 6]
      ]
    },
    {
      q: 'How much liquidity should I keep?',
      title: 'Your liquidity buffer is healthy, but part of it may be idle.',
      summary:
        'Based on the current profile, a 6–9 month emergency buffer looks sufficient. Liquidity above that range may be useful for flexibility, but it can reduce long-term expected return if it stays idle for too long. A gradual deployment plan could move excess cash into the market without forcing a single entry point.',
      metrics: [
        ['Idle cash', '€18.4K'],
        ['Buffer', '6–9 mo'],
        ['Deployable', '€7.2K']
      ],
      chartType: 'liquidity',
      bars: [
        ['Buffer', 62],
        ['Deployable', 24],
        ['Needs', 14]
      ]
    }
  ];

  const [active, setActive] = useState(0);
  const [thinking, setThinking] = useState(false);

  function handleQuestionClick(index: number) {
    setActive(index);
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
    }, 1400);
  }

  const activeQuestion = questions[active];

  function ElaraAvatar() {
    return (
      <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#0b0820] p-1">
        <img
          src="/logos/Elara_logo_trasparent.png"
          alt="Elara"
          className="h-[92%] w-[92%] object-contain"
        />
      </div>
    );
  }

  function UserAvatar() {
    return (
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f1f1ef] text-black">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="8"
            r="3.2"
            stroke="black"
            strokeOpacity="0.65"
            strokeWidth="2"
          />
          <path
            d="M5.5 20C6.4 16.4 8.7 14.6 12 14.6C15.3 14.6 17.6 16.4 18.5 20"
            stroke="black"
            strokeOpacity="0.65"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  function MiniInsightChart({ item }: { item: CopilotQuestion }) {
    if (item.chartType === 'risk') {
      return (
        <div className="mt-4 grid grid-cols-[1.15fr_.85fr] gap-3">
          <div className="rounded-2xl bg-[#1f1f1f] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-white/40">
                Risk trend
              </p>

              <p className="text-[11px] font-bold text-[#c6ff6e]">
                72/100
              </p>
            </div>

            <svg viewBox="0 0 180 90" className="h-24 w-full overflow-visible">
              <path
                d="M0 68 C22 52, 38 63, 56 42 S93 50, 114 31 S150 35, 178 14"
                fill="none"
                stroke="#c6ff6e"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0 68 C22 52, 38 63, 56 42 S93 50, 114 31 S150 35, 178 14 L178 90 L0 90 Z"
                fill="#c6ff6e"
                opacity=".16"
              />
              <line x1="0" y1="72" x2="180" y2="72" stroke="white" strokeOpacity=".08" />
              <line x1="0" y1="42" x2="180" y2="42" stroke="white" strokeOpacity=".08" />
            </svg>
          </div>

          <div className="space-y-3">
            {item.bars.slice(0, 3).map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#1f1f1f] p-3">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-white/40">
                    {label}
                  </span>

                  <span className="font-bold text-white">
                    {value}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#c6ff6e]"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (item.chartType === 'pie') {
      return (
        <div className="mt-4 grid grid-cols-[.85fr_1.15fr] gap-3">
          <div className="grid place-items-center rounded-2xl bg-[#1f1f1f] p-4">
            <div className="relative grid size-28 place-items-center rounded-full bg-[conic-gradient(#c6ff6e_0_61%,#8b5cf6_61%_79%,#ffffff_79%_93%,#3f3f46_93%_100%)]">
              <div className="grid size-16 place-items-center rounded-full bg-[#1f1f1f]">
                <p className="text-xl font-bold text-white">
                  61%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1f1f1f] p-4">
            <p className="mb-3 text-[11px] font-semibold text-white/40">
              Geographic exposure
            </p>

            <div className="space-y-3">
              {item.bars.map(([label, value], index) => (
                <div key={label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        index === 0
                          ? 'bg-[#c6ff6e]'
                          : index === 1
                            ? 'bg-[#8b5cf6]'
                            : index === 2
                              ? 'bg-white'
                              : 'bg-white/25'
                      }`}
                    />

                    <span className="text-white/50">
                      {label}
                    </span>
                  </div>

                  <span className="font-bold text-white">
                    {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (item.chartType === 'tax') {
      return (
        <div className="mt-4 rounded-2xl bg-[#1f1f1f] p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-white/40">
              Tax efficiency mix
            </p>

            <p className="text-[11px] font-bold text-[#c6ff6e]">
              +0.8% potential
            </p>
          </div>

          <div className="flex h-28 items-end gap-3">
            {item.bars.map(([label, value]) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-20 w-full items-end rounded-xl bg-white/5 px-1.5">
                  <div
                    className="w-full rounded-lg bg-[#c6ff6e]"
                    style={{ height: `${Math.max(value, 10)}%` }}
                  />
                </div>

                <span className="text-[9px] font-medium text-white/35">
                  {label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 rounded-2xl bg-[#1f1f1f] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-white/40">
            Liquidity allocation
          </p>

          <p className="text-[11px] font-bold text-[#c6ff6e]">
            €18.4K
          </p>
        </div>

        <div className="flex h-5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[#c6ff6e]" style={{ width: '62%' }} />
          <div className="h-full bg-[#8b5cf6]" style={{ width: '24%' }} />
          <div className="h-full bg-white/35" style={{ width: '14%' }} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {item.bars.map(([label, value], index) => (
            <div key={label} className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-1.5">
                <span
                  className={`size-2 rounded-full ${
                    index === 0
                      ? 'bg-[#c6ff6e]'
                      : index === 1
                        ? 'bg-[#8b5cf6]'
                        : 'bg-white/35'
                  }`}
                />

                <p className="text-[9px] text-white/35">
                  {label}
                </p>
              </div>

              <p className="mt-1 text-lg font-bold text-white">
                {value}%
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="product" className="bg-white px-3 pb-24">
      <div className="grid overflow-hidden rounded-[2rem] bg-[#f4f3ef] md:h-[760px] md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative h-[620px] overflow-hidden bg-black p-6 md:h-full md:p-10">
          <video
            src={cinematicVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_25%,rgba(123,57,252,.45),transparent_34%),linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.86))]" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative z-10 flex h-full flex-col justify-start text-white"
          >
            <p className="w-max rounded-full bg-white/12 px-4 py-2 text-xs font-semibold backdrop-blur-xl">
              Interactive demo
            </p>

            <h2 className="mt-7 max-w-xl text-5xl font-semibold leading-[.9] tracking-[-.075em] md:text-7xl">
              Talk to your financial copilot
            </h2>

            <p className="mt-6 max-w-md text-xl leading-tight text-white/65">
              Ask Elara about risk, allocation, liquidity and portfolio actions using your connected wealth data.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={reveal}
          className="flex min-h-0 items-center p-5 md:p-8"
        >
          <div className="flex h-[700px] w-full flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-black/10 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <ElaraAvatar />

                <div>
                  <p className="font-bold">
                    Elara AI
                  </p>

                  <p className="flex items-center gap-2 text-sm text-black/45">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    Active copilot
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">
                Live analysis
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
              <div className="flex items-start gap-4">
                <ElaraAvatar />

                <div className="max-w-[560px] rounded-[1.4rem] bg-black p-5 text-[16px] leading-relaxed text-white">
                  Hi, I’m Elara, your financial copilot. I’ve analysed your portfolio. What would you like to know?
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`user-${active}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: .28, ease: [0.16, 1, 0.3, 1] as const }}
                  className="mt-5 flex items-start justify-end gap-4"
                >
                  <div className="max-w-[560px] rounded-[1.4rem] bg-[#f6f6f4] p-4 text-[15px] font-medium leading-relaxed text-black/72 shadow-soft">
                    {activeQuestion.q}
                  </div>

                  <UserAvatar />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={thinking ? `thinking-${active}` : `answer-${active}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: .35, ease: [0.16, 1, 0.3, 1] as const }}
                  className="mt-5 flex items-start gap-4"
                >
                  <ElaraAvatar />

                  {thinking ? (
                    <div className="flex h-12 items-center gap-1.5">
                      <span className="size-2 animate-bounce rounded-full bg-black/35 [animation-delay:-0.3s]" />
                      <span className="size-2 animate-bounce rounded-full bg-black/35 [animation-delay:-0.15s]" />
                      <span className="size-2 animate-bounce rounded-full bg-black/35" />
                    </div>
                  ) : (
                    <div className="w-full max-w-[680px] rounded-[1.4rem] bg-black p-4 text-[15px] leading-relaxed text-white">
                      <p className="text-xs font-semibold uppercase tracking-[.22em] text-white/35">
                        Quant insight
                      </p>

                      <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-.05em] text-white">
                        {activeQuestion.title}
                      </h3>

                      <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                        {activeQuestion.summary}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {activeQuestion.metrics.map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl bg-[#1f1f1f] p-3"
                          >
                            <p className="text-[10px] font-medium text-white/35">
                              {label}
                            </p>

                            <p className="mt-1 text-lg font-bold tracking-[-.045em] text-white">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <MiniInsightChart item={activeQuestion} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-black/10 p-3 md:p-3">
              <div className="mx-auto grid max-w-[620px] grid-cols-2 gap-2">
                {questions.map((item, i) => (
                  <button
                    key={item.q}
                    onClick={() => handleQuestionClick(i)}
                    className="mx-auto w-full max-w-[285px] rounded-[999px] border border-black/10 bg-white px-4 py-2 text-[12px] font-semibold leading-tight text-black/55 transition-colors duration-200 ease-out hover:border-black hover:bg-black hover:text-white"
                  >
                    {item.q}
                  </button>
                ))}
              </div>

              <div className="mx-auto mt-3 flex max-w-[620px] items-center gap-2 rounded-[999px] border border-black/10 bg-white p-1 pl-4 shadow-sm">
                <span className="flex-1 text-[13px] text-black/35">
                  Ask me anything about your wealth...
                </span>

                <button className="grid size-9 place-items-center rounded-full bg-[#7b39fc] text-white transition-transform duration-200 ease-out hover:scale-105">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
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
      <div className="border-t border-black/10 pt-8 text-sm text-black/35 md:col-span-4">© 2026 Elara Technologies. All rights reserved. No support bot included.</div>
    </div>
  </section>
}

function App() {
  return (
    <main>
      <Hero />
      <InstitutionStrip />
      <HowItWorks />
      <CopilotSection />
      <FeatureTable />
      <Trust />
      <Pricing />
      <FinalCard />
    </main>
  );
}

export default App;
