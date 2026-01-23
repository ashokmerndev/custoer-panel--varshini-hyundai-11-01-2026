"use client";

import { MessageCircle, MessageSquareText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function SupportActionCards() {
  const router = useRouter();
  const pathname = usePathname();

  // WhatsApp Configuration
  const whatsappNumber = "918096936290";
  const preFilledMessage =
    "Hello Hyundai Spares Team, I would like to enquire about spare parts. Please assist me with the details.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      preFilledMessage,
    )}`;
    window.open(url, "_blank");
  };

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin") ||
    pathname === "/chat"
  ) {
    return null;
  }

  return (
    // 🔥 FIX: బయట 'section' Wrapper యాడ్ చేశాను.
    // దీనికి 'bg-white' ఇచ్చాను కాబట్టి, వెనుక బ్లాక్ కలర్ ఉన్నా ఇది వైట్ గానే కనిపిస్తుంది.
    // 'dark:bg-[#0f111a]' అనేది మీ Reviews సెక్షన్ డార్క్ మోడ్ కలర్ తో మ్యాచ్ అవుతుంది.
    <section className="w-full bg-white dark:bg-[#0f111a] py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* Optional Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Need Help?
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Choose how you want to connect with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: DIRECT ADMIN CHAT */}
          <div
            onClick={() => router.push("/chat")}
            className="group relative bg-white dark:bg-[#1a1d29] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Background Icon Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity dark:opacity-[0.03] dark:group-hover:opacity-[0.08]">
              <MessageSquareText className="w-32 h-32 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="relative z-10 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageSquareText className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  Live Chat Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  Talk directly with our admin for instant help regarding
                  genuine spares, compatibility check, and order tracking.
                </p>

                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  Start Conversation <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: WHATSAPP CHAT */}
          <div
            onClick={handleWhatsAppClick}
            className="group relative bg-white dark:bg-[#1a1d29] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Background Icon Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity dark:opacity-[0.03] dark:group-hover:opacity-[0.08]">
              <MessageCircle className="w-32 h-32 text-green-500 dark:text-green-400" />
            </div>

            <div className="relative z-10 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2">
                  Chat on WhatsApp
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  Prefer WhatsApp? Send us photos of your part, ask for pricing,
                  and get quick quotes directly on your phone.
                </p>

                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  Open WhatsApp <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
