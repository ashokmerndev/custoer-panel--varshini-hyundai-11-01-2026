// src/components/Footer.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/', icon: Package },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Orders', href: '/orders', icon: Package },
  ];

  const categories = [
    { name: 'Engine Parts', href: '/categories/Engine' },
    { name: 'Brake System', href: '/categories/Brake' },
    { name: 'Electrical', href: '/categories/Electrical' },
    { name: 'Body Parts', href: '/categories/Body' },
  ];

  const policies = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Return Policy', href: '/returns' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: '#1877F2' },
    { name: 'Twitter', icon: Twitter, href: '#', color: '#1DA1F2' },
    { name: 'Instagram', icon: Instagram, href: '#', color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: '#0A66C2' },
    { name: 'YouTube', icon: Youtube, href: '#', color: '#FF0000' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Genuine Parts',
      description: '100% Original',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free Shipping',
    },
    {
      icon: Heart,
      title: 'Quality Assured',
      description: 'Warranty Included',
    },
  ];

  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/register' ||  pathname === '/forgot-password' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-50 dark:bg-[#050B14] border-t border-gray-200 dark:border-white/10 mt-auto transition-colors duration-300">
      {/* Features Bar */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-gray-100 dark:border-transparent"
              >
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-hyundai-blue/20">
                  <feature.icon size={24} className="text-hyundai-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">VARSHINI</span>
              <div>
                <h2 className="text-xl font-display font-bold text-hyundai-blue">
                  HYUNDAI
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Spares</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Your trusted source for genuine Hyundai spare parts. Quality assured,
              performance guaranteed.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-hyundai-blue mt-1 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">
                  123 Auto Street, Hyderabad,
                  <br />
                  Hyderabad 400001, India
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-hyundai-blue flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue dark:hover:text-hyundai-blue transition-colors"
                >
                  +91 8096936290
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-hyundai-blue flex-shrink-0" />
                <a
                  href="mailto:support@hyundaispares.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue dark:hover:text-hyundai-blue transition-colors"
                >
                  support@hyundaispares.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-hyundai-blue transition-colors text-sm group"
                  >
                    <link.icon
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue transition-colors text-sm block hover:translate-x-1 transition-transform"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policies & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information</h3>
            <ul className="space-y-2 mb-6">
              {policies.map((policy) => (
                <li key={policy.name}>
                  <Link
                    href={policy.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-hyundai-blue transition-colors text-sm block hover:translate-x-1 transition-transform"
                  >
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon
                    size={20}
                    className="text-gray-600 dark:text-gray-400 group-hover:text-hyundai-blue transition-colors"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Hyundai Spares. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-hyundai-blue transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-white/20">•</span>
              <Link href="/terms" className="hover:text-hyundai-blue transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-300 dark:text-white/20">•</span>
              <Link href="/sitemap" className="hover:text-hyundai-blue transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};