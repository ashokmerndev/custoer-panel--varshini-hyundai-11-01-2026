// "use client";

// import { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";
// import {
//   Send,
//   Paperclip,
//   X,
//   Image as ImageIcon,
//   Video,
//   MoreVertical,
//   Phone,
//   ArrowLeft,
//   Loader2,
//   Smile,
//   Check,
//   CheckCheck,
//   Copy,
//   Reply,
//   Trash2,
//   Moon,
//   Sun,
//   Volume2,
//   VolumeX,
//   MessageSquareDashed,
//   Home,
//   Mic,
//   StopCircle,
// } from "lucide-react";

// // --- SOUND ASSETS ---
// const SEND_SOUND_URL = "/sounds/message-send.mp3";
// const RECEIVE_SOUND_URL = "/sounds/message-receive.mp3";

// export default function ChatComponent({
//   currentUserId,
//   otherUserId,
//   otherUserModel = "Admin",
//   token,
//   apiUrl = "http://localhost:5000",
// }) {
//   // --- STATE ---
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [otherUserTyping, setOtherUserTyping] = useState(false);
//   const [onlineStatus, setOnlineStatus] = useState("offline");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // Voice Recording State
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);

//   const [otherUserInfo, setOtherUserInfo] = useState({
//     name: otherUserModel,
//     profilePicture: null,
//   });

//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isSoundEnabled, setIsSoundEnabled] = useState(false);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true);

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const audioSendRef = useRef(null);
//   const audioReceiveRef = useRef(null);

//   // Room ID Logic: Same as backend (sorted join)
//   const roomId = [currentUserId, otherUserId].sort().join("_");

//   // --- THEME & SOUND ---
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("chat_theme");
//     if (savedTheme) {
//       setIsDarkMode(savedTheme === "dark");
//     }
//     // Initialize Audio
//     if (typeof window !== "undefined") {
//       audioSendRef.current = new Audio(SEND_SOUND_URL);
//       audioReceiveRef.current = new Audio(RECEIVE_SOUND_URL);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
//   };

//   const playSound = (type) => {
//     if (!isSoundEnabled) return;
//     try {
//       if (type === "send" && audioSendRef.current) {
//         audioSendRef.current.currentTime = 0;
//         audioSendRef.current.play().catch(() => {});
//       } else if (type === "receive" && audioReceiveRef.current) {
//         audioReceiveRef.current.currentTime = 0;
//         audioReceiveRef.current.play().catch(() => {});
//       }
//     } catch (e) {}
//   };

//   // --- AUTO SCROLL TO BOTTOM ---
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, otherUserTyping, selectedFile]);

//   // --- SOCKET CONNECTION & EVENTS ---
//   useEffect(() => {
//     if (!token || !currentUserId || !otherUserId) return;

//     // Remove /api if present for socket connection
//     const socketUrl = apiUrl.replace("/api", "");

//     const newSocket = io(socketUrl, {
//       auth: { token },
//       withCredentials: true,
//       transports: ["websocket", "polling"], // Ensure websocket is tried
//     });

//     setSocket(newSocket);

//     // 1. Connect & Join
//     newSocket.on("connect", () => {
//       // console.log("Connected to socket");
//       newSocket.emit("join_room", { roomId });
//       fetchChatHistory();
//     });

//     // 2. Online Status (Matches Backend 'user_status_update')
//     newSocket.on("user_status_update", (data) => {
//       // Check if the update is for the user we are chatting with
//       if (data.userId === otherUserId) {
//         setOnlineStatus(data.isOnline ? "online" : "offline");
//       }
//     });

//     // 3. Receive Message (Matches Backend 'receive_message')
//     newSocket.on("receive_message", (message) => {
//       // Ensure message belongs to current room
//       if (message.roomId === roomId) {
//         setMessages((prev) => {
//           // Avoid duplicates based on _id
//           if (prev.some((m) => m._id === message._id)) return prev;

//           const senderId = message.senderId?._id || message.senderId;

//           // Play sound if message is from other user
//           if (senderId !== currentUserId) {
//             playSound("receive");
//             // Mark read immediately if we receive it live
//             newSocket.emit("mark_read", { roomId, userId: otherUserId });
//           }
//           return [...prev, message];
//         });
//       }
//     });

//     // 4. Typing Indicators (Matches Backend 'display_typing' / 'hide_typing')
//     newSocket.on("display_typing", (data) => {
//       if (data.userId === otherUserId && data.roomId === roomId) {
//         setOtherUserTyping(true);
//       }
//     });

//     newSocket.on("hide_typing", (data) => {
//       if (data.userId === otherUserId && data.roomId === roomId) {
//         setOtherUserTyping(false);
//       }
//     });

//     // 5. Message Read Status (Matches Backend 'messages_marked_read')
//     newSocket.on("messages_marked_read", (data) => {
//       if (data.roomId === roomId) {
//         setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
//       }
//     });

