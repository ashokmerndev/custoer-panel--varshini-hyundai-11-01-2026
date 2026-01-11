'use client';

import { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform, 
  useSpring 
} from 'framer-motion'; // Added motion hooks
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, CheckCircle2, Home, Sun, Moon } from 'lucide-react';
import Image from 'next/image';

// 1. Entry Animation (Slide Up)
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

// Background blobs animation
const blobAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3],
    rotate: [0, 45, 0],
  },
  transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  
  // Theme State (Default: Dark)
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { login, loading, user } = useAuth();
  const router = useRouter();

  // --- 🖱️ NEW: Cursor Move / Tilt Animation Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Create smooth spring physics for the tilt
  const rotateX = useSpring(useTransform(y, [-300, 300], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-5, 5]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to center of card
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    // Reset to center when mouse leaves
    x.set(0);
    y.set(0);
  }
  // --------------------------------------------------

  useEffect(() => {
    if (user) {
      // Redirect to Dashboard if logged in
      router.replace('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login(formData);
      if (result.success) {
        router.push('/'); 
      } else {
        setError(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    }
  };

  if (user) return null; 

  return (
    // Main Container: 'min-h-screen' fixes the scroll gap issue
    <div className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-x-hidden transition-colors duration-500 ${
        isDarkMode 
        ? 'bg-[#020617]' 
        : 'bg-gradient-to-r from-amber-200 to-yellow-400'
    }`}>
      
      {/* ================= NAVIGATION BAR ================= */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${isDarkMode ? 'bg-blue-600 shadow-blue-500/20' : 'bg-blue-600 shadow-blue-500/30'}`}>
               <span className="font-bold text-xl">V</span>
            </div>
            <div className="hidden md:block">
               <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>VARSHINI</span>
               <span className="text-blue-500 font-bold ml-1.5">HYUNDAI</span>
            </div>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${
                    isDarkMode 
                    ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' 
                    : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-white shadow-sm'
                }`}
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Home Button */}
            <Link href="/">
                <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all backdrop-blur-md ${
                    isDarkMode
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-white hover:text-blue-600 shadow-sm'
                }`}>
                <Home size={16} />
                <span className="hidden sm:inline">Back to Home</span>
                </button>
            </Link>
        </div>
      </div>


      {/* ================= BACKGROUND BLOBS (Only Visible in Dark Mode) ================= */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
                animate={blobAnimation.animate} 
                transition={blobAnimation.transition}
                className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" 
            />
            <motion.div 
                animate={blobAnimation.animate} 
                transition={{ ...blobAnimation.transition, delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" 
            />
        </div>
      )}

      {/* ================= THE CARD ================= */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="show"
        // 🆕 Added Mouse Events for Tilt Animation
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // 🆕 Applied Rotation Styles
        style={{ 
            rotateX: rotateX, 
            rotateY: rotateY, 
            transformStyle: "preserve-3d", // Helps with 3D effect
        }}
        className={`w-full max-w-[1000px] min-h-[600px] rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 transition-colors duration-500 border ${
            isDarkMode 
            ? 'bg-[#0f172a]/60 backdrop-blur-2xl border-white/10 shadow-black/50' 
            : 'bg-white/70 backdrop-blur-xl border-white/40 shadow-blue-200/50'
        }`}
      >
        
        {/* ================= LEFT SIDE (IMAGE) ================= */}
        <div className={`relative hidden lg:flex flex-col justify-between p-12 overflow-hidden  ${
            isDarkMode 
            ? 'bg-gradient-to-br from-blue-600/20 via-blue-900/20 to-transparent'
            : 'bg-gradient-to-br from-blue-100/50 via-blue-50/50 to-transparent'
        }`}>
           {/* Background Image */}
           <div className="absolute inset-0 z-0">
              <Image 
                src="/images/cretapng.png" 
                alt="Hyundai Creta"
                fill
                className="object-contain object-center
  scale-110
  -mt-16 lg:-mt-10
  translate-y-0
  hover:-translate-y-3
  transition-transform duration-700 ease-out
  drop-shadow-[0_40px_60px_rgba(0,0,0,0.4)]
  opacity-95"
                priority
              />
              {/* Overlays for text readability - Adjusts based on theme */}
              <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                  isDarkMode ? 'from-[#020617] opacity-90' : 'from-white opacity-60'
              }`} />
           </div>

           {/* Branding Top */}
           <div className="relative z-10">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md text-xs font-bold uppercase tracking-wider ${
                  isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-white/60 border-white/40 text-blue-900 shadow-sm'
              }`}>
                <Sparkles size={12} className="text-blue-500" />
                Premium Spares
              </div>
           </div>

           {/* Branding Bottom */}
           <div className="relative z-10 space-y-4">
              <h2 className={`text-4xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Engineered for <br/>
                <span className="text-blue-500">Perfection.</span>
              </h2>
              <div className="space-y-3 pt-2">
                {['Genuine Parts', 'Express Delivery', 'Expert Support'].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <CheckCircle2 size={16} className="text-blue-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* ================= RIGHT SIDE (FORM) ================= */}
        <div className={`p-8 lg:p-12 flex flex-col justify-center transition-colors duration-500 ${
            isDarkMode ? 'bg-black/20' : 'bg-white/40'
        }`}>
           
           <div className="mb-8 text-center lg:text-left">
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sign in to access your dashboard & orders.</p>
           </div>

           <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-500 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
           </AnimatePresence>

           <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-2">
                <label className={`text-xs font-semibold uppercase ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all ${
                        isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-semibold uppercase ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
                  
                  {/* 🔗 Forgot Password Link */}
                  <Link href="/forgot-password" className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border rounded-xl pl-11 pr-11 py-3.5 outline-none transition-all ${
                        isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/10' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
                ) : (
                   <>Sign In <ArrowRight size={18} /></>
                )}
              </motion.button>
           </form>

           <div className={`mt-8 pt-6 border-t text-center ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
             <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
               Don&apos;t have an account?{' '}
               {/* 🔗 Create Account Link */}
               <Link href="/register" className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
                 Create Account
               </Link>
             </p>
           </div>
        </div>

      </motion.div>

      {/* Footer Links */}
      <div className={`absolute bottom-4 left-0 w-full text-center text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
      }`}>
         <Link href="/privacy" className="hover:text-blue-500 mx-2 transition-colors">Privacy</Link>
         <Link href="/terms" className="hover:text-blue-500 mx-2 transition-colors">Terms</Link>
      </div>

    </div>
  );
}