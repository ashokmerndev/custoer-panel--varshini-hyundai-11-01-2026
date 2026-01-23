// "use client";

// import { useState, useEffect } from "react";
// import { createPortal } from "react-dom"; // 🔥 PORTAL IMPORT
// import { motion, AnimatePresence } from "framer-motion";
// import { Headset, X } from "lucide-react";
// import Cookies from "js-cookie";
// import ChatComponentPopup from "./ChatComponentPopup";

// export default function ChatFloatingButton() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   const [authData, setAuthData] = useState({
//     token: null,
//     userId: null,
//     adminId: "694673ed8eac361b130a1b5d",
//   });

//   useEffect(() => {
//     setMounted(true);
//     const token = Cookies.get("accessToken");
//     let userCookie = Cookies.get("user");

//     let userId = null;
//     if (userCookie) {
//       try {
//         const parsedUser = JSON.parse(userCookie);
//         userId = parsedUser._id || parsedUser.id || userCookie;
//       } catch (e) {
//         userId = userCookie;
//       }
//     }

//     if (token && userId) {
//       setAuthData((prev) => ({
//         ...prev,
//         token: token,
//         userId: userId,
//       }));
//     }
//   }, []);

//   if (!mounted || !authData.token) return null;

//   // 🔥 Portal Content: ఇది డైరెక్ట్ గా body టాగ్ లోకి వెళ్తుంది
//   const chatModalContent = (
//     <div className="fixed inset-0 z-[99999] flex items-end justify-end sm:items-center sm:justify-center pointer-events-none">
//       {/* 1. BACKDROP (BLUR) - స్క్రీన్ మొత్తం కవర్ చేస్తుంది */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={() => setIsOpen(false)}
//         className="fixed inset-0 pointer-events-auto"
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.4)", // నలుపు రంగు ట్రాన్స్‌పరెన్సీ
//           backdropFilter: "blur(4px)", // బ్లర్ ఎఫెక్ట్
//           WebkitBackdropFilter: "blur(4px)",
//         }}
//       />

//       {/* 2. CHAT WINDOW */}
//       <motion.div
//         initial={{ opacity: 0, y: 50, scale: 0.9 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: 50, scale: 0.9 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         className="pointer-events-auto fixed bottom-6 right-6 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col z-[100000]"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 p-4 flex justify-between items-center shrink-0 shadow-lg">
//           <div className="flex items-center gap-3 group relative z-50">
//             {/* VARSHINI LOGO - White Gradient for pop */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 drop-shadow-sm"
//             >
//               VARSHINI
//             </motion.div>

//             {/* Separator Line */}
//             <div className="h-8 w-[1px] bg-white/20 mx-1" />

//             {/* HYUNDAI SPARES TEXT */}
//             <div className="flex flex-col justify-center">
//               <span className="text-[10px] sm:text-xs font-bold text-white leading-none tracking-wide mb-0.5">
//                 HYUNDAI
//               </span>
//               <span className="text-[8px] uppercase tracking-[0.25em] text-blue-100 font-medium">
//                 Spares
//               </span>
//             </div>
//           </div>

//           {/* CLOSE BUTTON */}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 overflow-hidden bg-gray-50 relative">
//           <ChatComponentPopup
//             currentUserId={authData.userId}
//             otherUserId={authData.adminId}
//             otherUserModel="Admin"
//             otherUserName="Support Team"
//             token={authData.token}
//             apiUrl={
//               process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
//             }
//             isDarkMode={false}
//             toggleTheme={() => {}}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );

//   return (
//     <>
//       {/* 🔥 Render Modal inside Body using Portal */}
//       {isOpen && createPortal(chatModalContent, document.body)}

//       {/* --- FLOATING BUTTON (ఉన్న చోటే ఉంటుంది) --- */}
//       <div className="fixed bottom-14 right-6 z-[9990] flex flex-col items-end gap-2">
//         {isHovered && !isOpen && (
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 20 }}
//             className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl text-sm font-medium border border-gray-100 mr-2 whitespace-nowrap"
//           >
//             Chat with Support 👋
//           </motion.div>
//         )}