//     return () => {
//       newSocket.emit("leave_room", { roomId });
//       newSocket.disconnect();
//     };
//   }, [currentUserId, otherUserId, token, roomId, apiUrl]);

//   // --- API CALLS ---
//   const fetchChatHistory = async () => {
//     setIsLoadingHistory(true);
//     try {
//       const res = await axios.get(`${apiUrl}/api/chat/history/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) {
//         let historyData = res.data.data?.messages || [];

//         // Ensure chronological order (Oldest first -> Newest last)
//         // Backend usually sends Newest first, so we reverse it or sort
//         historyData.sort(
//           (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//         );

//         setMessages(historyData);
//       }
//     } catch (error) {
//       console.error("Failed to fetch history", error);
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };

//   const uploadFile = async (fileToUpload) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", fileToUpload);

//     try {
//       const res = await axios.post(`${apiUrl}/api/chat/upload`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success) {
//         return res.data.data; // { fileUrl, fileType, fileName, fileSize }
//       }
//     } catch (error) {
//       alert("File upload failed.");
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   // --- ACTIONS ---

//   const sendMessage = async (fileData = null) => {
//     // If text is empty and no file, return
//     if (!fileData && !inputText.trim()) return;

//     // Use fileType from upload response, or default to text
//     const msgType = fileData ? fileData.fileType : "text";

//     const messagePayload = {
//       roomId,
//       receiverId: otherUserId,
//       receiverModel: otherUserModel,
//       text: inputText || "",
//       messageType: msgType,
//       fileUrl: fileData ? fileData.fileUrl : null,
//       fileName: fileData ? fileData.fileName : null,
//       fileSize: fileData ? fileData.fileSize : null,
//       tempId: Date.now(),
//     };

//     // Emit to socket
//     socket?.emit("send_message", messagePayload);

//     // Play sound
//     playSound("send");

//     // Reset inputs
//     setInputText("");
//     setSelectedFile(null);
//     socket?.emit("stop_typing", { roomId });
//   };

//   const handleFileSend = async () => {
//     if (!selectedFile) return;

//     // 1. Upload File
//     const fileData = await uploadFile(selectedFile);

//     // 2. Send Message with File Data
//     if (fileData) {
//       // Manual override: if browser detected audio but backend said file/video
//       if (selectedFile.type.startsWith("audio/")) {
//         fileData.fileType = "audio";
//       }
//       await sendMessage(fileData);
//     }
//   };

//   // --- TYPING ---
//   const handleTyping = () => {
//     socket?.emit("typing", { roomId });
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       socket?.emit("stop_typing", { roomId });
//     }, 2000);
//   };

//   // --- VOICE RECORDING ---
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       let chunks = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunks.push(e.data);
//       };

//       recorder.onstop = async () => {
//         // Create audio file from blobs
//         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//         const audioFile = new File([audioBlob], "voice_note.webm", {
//           type: "audio/webm",
//         });

//         // Directly upload and send
//         const fileData = await uploadFile(audioFile);
//         if (fileData) {
//           fileData.fileType = "audio"; // Explicitly set type to audio
//           sendMessage(fileData);
//         }
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//     } catch (err) {
//       console.error("Microphone access error:", err);
//       alert("Microphone access denied or not available.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && isRecording) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//       setMediaRecorder(null);
//     }
//   };

//   // --- HELPERS ---
//   const isMessageFromMe = (msg) => {
//     const senderId = msg.senderId?._id || msg.senderId;
//     return senderId === currentUserId;
//   };

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // --- RENDERING ---
//   const renderDateSeparator = (currentMsg, prevMsg) => {
//     const currentDate = new Date(
//       currentMsg.createdAt || Date.now(),
//     ).toDateString();
//     const prevDate = prevMsg
//       ? new Date(prevMsg.createdAt || Date.now()).toDateString()
//       : null;

//     if (currentDate !== prevDate) {
//       let label = currentDate;
//       const today = new Date().toDateString();
//       const yesterday = new Date(Date.now() - 86400000).toDateString();
//       if (currentDate === today) label = "Today";
//       else if (currentDate === yesterday) label = "Yesterday";

