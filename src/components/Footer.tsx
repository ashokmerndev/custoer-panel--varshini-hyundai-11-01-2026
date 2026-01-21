// // src/components/Footer.tsx
// 'use client';

// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { usePathname } from 'next/navigation';
// import {
//   MapPin,
//   Phone,
//   Mail,
//   Facebook,
//   Twitter,
//   Instagram,
//   Linkedin,
//   Youtube,
//   Home,
//   Package,
//   ShoppingCart,
//   Heart,
//   Shield,
//   Truck,
// } from 'lucide-react';

// export const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const quickLinks = [
//     { name: 'Home', href: '/', icon: Home },
//     { name: 'Products', href: '/', icon: Package },
//     { name: 'Cart', href: '/cart', icon: ShoppingCart },
//     { name: 'Orders', href: '/orders', icon: Package },
//   ];

//   const categories = [
//     { name: 'Engine Parts', href: '/categories/Engine' },
//     { name: 'Brake System', href: '/categories/Brake' },
//     { name: 'Electrical', href: '/categories/Electrical' },
//     { name: 'Body Parts', href: '/categories/Body' },
//   ];

//   const policies = [
//     { name: 'About Us', href: '/about' },
//     { name: 'Privacy Policy', href: '/privacy' },
//     { name: 'Terms & Conditions', href: '/terms' },
//     { name: 'Return Policy', href: '/returns' },
//   ];

//   const socialLinks = [
//     { name: 'Facebook', icon: Facebook, href: '#', color: '#1877F2' },
//     { name: 'Twitter', icon: Twitter, href: '#', color: '#1DA1F2' },
//     { name: 'Instagram', icon: Instagram, href: '#', color: '#E4405F' },
//     { name: 'LinkedIn', icon: Linkedin, href: '#', color: '#0A66C2' },
//     { name: 'YouTube', icon: Youtube, href: '#', color: '#FF0000' },
//   ];

//   const features = [
//     {
//       icon: Shield,
//       title: 'Genuine Parts',
//       description: '100% Original',
//     },
//     {
//       icon: Truck,
//       title: 'Fast Delivery',
//       description: 'Free Shipping',
//     },
//     {
//       icon: Heart,
//       title: 'Quality Assured',
//       description: 'Warranty Included',
//     },
//   ];

//   const pathname = usePathname();
//   if (pathname === '/login' || pathname === '/register' ||  pathname === '/forgot-password' || pathname?.startsWith('/admin')) {
//     return null;
//   }

//   return (
//     <footer className="bg-gray-50 dark:bg-[#050B14] border-t border-gray-200 dark:border-white/10 mt-auto transition-colors duration-300">
//       {/* Features Bar */}
//       <div className="border-b border-gray-200 dark:border-white/10">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-100 dark:border-transparent"
//               >
//                 <div className="p-3 rounded-lg bg-blue-50 dark:bg-hyundai-blue/20">
//                   <feature.icon size={24} className="text-hyundai-blue" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//           >
//             <div className="flex items-center gap-2 mb-4">
//               <span className="text-3xl">VARSHINI</span>
//               <div>
//                 <h2 className="text-xl font-display font-bold text-hyundai-blue">
//                   HYUNDAI
//                 </h2>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Spares</p>
//               </div>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
//               Your trusted source for genuine Hyundai spare parts. Quality assured,
//               performance guaranteed.
//             </p>

//             {/* Contact Info */}
//             <div className="space-y-3">
//               <div className="flex items-start gap-3 text-sm">
//                 <MapPin size={16} className="text-hyundai-blue mt-1 flex-shrink-0" />
//                 <p className="text-gray-600 dark:text-gray-400">
//                   123 Auto Street, Hyderabad,
//                   <br />
//                   Hyderabad 400001, India
//                 </p>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <Phone size={16} className="text-hyundai-blue flex-shrink-0" />
//                 <a
//                   href="tel:+919876543210"
//                   className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue dark:hover:text-hyundai-blue transition-colors"
//                 >
//                   +91 8096936290
//                 </a>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <Mail size={16} className="text-hyundai-blue flex-shrink-0" />
//                 <a
//                   href="mailto:support@hyundaispares.com"
//                   className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue dark:hover:text-hyundai-blue transition-colors"
//                 >
//                   support@hyundaispares.com
//                 </a>
//               </div>
//             </div>
//           </motion.div>

//           {/* Quick Links */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//           >
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               {quickLinks.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     href={link.href}
//                     className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-hyundai-blue transition-colors text-sm group"
//                   >
//                     <link.icon
//                       size={16}
//                       className="group-hover:translate-x-1 transition-transform"
//                     />
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Categories */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3 }}
//           >
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
//             <ul className="space-y-2">
//               {categories.map((category) => (
//                 <li key={category.name}>
//                   <Link
//                     href={category.href}
//                     className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue transition-colors text-sm block hover:translate-x-1 transition-transform"
//                   >
//                     {category.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Policies & Social */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.4 }}
//           >
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information</h3>
//             <ul className="space-y-2 mb-6">
//               {policies.map((policy) => (
//                 <li key={policy.name}>
//                   <Link
//                     href={policy.href}
//                     className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue transition-colors text-sm block hover:translate-x-1 transition-transform"
//                   >
//                     {policy.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>