//         <div
//           className="relative group"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {!isOpen && (
//             <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping duration-1000"></span>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsOpen(!isOpen)}
//             className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md transition-all duration-300 ${
//               isOpen
//                 ? "bg-gray-800 text-white rotate-0 border-gray-600"
//                 : "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white"
//             }`}
//           >
//             <motion.div
//               key={isOpen ? "close" : "open"}
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               transition={{ duration: 0.2 }}
//             >
//               {isOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Headset className="w-7 h-7" />
//               )}
//             </motion.div>

//             {!isOpen && (
//               <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
//             )}
//           </motion.button>
//         </div>
//       </div>
//     </>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Headset, X, Sun, Moon } from "lucide-react"; // 🔥 Sun, Moon icons import చేయాలి
// import Cookies from "js-cookie";
// import ChatComponentPopup from "./ChatComponentPopup";

// export default function ChatFloatingButton() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // 🔥 1. Theme State ని యాడ్ చేశాను
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const [authData, setAuthData] = useState({
//     token: null,
//     userId: null,
//     adminId: "694673ed8eac361b130a1b5d",
//   });

//   useEffect(() => {
//     setMounted(true);

//     // 🔥 2. Load Theme from LocalStorage
//     const savedTheme = localStorage.getItem("chat_theme");
//     if (savedTheme === "dark") {
//       setIsDarkMode(true);
//     }

//     // Auth Logic
//     const token = Cookies.get("accessToken");
//     let userCookie = Cookies.get("user");
//     let userId = null;
//     if (userCookie) {
//       try {
//         const parsedUser = JSON.parse(userCookie);
//         userId = parsedUser._id || parsedUser.id || userCookie;
//       } catch (e) {
//         userId = userCookie;
//       }
//     }

//     if (token && userId) {
//       setAuthData((prev) => ({
//         ...prev,
//         token: token,
//         userId: userId,
//       }));
//     }
//   }, []);

//   // 🔥 3. Theme Toggle Function
//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
//   };

//   if (!mounted || !authData.token) return null;

//   const chatModalContent = (
//     <div className="fixed inset-0 z-[99999] flex items-end justify-end sm:items-center sm:justify-center pointer-events-none">
//       {/* BACKDROP */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={() => setIsOpen(false)}
//         className="fixed inset-0 pointer-events-auto"
//         style={{
//           backgroundColor: "rgba(0, 0, 0, 0.4)",
//           backdropFilter: "blur(4px)",
//           WebkitBackdropFilter: "blur(4px)",
//         }}
//       />

//       {/* CHAT WINDOW */}
//       <motion.div
//         initial={{ opacity: 0, y: 50, scale: 0.9 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: 50, scale: 0.9 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         className="pointer-events-auto fixed bottom-6 right-6 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col z-[100000]"
//       >
//         {/* Header with Theme Toggle */}
//         <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 p-4 flex justify-between items-center shrink-0 shadow-lg">
//           <div className="flex items-center gap-3 group relative z-50">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 drop-shadow-sm"
//             >
//               VARSHINI
//             </motion.div>
//             <div className="h-8 w-[1px] bg-white/20 mx-1" />
//             <div className="flex flex-col justify-center">
//               <span className="text-[10px] sm:text-xs font-bold text-white leading-none tracking-wide mb-0.5">
//                 HYUNDAI
//               </span>
//               <span className="text-[8px] uppercase tracking-[0.25em] text-blue-100 font-medium">
//                 Spares
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* 🔥 4. Theme Toggle Button Added Here */}
//             <button
//               onClick={toggleTheme}
//               className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
//             >
//               {isDarkMode ? (
//                 <Sun className="w-5 h-5" />
//               ) : (
//                 <Moon className="w-5 h-5" />
//               )}
//             </button>

//             {/* Close Button */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div
//           className={`flex-1 overflow-hidden relative ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
//         >
//           <ChatComponentPopup
//             currentUserId={authData.userId}
//             otherUserId={authData.adminId}
//             otherUserModel="Admin"
//             otherUserName="Support Team"
//             token={authData.token}
//             apiUrl={
//               process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
//             }
//             // 🔥 5. Passing Dynamic State instead of false
//             isDarkMode={isDarkMode}
//             toggleTheme={toggleTheme}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );

//   return (
//     <>
//       {isOpen && createPortal(chatModalContent, document.body)}

//       <div className="fixed bottom-14 right-6 z-[9990] flex flex-col items-end gap-2">
//         {isHovered && !isOpen && (
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 20 }}
//             className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl text-sm font-medium border border-gray-100 mr-2 whitespace-nowrap"
//           >
//             Chat with Support 👋
//           </motion.div>
//         )}

