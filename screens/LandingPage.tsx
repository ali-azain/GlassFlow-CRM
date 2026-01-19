import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Command, Check, Plus, X, Zap, GitBranch, Users, Mail, Slack, Calendar, BarChart3, Play } from 'lucide-react';

type LandingPageProps = {
  onGetStarted: () => void;
  onSignIn: () => void;
};

// --- Reusable Components ---

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl ${className}`}>
    {children}
  </div>
);

// --- Floating Particles Component ---
const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// --- Animated Counter Component ---
const AnimatedCounter: React.FC<{ value: number; suffix?: string; label: string }> = ({ value, suffix = '', label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
};

// --- Spotlight Card Component ---
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(6, 182, 212, 0.4), transparent 40%)`,
          WebkitMask: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      {children}
    </div>
  );
};

// --- Section Components ---

const Navbar: React.FC<{ onGetStarted: () => void; onSignIn: () => void }> = ({ onGetStarted, onSignIn }) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#0B0C10]/80 border-b border-white/5"
  >
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-white text-xs font-bold">G</span>
        </div>
        <span className="text-white text-sm font-semibold tracking-tight">GlassFlow</span>
      </div>
      <nav className="hidden md:flex items-center space-x-8 text-sm text-white/60">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      </nav>
      <div className="flex items-center space-x-3">
        <button onClick={onSignIn} className="text-sm text-white/70 hover:text-white transition-colors">Sign in</button>
        <button
          onClick={onGetStarted}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-[#0B0C10] hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
        >
          Get Started
        </button>
      </div>
    </div>
  </motion.header>
);

const HeroSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
    {/* Aurora Background */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-[120px]"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    {/* Floating Particles */}
    <FloatingParticles />

    <div className="relative z-10 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
      >
        <Zap size={14} className="text-cyan-400" />
        <span className="text-sm text-white/70">The CRM that feels like magic</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
      >
        Deploy Relationships
        <br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
          in Seconds.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-white/50 max-w-2xl mx-auto mb-10"
      >
        GlassFlow is the beautifully minimal CRM built for teams who value speed, clarity, and design.
        Stop wrestling with clunky software.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button
          onClick={onGetStarted}
          className="group px-6 py-3 rounded-xl text-base font-semibold bg-white text-[#0B0C10] hover:bg-white/90 transition-all shadow-2xl shadow-white/20 flex items-center space-x-2"
        >
          <span>Get Started Free</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 hover:bg-white/10 hover:text-white/70 transition-all">
          <Play size={14} className="text-cyan-400" />
          <span>Watch Demo</span>
        </button>
      </motion.div>
    </div>

    {/* 3D Dashboard Preview */}
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative z-10 mt-16 w-full max-w-5xl mx-auto perspective-1000"
    >
      <div className="relative" style={{ transform: 'perspective(1000px) rotateX(5deg)' }}>
        <GlassCard className="p-1 shadow-2xl shadow-cyan-500/10">
          <div className="bg-[#0B0C10] rounded-2xl p-4 border border-white/5">
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-xs text-white/30">GlassFlow Dashboard</div>
            </div>
            {/* Mock Kanban Columns */}
            <div className="grid grid-cols-4 gap-3">
              {['New', 'Contacted', 'Proposal', 'Won'].map((col, i) => (
                <div key={col} className="bg-white/5 rounded-xl p-3">
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">{col}</div>
                  {[...Array(3 - i)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (i * 0.2) + (j * 0.1) }}
                      className="bg-white/5 rounded-lg p-2 mb-2 border border-white/5"
                    >
                      <div className="h-2 w-3/4 bg-white/10 rounded mb-1" />
                      <div className="h-2 w-1/2 bg-white/5 rounded" />
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-transparent to-violet-500/20 blur-3xl -z-10 rounded-3xl" />
      </div>
    </motion.div>
  </section>
);

// --- Stats Section ---
const StatsSection: React.FC = () => (
  <section className="py-20 px-6 border-y border-white/5">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      <AnimatedCounter value={500} suffix="+" label="Happy Teams" />
      <AnimatedCounter value={1000000} suffix="+" label="Leads Managed" />
      <AnimatedCounter value={99.9} suffix="%" label="Uptime" />
      <AnimatedCounter value={12} suffix="ms" label="Avg. Latency" />
    </div>
  </section>
);

const SocialProofSection: React.FC = () => {
  const logos = ['Acme Inc', 'Globex', 'Initech', 'Umbrella', 'Stark Industries', 'Wayne Enterprises'];
  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center text-xs text-white/30 uppercase tracking-widest mb-8">Trusted by teams at</div>
      <div className="relative">
        <motion.div
          className="flex space-x-16"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex-shrink-0 text-xl font-bold text-white/20 hover:text-white/80 transition-all duration-300 cursor-default">
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Built for Speed & Clarity</h2>
        <p className="text-white/50 max-w-xl mx-auto">Everything you need to manage relationships, nothing you don't.</p>
      </motion.div>

      {/* Bento Grid with Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <SpotlightCard className="p-8 h-full">
            <div className="flex items-center space-x-2 mb-4">
              <Zap size={20} className="text-cyan-400" />
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Lightning Fast</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">12ms Latency</h3>
            <p className="text-white/50 text-sm">Real-time updates across your entire pipeline. No loading spinners, ever.</p>
          </SpotlightCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <SpotlightCard className="p-8 h-full">
            <GitBranch size={20} className="text-violet-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Visual Pipeline</h3>
            <p className="text-white/50 text-sm">Drag-and-drop stages. See your deals flow.</p>
          </SpotlightCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <SpotlightCard className="p-8 h-full">
            <Users size={20} className="text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Team Ready</h3>
            <p className="text-white/50 text-sm">Collaborate in real-time with your team.</p>
          </SpotlightCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2"
        >
          <SpotlightCard className="p-8 h-full">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Integrations</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Works with your ecosystem</h3>
            <div className="flex items-center space-x-6">
              {[Mail, Slack, Calendar, BarChart3].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:border-cyan-500/50 transition-colors"
                >
                  <Icon size={24} className="text-white/60" />
                </motion.div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  </section>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    { quote: "GlassFlow feels like it reads my mind. It's the Linear of CRMs.", author: "Sarah Chen", role: "Head of Sales, Acme" },
    { quote: "Finally, a CRM that doesn't make me want to tear my hair out.", author: "Marcus Johnson", role: "Founder, Startup Inc" },
    { quote: "Our close rate went up 30% in the first month. Not kidding.", author: "Emily Rodriguez", role: "Sales Lead, TechCo" },
  ];
  return (
    <section className="py-24 px-6 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Don't take our word for it</h2>
          <p className="text-white/50">See what our users are saying.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <SpotlightCard className="p-8 h-full">
                <div className="text-4xl text-cyan-500/30 font-serif mb-4">"</div>
                <p className="text-white/80 text-lg mb-6">{t.quote}</p>
                <div>
                  <div className="text-white font-medium">{t.author}</div>
                  <div className="text-white/40 text-sm">{t.role}</div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <section id="pricing" className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-white/50">Start free. Upgrade when you're ready.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <div className="p-8 rounded-3xl border border-white/10 h-full hover:border-white/20 transition-colors">
            <div className="text-sm text-white/40 uppercase tracking-wider mb-2">Free</div>
            <div className="text-4xl font-bold text-white mb-4">$0<span className="text-lg text-white/40">/mo</span></div>
            <p className="text-white/50 text-sm mb-8">Perfect for getting started.</p>
            <ul className="space-y-3 mb-8">
              {['Up to 100 leads', 'Basic pipeline', 'Email support'].map((f, i) => (
                <li key={i} className="flex items-center space-x-3 text-white/70 text-sm">
                  <Check size={16} className="text-emerald-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #d946ef, #06b6d4)' }}
          />
          <div className="relative p-8 rounded-3xl bg-[#0B0C10] h-full">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-xs font-semibold text-white">
              Most Popular
            </div>
            <div className="text-sm text-cyan-400 uppercase tracking-wider mb-2">Pro</div>
            <div className="text-4xl font-bold text-white mb-4">$29<span className="text-lg text-white/40">/mo</span></div>
            <p className="text-white/50 text-sm mb-8">For growing teams.</p>
            <ul className="space-y-3 mb-8">
              {['Unlimited leads', 'Advanced pipeline', 'Priority support', 'Integrations', 'Team collaboration'].map((f, i) => (
                <li key={i} className="flex items-center space-x-3 text-white/70 text-sm">
                  <Check size={16} className="text-cyan-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
            >
              Start Pro Trial
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: 'How does the free trial work?', a: 'You get full access to all Pro features for 14 days. No credit card required.' },
    { q: 'Can I import my existing data?', a: 'Yes! We support CSV imports with intelligent field mapping.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use Row Level Security in Supabase to ensure only you can access your data.' },
    { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time with no questions asked.' },
  ];

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <SpotlightCard className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={20} className="text-white/50" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-white/60">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="relative py-16 px-6 border-t border-white/5 overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">G</span>
        </div>
        <span className="text-white/60 text-sm">GlassFlow © 2025</span>
      </div>
      <div className="flex items-center space-x-6 text-sm text-white/40">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>
    </div>
    {/* Watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="text-[200px] font-bold text-white/[0.02] tracking-tighter select-none">GlassFlow</span>
    </div>
  </footer>
);

// --- Main Landing Page ---

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white overflow-x-hidden">
      <Navbar onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <HeroSection onGetStarted={onGetStarted} />
      <StatsSection />
      <SocialProofSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection onGetStarted={onGetStarted} />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