//             {/* Social Media */}
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
//             <div className="flex gap-3">
//               {socialLinks.map((social) => (
//                 <motion.a
//                   key={social.name}
//                   href={social.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   whileHover={{ scale: 1.1, y: -2 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-2 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors group"
//                   aria-label={social.name}
//                 >
//                   <social.icon
//                     size={20}
//                     className="text-gray-600 dark:text-gray-400 group-hover:text-hyundai-blue transition-colors"
//                   />
//                 </motion.a>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-gray-200 dark:border-white/10">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
//               © {currentYear} Hyundai Spares. All rights reserved.
//             </p>
//             <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
//               <Link href="/privacy" className="hover:text-hyundai-blue transition-colors">
//                 Privacy Policy
//               </Link>
//               <span className="text-gray-300 dark:text-white/20">•</span>
//               <Link href="/terms" className="hover:text-hyundai-blue transition-colors">
//                 Terms of Service
//               </Link>
//               <span className="text-gray-300 dark:text-white/20">•</span>
//               <Link href="/sitemap" className="hover:text-hyundai-blue transition-colors">
//                 Sitemap
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// src/components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Home,
  Package,
  ShoppingCart,
  Heart,
  Shield,
  Truck,
  ChevronDown,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Data Arrays
  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Orders", href: "/orders", icon: Package },
  ];

  const categories = [
    { name: "Engine Parts", href: "/categories/Engine" },
    { name: "Brake System", href: "/categories/Brake" },
    { name: "Electrical", href: "/categories/Electrical" },
    { name: "Body Parts", href: "/categories/Body" },
  ];

  const policies = [
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Return Policy", href: "/returns" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "#1877F2" },
    { name: "Twitter", icon: Twitter, href: "#", color: "#1DA1F2" },
    { name: "Instagram", icon: Instagram, href: "#", color: "#E4405F" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "#0A66C2" },
    { name: "YouTube", icon: Youtube, href: "#", color: "#FF0000" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Genuine Parts",
      description: "100% Original",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free Shipping",
    },
    {
      icon: Heart,
      title: "Quality Assured",
      description: "Warranty Included",
    },
  ];

  // Hide footer on specific pages
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="bg-white dark:bg-[#050B14] border-t border-gray-100 dark:border-white/5 mt-auto transition-colors duration-300">
      {/* 1. Features Bar (Compact on Mobile) */}
      <div className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-gray-100 dark:border-white/5 hover:border-blue-100 dark:hover:border-blue-500/20 transition-colors"
              >
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info (Always Visible) */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                VARSHINI
              </span>
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 dark:text-white tracking-wide">
                  HYUNDAI
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Spares
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Your trusted source for genuine Hyundai spare parts. Quality
              assured, performance guaranteed.
            </p>

            <div className="space-y-3 pt-2">
              <ContactItem
                icon={MapPin}
                text="123 Auto Street, Hyderabad, 500001"
              />
              <ContactItem
                icon={Phone}
                text="+91 8096936290"
                href="tel:+918096936290"
              />
              <ContactItem
                icon={Mail}
                text="support@hyundaispares.com"
                href="mailto:support@hyundaispares.com"
              />
            </div>
          </div>

          {/* Collapsible Sections for Mobile (Accordions) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 border-t border-gray-100 dark:border-white/5 md:border-none mt-6 md:mt-0">
            <FooterSection title="Quick Links">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection title="Categories">
              <ul className="space-y-3">
                {categories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection title="Information">
              <ul className="space-y-3">
                {policies.map((policy) => (
                  <li key={policy.name}>
                    <Link
                      href={policy.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                    >
                      {policy.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 md:border-none md:pt-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Follow Us
                </h4>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </FooterSection>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#02060D]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {currentYear} Varshini Hyundai Spares. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms
              </Link>
              <span>•</span>
              <Link
                href="/sitemap"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🛠️ Sub-Components

// 1. Mobile Accordion Section (Logic for Collapsing)
const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-white/5 md:border-none last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:mb-4 group"
      >
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          {title}
        </h3>
        {/* Chevron only visible on Mobile */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content: Collapsible on Mobile, Always Visible on Desktop */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:h-auto md:opacity-100 ${
          isOpen
            ? "max-h-96 opacity-100 mb-4"
            : "max-h-0 opacity-0 md:max-h-none md:mb-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// 2. Contact Item Helper
const ContactItem = ({
  icon: Icon,
  text,
  href,
}: {
  icon: any;
  text: string;
  href?: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon
      size={16}
      className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
    />
    {href ? (
      <a
        href={href}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {text}
      </a>
    ) : (
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    )}
  </div>
);