//       return (
//         <div className="flex justify-center my-6 opacity-70">
//           <span
//             className={`text-xs px-3 py-1 rounded-full border ${isDarkMode ? "bg-slate-800/50 text-slate-400 border-slate-700" : "bg-gray-100 text-gray-500 border-gray-200"}`}
//           >
//             {label}
//           </span>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div
//       className={`flex flex-col items-center justify-center w-full h-[100dvh] md:h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-slate-900"}`}
//     >
//       {/* HEADER, BACKGROUND & NAV */}
//       <div className="hidden md:flex absolute top-0 left-0 w-full p-6 justify-between items-center z-50 pointer-events-none">
//         <Link
//           href="/"
//           className="flex items-center gap-3 group pointer-events-auto"
//         >
//           <div
//             className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${isDarkMode ? "bg-blue-600 shadow-blue-500/20" : "bg-blue-600 shadow-blue-500/30"}`}
//           >
//             <span className="font-bold text-xl">V</span>
//           </div>
//           <div className="hidden md:block">
//             <span
//               className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
//             >
//               VARSHINI
//             </span>
//             <span className="text-blue-500 font-bold ml-1.5">HYUNDAI</span>
//           </div>
//         </Link>
//         <div className="flex items-center gap-3 pointer-events-auto">
//           <button
//             onClick={toggleTheme}
//             className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${isDarkMode ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" : "bg-white/80 border-gray-200 text-gray-600 hover:bg-white shadow-sm"}`}
//           >
//             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//           </button>
//           <Link href="/">
//             <button
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all backdrop-blur-md ${isDarkMode ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white" : "bg-white/80 border-gray-200 text-gray-600 hover:bg-white hover:text-blue-600 shadow-sm"}`}
//             >
//               <Home size={16} />{" "}
//               <span className="hidden sm:inline">Back to Home</span>
//             </button>
//           </Link>
//         </div>
//       </div>

//       <div
//         className={`fixed inset-0 -z-10 ${isDarkMode ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b141a] to-black" : "bg-gradient-to-br from-blue-50 to-indigo-50"}`}
//       />

//       {/* Main Chat Container */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className={`flex flex-col w-full flex-1 md:flex-none md:h-[92vh] md:max-w-[900px] relative md:rounded-3xl md:shadow-2xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? "bg-slate-900/60 backdrop-blur-2xl border-white/10" : "bg-white/80 backdrop-blur-xl border-white/40 shadow-blue-200/20"}`}
//       >
//         {/* --- CHAT HEADER --- */}
//         <div
//           className={`h-16 md:h-18 px-4 md:px-6 py-2 flex items-center justify-between border-b z-20 transition-colors ${isDarkMode ? "border-white/5 bg-slate-900/50" : "border-gray-200/50 bg-white/60"}`}
//         >
//           <div className="flex items-center gap-3">
//             <Link href="/" className="md:hidden">
//               <button
//                 className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/5 text-slate-600"}`}
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//             </Link>
//             <div className="relative">
//               <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden p-[2px] bg-gradient-to-br from-sky-400 to-blue-600">
//                 <div
//                   className={`w-full h-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
//                 >
//                   {otherUserInfo.profilePicture ? (
//                     <img
//                       src={otherUserInfo.profilePicture}
//                       alt=""
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div
//                       className={`w-full h-full flex items-center justify-center font-bold text-lg ${isDarkMode ? "text-white" : "text-blue-600"}`}
//                     >
//                       {otherUserInfo.name.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* ONLINE INDICATOR */}
//               {onlineStatus === "online" && (
//                 <span
//                   className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 rounded-full animate-pulse ${isDarkMode ? "border-slate-900 shadow-emerald-500/20" : "border-white shadow-emerald-500/20"}`}
//                 ></span>
//               )}
//             </div>
//             <div className="flex flex-col justify-center">
//               <h1
//                 className={`text-sm md:text-base font-bold tracking-tight truncate max-w-[150px] md:max-w-none ${isDarkMode ? "text-white" : "text-slate-900"}`}
//               >
//                 Support Executive
//               </h1>
//               <p
//                 className={`text-[10px] md:text-xs font-medium flex items-center gap-1.5 ${onlineStatus === "online" ? "text-emerald-500" : "text-slate-400"}`}
//               >
//                 {otherUserTyping
//                   ? "Typing..."
//                   : onlineStatus === "online"
//                     ? "Online"
//                     : "Offline"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setIsSoundEnabled(!isSoundEnabled)}
//               className={`p-2 rounded-full transition-all duration-200 ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-black/5 text-slate-500"}`}
//             >
//               {isSoundEnabled ? (
//                 <Volume2 className="w-5 h-5" />
//               ) : (
//                 <VolumeX className="w-5 h-5 opacity-50" />
//               )}
//             </button>
//             <div
//               className={`w-px h-6 mx-1 ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`}
//             ></div>
//             <button
//               className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/5 text-slate-600"}`}
//             >
//               <MoreVertical className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* --- MESSAGES AREA --- */}
//         <div
//           className={`flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scrollbar-thin ${isDarkMode ? "scrollbar-thumb-white/10 scrollbar-track-transparent" : "scrollbar-thumb-gray-200 scrollbar-track-transparent"}`}
//           style={{
//             backgroundImage: isDarkMode
//               ? "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)"
//               : "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
//             backgroundSize: "24px 24px",
//           }}
//         >
//           {isLoadingHistory && (
//             <div className="space-y-4 py-4">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`h-12 w-48 rounded-2xl animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-gray-200"}`}
//                   ></div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {!isLoadingHistory && messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-full opacity-60">
//               <div
//                 className={`p-4 rounded-full mb-4 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
//               >
//                 <MessageSquareDashed
//                   className={`w-12 h-12 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
//                 />
//               </div>
//               <p
//                 className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
//               >
//                 No messages yet. Start the conversation!
//               </p>
//             </div>
//           )}

//           {Array.isArray(messages) &&
//             messages.map((msg, index) => {
//               const isMe = isMessageFromMe(msg);
//               const prevMsg = messages[index - 1];
//               return (
//                 <div key={msg._id || index}>
//                   {renderDateSeparator(msg, prevMsg)}
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     transition={{ duration: 0.2 }}
//                     className={`group flex w-full ${isMe ? "justify-end" : "justify-start"}`}
//                   >
//                     <div className={`flex flex-col max-w-[85%] md:max-w-[65%]`}>
//                       <div
//                         className={`relative px-4 py-2.5 shadow-sm ${isMe ? "bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white rounded-[20px] rounded-tr-[4px]" : isDarkMode ? "bg-slate-800/80 backdrop-blur-md text-slate-100 border border-white/5 rounded-[20px] rounded-tl-[4px]" : "bg-white text-slate-800 border border-gray-100 shadow-sm rounded-[20px] rounded-tl-[4px]"}`}
//                       >
//                         {/* MEDIA DISPLAY */}
//                         {(msg.messageType === "image" ||
//                           msg.messageType === "video") &&
//                           msg.fileUrl && (
//                             <div className="mb-2 rounded-xl overflow-hidden bg-black/10 border border-black/5">
//                               {msg.messageType === "image" ? (
//                                 <img
//                                   src={msg.fileUrl}
//                                   alt="Media"
//                                   className="w-full max-h-[300px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
//                                   onClick={() =>
//                                     window.open(msg.fileUrl, "_blank")
//                                   }
//                                 />
//                               ) : (
//                                 <video
//                                   src={msg.fileUrl}
//                                   controls
//                                   className="w-full max-h-[300px]"
//                                 />
//                               )}
//                             </div>
//                           )}

//                         {/* AUDIO DISPLAY */}
//                         {msg.messageType === "audio" && msg.fileUrl && (
//                           <div className="mb-2 min-w-[200px] flex items-center gap-2">
//                             <audio
//                               controls
//                               src={msg.fileUrl}
//                               className="w-full h-8"
//                             />
//                           </div>
//                         )}

//                         {msg.text && (
//                           <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
//                             {msg.text}
//                           </p>
//                         )}

//                         <div
//                           className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-blue-100" : isDarkMode ? "text-slate-400" : "text-gray-400"}`}
//                         >
//                           <span className="text-[10px] font-medium opacity-80">
//                             {formatTime(msg.createdAt || Date.now())}
//                           </span>
//                           {isMe && (
//                             <span className="ml-0.5">
//                               {msg.isRead ? (
//                                 <CheckCheck className="w-3.5 h-3.5 text-white/90" />
//                               ) : msg.isDelivered ? (
//                                 <CheckCheck className="w-3.5 h-3.5 opacity-60" />
//                               ) : (
//                                 <Check className="w-3.5 h-3.5 opacity-60" />
//                               )}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>
//               );
//             })}

//           <AnimatePresence>
//             {otherUserTyping && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="flex justify-start mb-4"
//               >
//                 <div
//                   className={`px-4 py-3 rounded-[20px] rounded-tl-[4px] shadow-sm flex items-center gap-1.5 ${isDarkMode ? "bg-slate-800/80 backdrop-blur-md border border-white/5" : "bg-white border border-gray-100"}`}
//                 >
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${isDarkMode ? "bg-slate-400" : "bg-gray-400"}`}
//                   ></span>
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${isDarkMode ? "bg-slate-400" : "bg-gray-400"}`}
//                   ></span>
//                   <span
//                     className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? "bg-slate-400" : "bg-gray-400"}`}
//                   ></span>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <div ref={messagesEndRef} className="h-4" />
//         </div>

