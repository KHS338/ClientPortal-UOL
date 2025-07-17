"use client";

import { useState, useEffect } from "react";
import { FiAlertTriangle, FiX, FiCheck } from "react-icons/fi";

export const AlertDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning" // warning, success, error, info
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          icon: <FiAlertTriangle className="text-amber-500" size={48} />,
          gradient: "from-amber-500/20 to-red-500/20",
          border: "border-amber-500/30",
          confirmBg: "bg-red-500 hover:bg-red-600",
          iconBg: "bg-amber-500/10"
        };
      case "success":
        return {
          icon: <FiCheck className="text-green-500" size={48} />,
          gradient: "from-green-500/20 to-blue-500/20",
          border: "border-green-500/30",
          confirmBg: "bg-green-500 hover:bg-green-600",
          iconBg: "bg-green-500/10"
        };
      case "error":
        return {
          icon: <FiX className="text-red-500" size={48} />,
          gradient: "from-red-500/20 to-pink-500/20",
          border: "border-red-500/30",
          confirmBg: "bg-red-500 hover:bg-red-600",
          iconBg: "bg-red-500/10"
        };
      default:
        return {
          icon: <FiAlertTriangle className="text-blue-500" size={48} />,
          gradient: "from-blue-500/20 to-purple-500/20",
          border: "border-blue-500/30",
          confirmBg: "bg-blue-500 hover:bg-blue-600",
          iconBg: "bg-blue-500/10"
        };
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? "opacity-100" : "opacity-0"
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      
      {/* Alert Dialog */}
      <div className={`relative w-full max-w-md transform transition-all duration-300 ${
        isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      }`}>
        <div className={`bg-white rounded-2xl border-2 ${styles.border} shadow-2xl overflow-hidden`}>
          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${styles.gradient} p-6 text-center`}>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${styles.iconBg} mb-4`}>
              {styles.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              {message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-3 ${styles.confirmBg} text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast notification component for success messages
export const Toast = ({ isOpen, onClose, message, type = "success" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <FiCheck className="text-white" size={20} />,
          bg: "bg-gradient-to-r from-green-500 to-green-600",
          shadow: "shadow-green-500/25"
        };
      case "error":
        return {
          icon: <FiX className="text-white" size={20} />,
          bg: "bg-gradient-to-r from-red-500 to-red-600",
          shadow: "shadow-red-500/25"
        };
      default:
        return {
          icon: <FiCheck className="text-white" size={20} />,
          bg: "bg-gradient-to-r from-blue-500 to-blue-600",
          shadow: "shadow-blue-500/25"
        };
    }
  };

  const toastStyles = getToastStyles();

  if (!isOpen) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}>
      <div className={`${toastStyles.bg} text-white px-6 py-4 rounded-xl shadow-2xl ${toastStyles.shadow} flex items-center gap-3 min-w-[300px]`}>
        <div className="flex-shrink-0">
          {toastStyles.icon}
        </div>
        <p className="font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-auto flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};
