import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import reject_image from "../assets/rejected-image.png";
export const ModernToast = ({ type, title, message, closeToast, toastProps }) => {
  const styles = {
    info: "from-blue-500/90 to-indigo-600/90 shadow-blue-500/40",
    success: "from-green-500/90 to-emerald-600/90 shadow-green-500/40",
    error: "from-red-500/90 to-rose-600/90 shadow-red-500/40",
    warning: "from-amber-500/90 to-orange-600/90 shadow-amber-500/40",
    reject: "from-black/90 to-black/40 shadow-black/40"
  };

  const icons = {
    info: <FaInfoCircle className="text-white text-2xl drop-shadow-md" />,
    success: <FaCheckCircle className="text-white text-2xl drop-shadow-md" />,
    error: <FaTimesCircle className="text-white text-2xl drop-shadow-md" />,
    warning: <FaExclamationTriangle className="text-white text-2xl drop-shadow-md" />,
    reject: <div className="text-white text-2xl drop-shadow-md bg-cyan-"><img className="w-12 h-10" src={reject_image} alt="" /></div>
  };

  const duration = toastProps?.autoClose || 3000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col w-96 rounded-2xl shadow-xl bg-gradient-to-r ${styles[type]} text-white border-white/10 overflow-hidden`}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center space-x-5">
          {icons[type]}
          <div>
            <h3 className="font-semibold text-base leading-tight tracking-wide">{title}</h3>
            <p className="text-xs text-white/90 mt-0.5">{message}</p>
          </div>
        </div>
        <button
          onClick={closeToast}
          className="ml-3 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <FaTimes className="text-white text-sm" />
        </button>
      </div>

      <motion.div
        className="h-1 bg-white/50"
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 500, ease: "linear" }}
      />
    </motion.div>
  );
};