//         {/* --- FLOATING FILE PREVIEW --- */}
//         <AnimatePresence>
//           {selectedFile && (
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 20, opacity: 0 }}
//               className="absolute bottom-20 md:bottom-24 left-4 right-4 md:left-6 md:right-6 z-30"
//             >
//               <div
//                 className={`p-3 rounded-2xl shadow-2xl flex items-center gap-4 border ${isDarkMode ? "bg-slate-800/90 backdrop-blur-xl border-white/10" : "bg-white/95 backdrop-blur-xl border-gray-200"}`}
//               >
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/10">
//                   {selectedFile.type.startsWith("image/") ? (
//                     <ImageIcon className="text-indigo-500 w-6 h-6" />
//                   ) : (
//                     <Video className="text-pink-500 w-6 h-6" />
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p
//                     className={`text-sm font-semibold truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}
//                   >
//                     {selectedFile.name}
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedFile(null)}
//                   className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-gray-100 text-slate-500 hover:text-slate-900"}`}
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* --- INPUT BAR --- */}
//         <div className="p-3 md:p-6 bg-transparent z-20">
//           <div
//             className={`flex items-end gap-2 p-2 rounded-[28px] shadow-xl border relative transition-colors duration-300 ${isDarkMode ? "bg-slate-800/60 backdrop-blur-xl border-white/10 shadow-black/20" : "bg-white/80 backdrop-blur-xl border-white/60 shadow-blue-500/5"}`}
//           >
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={(e) =>
//                 e.target.files &&
//                 e.target.files[0] &&
//                 setSelectedFile(e.target.files[0])
//               }
//               accept="image/*,video/*"
//               className="hidden"
//             />

//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className={`p-3 rounded-full transition-all duration-200 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800 hover:bg-gray-100"}`}
//             >
//               <Paperclip className="w-5 h-5" />
//             </button>

//             <div className="flex-1 py-2">
//               <input
//                 type="text"
//                 value={inputText}
//                 onChange={(e) => {
//                   setInputText(e.target.value);
//                   handleTyping();
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 placeholder={
//                   isRecording ? "Recording audio..." : "Type a message..."
//                 }
//                 className={`w-full bg-transparent border-none outline-none text-[15px] resize-none max-h-32 placeholder-shown:font-normal font-medium ${isDarkMode ? "text-slate-100 placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"} ${isRecording ? "text-red-500 placeholder:text-red-500" : ""}`}
//                 disabled={uploading || isRecording}
//                 autoComplete="off"
//               />
//             </div>

//             {/* RECORDING / SEND BUTTON */}
//             {inputText.trim() || selectedFile ? (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() =>
//                   selectedFile ? handleFileSend() : sendMessage()
//                 }
//                 disabled={uploading}
//                 className={`p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${uploading ? (isDarkMode ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed") : "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-blue-500/30"}`}
//               >
//                 {uploading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <Send className="w-5 h-5 ml-0.5" />
//                 )}
//               </motion.button>
//             ) : (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${isRecording ? "bg-red-500 text-white shadow-red-500/30 animate-pulse" : isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800 hover:bg-gray-100"}`}
//               >
//                 {isRecording ? (
//                   <StopCircle className="w-5 h-5" />
//                 ) : (
//                   <Mic className="w-5 h-5" />
//                 )}
//               </motion.button>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Send,
  Paperclip,
  X,
  Image as ImageIcon,
  Video,
  MoreVertical,
  Phone,
  ArrowLeft,
  Loader2,
  Smile,
  Check,
  CheckCheck,
  Copy,
  Reply,
  Trash2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  MessageSquareDashed,
  Home,
  Mic,
  StopCircle,
} from "lucide-react";

// --- SOUND ASSETS ---
const SEND_SOUND_URL = "/sounds/message-send.mp3";
const RECEIVE_SOUND_URL = "/sounds/message-receive.mp3";

export default function ChatComponent({
  currentUserId,
  otherUserId,
  otherUserModel = "Admin",
  token,
  apiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
}) {
  // --- STATE ---
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [otherUserInfo, setOtherUserInfo] = useState({
    name: otherUserModel,
    profilePicture: null,
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioSendRef = useRef(null);
  const audioReceiveRef = useRef(null);

  // Room ID Logic: Same as backend (sorted join)
  const roomId = [currentUserId, otherUserId].sort().join("_");

  // --- THEME & SOUND ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    // Initialize Audio
    if (typeof window !== "undefined") {
      audioSendRef.current = new Audio(SEND_SOUND_URL);
      audioReceiveRef.current = new Audio(RECEIVE_SOUND_URL);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
  };

  const playSound = (type) => {
    if (!isSoundEnabled) return;
    try {
      if (type === "send" && audioSendRef.current) {
        audioSendRef.current.currentTime = 0;
        audioSendRef.current.play().catch(() => {});
      } else if (type === "receive" && audioReceiveRef.current) {
        audioReceiveRef.current.currentTime = 0;
        audioReceiveRef.current.play().catch(() => {});
      }
    } catch (e) {}
  };

  // --- AUTO SCROLL TO BOTTOM ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping, selectedFile]);

  // --- SOCKET CONNECTION & EVENTS ---
  useEffect(() => {
    if (!token || !currentUserId || !otherUserId) return;

    // Remove /api if present for socket connection
    const socketUrl = apiUrl.replace("/api", "");

    const newSocket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    // 1. Connect & Join
    newSocket.on("connect", () => {
      // console.log("Connected to socket");
      newSocket.emit("join_room", { roomId });
      fetchChatHistory();
    });

    // 2. Online Status (Matches Backend 'user_status_update')
    newSocket.on("user_status_update", (data) => {
      // Check if the update is for the user we are chatting with
      if (data.userId === otherUserId) {
        setOnlineStatus(data.isOnline ? "online" : "offline");
      }
    });

    // 3. Receive Message (Matches Backend 'receive_message')
    newSocket.on("receive_message", (message) => {
      // Ensure message belongs to current room
      if (message.roomId === roomId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === message._id)) return prev;

          const senderId = message.senderId?._id || message.senderId;

          // Play sound if message is from other user
          if (senderId !== currentUserId) {
            playSound("receive");
            // Mark read immediately if we receive it live
            newSocket.emit("mark_read", { messageId: message._id, roomId });
          }
          return [...prev, message];
        });
      }
    });

    // 4. Typing Indicators (Matches Backend 'display_typing')
    newSocket.on("display_typing", (data) => {
      if (data.userId === otherUserId && data.roomId === roomId) {
        setOtherUserTyping(true);
      }
    });

    newSocket.on("hide_typing", (data) => {
      if (data.userId === otherUserId && data.roomId === roomId) {
        setOtherUserTyping(false);
      }
    });

    // 5. Message Read Status
    newSocket.on("message_read", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, isRead: true } : msg,
          ),
        );
      }
    });

    newSocket.on("message_delivered", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, isDelivered: true } : msg,
          ),
        );
      }
    });

    return () => {
      newSocket.off("receive_message");
      newSocket.off("display_typing");
      newSocket.off("hide_typing");
      newSocket.off("user_status_update");
      newSocket.off("message_read");
      newSocket.off("message_delivered");
      newSocket.emit("leave_room", { roomId });
      newSocket.disconnect();
    };
  }, [currentUserId, otherUserId, token, roomId, apiUrl]);

  // --- API CALLS ---
  const fetchChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await axios.get(`${apiUrl}/api/chat/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        let historyData = res.data.data?.messages || [];

        // Ensure chronological order (Oldest first -> Newest last) for correct Chat UI
        historyData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );

        setMessages(historyData);
        socket?.emit("mark_read", { roomId });
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const uploadFile = async (fileToUpload) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const res = await axios.post(`${apiUrl}/api/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.data; // { fileUrl, fileType, fileName, fileSize }
      }
    } catch (error) {
      alert("File upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --- ACTIONS ---

  const sendMessage = async (fileData = null) => {
    // If text is empty and no file, return
    if (!fileData && !inputText.trim()) return;

    // Use fileType from upload response, or default to text
    const msgType = fileData ? fileData.fileType : "text";

    const messagePayload = {
      roomId,
      receiverId: otherUserId,
      receiverModel: otherUserModel,
      text: inputText || "",
      messageType: msgType,
      fileUrl: fileData ? fileData.fileUrl : null,
      fileName: fileData ? fileData.fileName : null,
      fileSize: fileData ? fileData.fileSize : null,
      tempId: Date.now(),
    };

    // Emit to socket
    socket?.emit("send_message", messagePayload);

    // Play sound
    playSound("send");

    // Reset inputs
    setInputText("");
    setSelectedFile(null);
    socket?.emit("stop_typing", { roomId });
  };

  const handleFileSend = async () => {
    if (!selectedFile) return;

    // 1. Upload File
    const fileData = await uploadFile(selectedFile);

    // 2. Send Message with File Data
    if (fileData) {
      // Manual override if browser MIME is audio
      if (selectedFile.type.startsWith("audio/")) {
        fileData.fileType = "audio";
      }
      await sendMessage(fileData);
    }
  };

  // --- TYPING ---
  const handleTyping = () => {
    if (!typingTimeoutRef.current) {
      socket?.emit("typing", { roomId });
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop_typing", { roomId });
      typingTimeoutRef.current = null;
    }, 800);
  };

  // --- VOICE RECORDING ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice_note.webm", {
          type: "audio/webm",
        });

        // Directly upload and send
        const fileData = await uploadFile(audioFile);
        if (fileData) {
          fileData.fileType = "audio"; // Explicitly set type to audio
          sendMessage(fileData);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();

      mediaRecorder.stream.getTracks().forEach((track) => track.stop());

      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  // --- HELPERS ---
  const isMessageFromMe = (msg) => {
    const senderId = msg.senderId?._id || msg.senderId;
    return senderId === currentUserId;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- RENDERING ---
  const renderDateSeparator = (currentMsg, prevMsg) => {
    const currentDate = new Date(
      currentMsg.createdAt || Date.now(),
    ).toDateString();
    const prevDate = prevMsg
      ? new Date(prevMsg.createdAt || Date.now()).toDateString()
      : null;

    if (currentDate !== prevDate) {
      let label = currentDate;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (currentDate === today) label = "Today";
      else if (currentDate === yesterday) label = "Yesterday";

      return (
        <div className="flex justify-center my-6 opacity-70">
          <span
            className={`text-xs px-3 py-1 rounded-full border ${isDarkMode ? "bg-slate-800/50 text-slate-400 border-slate-700" : "bg-gray-100 text-gray-500 border-gray-200"}`}
          >
            {label}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-[100dvh] md:h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-slate-900"}`}
    >
      {/* HEADER, BACKGROUND & NAV */}
      <div className="hidden md:flex absolute top-0 left-0 w-full p-6 justify-between items-center z-50 pointer-events-none">
        <Link
          href="/"
          className="flex items-center gap-3 group pointer-events-auto"
        >
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${isDarkMode ? "bg-blue-600 shadow-blue-500/20" : "bg-blue-600 shadow-blue-500/30"}`}
          >
            <span className="font-bold text-xl">V</span>
          </div>
          <div className="hidden md:block">
            <span
              className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              VARSHINI
            </span>
            <span className="text-blue-500 font-bold ml-1.5">HYUNDAI</span>
          </div>
        </Link>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${isDarkMode ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" : "bg-white/80 border-gray-200 text-gray-600 hover:bg-white shadow-sm"}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/">
            <button
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all backdrop-blur-md ${isDarkMode ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white" : "bg-white/80 border-gray-200 text-gray-600 hover:bg-white hover:text-blue-600 shadow-sm"}`}
            >
              <Home size={16} />{" "}
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </Link>
        </div>
      </div>

      <div
        className={`fixed inset-0 -z-10 ${isDarkMode ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b141a] to-black" : "bg-gradient-to-br from-blue-50 to-indigo-50"}`}
      />

      {/* Main Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col w-full flex-1 md:flex-none md:h-[92vh] md:max-w-[900px] relative md:rounded-3xl md:shadow-2xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? "bg-slate-900/60 backdrop-blur-2xl border-white/10" : "bg-white/80 backdrop-blur-xl border-white/40 shadow-blue-200/20"}`}
      >
        {/* --- CHAT HEADER --- */}
        <div
          className={`h-16 md:h-18 px-4 md:px-6 py-2 flex items-center justify-between border-b z-20 transition-colors ${isDarkMode ? "border-white/5 bg-slate-900/50" : "border-gray-200/50 bg-white/60"}`}
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden">
              <button
                className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/5 text-slate-600"}`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="relative">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden p-[2px] bg-gradient-to-br from-sky-400 to-blue-600">
                <div
                  className={`w-full h-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
                >
                  {otherUserInfo.profilePicture ? (
                    <img
                      src={otherUserInfo.profilePicture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center font-bold text-lg ${isDarkMode ? "text-white" : "text-blue-600"}`}
                    >
                      {otherUserInfo.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              {/* ONLINE INDICATOR */}
              {onlineStatus === "online" && (
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 rounded-full animate-pulse ${isDarkMode ? "border-slate-900 shadow-emerald-500/20" : "border-white shadow-emerald-500/20"}`}
                ></span>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h1
                className={`text-sm md:text-base font-bold tracking-tight truncate max-w-[150px] md:max-w-none ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                Support Executive
              </h1>
              <p
                className={`text-[10px] md:text-xs font-medium flex items-center gap-1.5 ${onlineStatus === "online" ? "text-emerald-500" : "text-slate-400"}`}
              >
                {otherUserTyping
                  ? "Typing..."
                  : onlineStatus === "online"
                    ? "Online"
                    : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2 rounded-full transition-all duration-200 ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-black/5 text-slate-500"}`}
            >
              {isSoundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5 opacity-50" />
              )}
            </button>
            <div
              className={`w-px h-6 mx-1 ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`}
            ></div>
            <button
              className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-slate-300" : "hover:bg-black/5 text-slate-600"}`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- MESSAGES AREA --- */}
        <div
          className={`flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scrollbar-thin ${isDarkMode ? "scrollbar-thumb-white/10 scrollbar-track-transparent" : "scrollbar-thumb-gray-200 scrollbar-track-transparent"}`}
          style={{
            backgroundImage: isDarkMode
              ? "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {isLoadingHistory && (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`h-12 w-48 rounded-2xl animate-pulse ${isDarkMode ? "bg-slate-800" : "bg-gray-200"}`}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {!isLoadingHistory && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-60">
              <div
                className={`p-4 rounded-full mb-4 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
              >
                <MessageSquareDashed
                  className={`w-12 h-12 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
                />
              </div>
              <p
                className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
              >
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {Array.isArray(messages) &&
            messages.map((msg, index) => {
              const isMe = isMessageFromMe(msg);
              const prevMsg = messages[index - 1];
              return (
                <div key={msg._id || index}>
                  {renderDateSeparator(msg, prevMsg)}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`group flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col max-w-[85%] md:max-w-[65%]`}>
                      <div
                        className={`relative px-4 py-2.5 shadow-sm ${isMe ? "bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white rounded-[20px] rounded-tr-[4px]" : isDarkMode ? "bg-slate-800/80 backdrop-blur-md text-slate-100 border border-white/5 rounded-[20px] rounded-tl-[4px]" : "bg-white text-slate-800 border border-gray-100 shadow-sm rounded-[20px] rounded-tl-[4px]"}`}
                      >
                        {/* MEDIA DISPLAY */}
                        {(msg.messageType === "image" ||
                          msg.messageType === "video") &&
                          msg.fileUrl && (
                            <div className="mb-2 rounded-xl overflow-hidden bg-black/10 border border-black/5">
                              {msg.messageType === "image" ? (
                                <img
                                  src={msg.fileUrl}
                                  alt="Media"
                                  className="w-full max-h-[300px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                  onClick={() =>
                                    window.open(msg.fileUrl, "_blank")
                                  }
                                />
                              ) : (
                                <video
                                  src={msg.fileUrl}
                                  controls
                                  className="w-full max-h-[300px]"
                                />
                              )}
                            </div>
                          )}

                        {/* AUDIO DISPLAY */}
                        {msg.messageType === "audio" && msg.fileUrl && (
                          <div className="mb-2 min-w-[200px] flex items-center gap-2">
                            <audio
                              controls
                              src={msg.fileUrl}
                              className="w-full h-8"
                            />
                          </div>
                        )}

                        {msg.text && (
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
                        )}

                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-blue-100" : isDarkMode ? "text-slate-400" : "text-gray-400"}`}
                        >
                          <span className="text-[10px] font-medium opacity-80">
                            {formatTime(msg.createdAt || Date.now())}
                          </span>
                          {isMe && (
                            <span className="ml-0.5">
                              {msg.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-white/90" />
                              ) : msg.isDelivered ? (
                                <CheckCheck className="w-3.5 h-3.5 opacity-60" />
                              ) : (
                                <Check className="w-3.5 h-3.5 opacity-60" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}

          <AnimatePresence>
            {otherUserTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start mb-4"
              >
                <div
                  className={`px-4 py-3 rounded-[20px] rounded-tl-[4px] shadow-sm flex items-center gap-1.5 ${isDarkMode ? "bg-slate-800/80 backdrop-blur-md border border-white/5" : "bg-white border border-gray-100"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${isDarkMode ? "bg-slate-400" : "bg-gray-400"}`}
                  ></span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${isDarkMode ? "bg-slate-400" : "bg-gray-400"}`}
                  ></span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? "bg-slate-400" : "bg-gray-400"}`}
                  ></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* --- FLOATING FILE PREVIEW --- */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-20 md:bottom-24 left-4 right-4 md:left-6 md:right-6 z-30"
            >
              <div
                className={`p-3 rounded-2xl shadow-2xl flex items-center gap-4 border ${isDarkMode ? "bg-slate-800/90 backdrop-blur-xl border-white/10" : "bg-white/95 backdrop-blur-xl border-gray-200"}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/10">
                  {selectedFile.type.startsWith("image/") ? (
                    <ImageIcon className="text-indigo-500 w-6 h-6" />
                  ) : (
                    <Video className="text-pink-500 w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}
                  >
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-gray-100 text-slate-500 hover:text-slate-900"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- INPUT BAR --- */}
        <div className="p-3 md:p-6 bg-transparent z-20">
          <div
            className={`flex items-end gap-2 p-2 rounded-[28px] shadow-xl border relative transition-colors duration-300 ${isDarkMode ? "bg-slate-800/60 backdrop-blur-xl border-white/10 shadow-black/20" : "bg-white/80 backdrop-blur-xl border-white/60 shadow-blue-500/5"}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files &&
                e.target.files[0] &&
                setSelectedFile(e.target.files[0])
              }
              accept="image/*,video/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-full transition-all duration-200 ${isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800 hover:bg-gray-100"}`}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 py-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  isRecording ? "Recording audio..." : "Type a message..."
                }
                className={`w-full bg-transparent border-none outline-none text-[15px] resize-none max-h-32 placeholder-shown:font-normal font-medium ${isDarkMode ? "text-slate-100 placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"} ${isRecording ? "text-red-500 placeholder:text-red-500" : ""}`}
                disabled={uploading || isRecording}
                autoComplete="off"
              />
            </div>

            {/* RECORDING / SEND BUTTON */}
            {inputText.trim() || selectedFile ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  selectedFile ? handleFileSend() : sendMessage()
                }
                disabled={uploading}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${uploading ? (isDarkMode ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed") : "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-blue-500/30"}`}
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${isRecording ? "bg-red-500 text-white shadow-red-500/30 animate-pulse" : isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800 hover:bg-gray-100"}`}
              >
                {isRecording ? (
                  <StopCircle className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