//         <div
//           className="relative group"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           {!isOpen && (
//             <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping duration-1000"></span>
//           )}

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsOpen(!isOpen)}
//             className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md transition-all duration-300 ${
//               isOpen
//                 ? "bg-gray-800 text-white rotate-0 border-gray-600"
//                 : "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white"
//             }`}
//           >
//             <motion.div
//               key={isOpen ? "close" : "open"}
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               transition={{ duration: 0.2 }}
//             >
//               {isOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Headset className="w-7 h-7" />
//               )}
//             </motion.div>

//             {!isOpen && (
//               <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
//             )}
//           </motion.button>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, X, Sun, Moon } from "lucide-react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation"; // 🔥 1. IMPORT PATHNAME
import ChatComponentPopup from "./ChatComponentPopup";

export default function ChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔥 2. Theme State Add Cheyali
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔥 3. Pathname Hook
  const pathname = usePathname();

  const [authData, setAuthData] = useState({
    token: null,
    userId: null,
    adminId: "694673ed8eac361b130a1b5d",
  });

  // 🔥 4. Check Auth on Mount AND on Path Change
  const checkAuth = () => {
    const token = Cookies.get("accessToken");
    let userCookie = Cookies.get("user");

    let userId = null;
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        userId = parsedUser._id || parsedUser.id || userCookie;
      } catch (e) {
        userId = userCookie;
      }
    }

    if (token && userId) {
      setAuthData((prev) => ({
        ...prev,
        token: token,
        userId: userId,
      }));
    } else {
      // లాగౌట్ అయితే డేటా క్లియర్ చేయడానికి
      setAuthData((prev) => ({ ...prev, token: null, userId: null }));
    }
  };

  useEffect(() => {
    setMounted(true);

    // Load Theme
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme === "dark") setIsDarkMode(true);

    // Initial Auth Check
    checkAuth();

    // Listen for custom login events (Optional but safer)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // 🔥 5. పేజీ మారిన ప్రతిసారీ (Login -> Home) ఇది రన్ అవుతుంది
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Theme Toggle Function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
  };

  if (!mounted || !authData.token) return null;

  const chatModalContent = (
    <div className="fixed inset-0 z-[99999] flex items-end justify-end sm:items-center sm:justify-center pointer-events-none">
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 pointer-events-auto"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* CHAT WINDOW */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="pointer-events-auto fixed bottom-6 right-6 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col z-[100000]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 p-4 flex justify-between items-center shrink-0 shadow-lg">
          <div className="flex items-center gap-3 group relative z-50">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 drop-shadow-sm"
            >
              VARSHINI
            </motion.div>
            <div className="h-8 w-[1px] bg-white/20 mx-1" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-bold text-white leading-none tracking-wide mb-0.5">
                HYUNDAI
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-blue-100 font-medium">
                Spares
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 overflow-hidden relative ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
        >
          <ChatComponentPopup
            currentUserId={authData.userId}
            otherUserId={authData.adminId}
            otherUserModel="Admin"
            otherUserName="Support Team"
            token={authData.token}
            apiUrl={
              process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
            }
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      {isOpen && createPortal(chatModalContent, document.body)}

      <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-2">
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl text-sm font-medium border border-gray-100 mr-2 whitespace-nowrap"
          >
            Chat with Support 👋
          </motion.div>
        )}

        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isOpen && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping duration-1000"></span>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md transition-all duration-300 ${
              isOpen
                ? "bg-gray-800 text-white rotate-0 border-gray-600"
                : "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white"
            }`}
          >
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Headset className="w-7 h-7" />
              )}
            </motion.div>

            {!isOpen && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
