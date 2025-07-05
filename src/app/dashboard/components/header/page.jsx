'use client'
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiLogOut, FiUser, FiMenu, FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-gray-800">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <FiMenu size={20} />
        </button>

        {/* Admin dropdown */}
        <div className="relative ml-auto" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-gray-800 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#E53935] flex items-center justify-center text-white">
              <FiUser size={16} />
            </div>
            <span className="font-medium text-gray-200">Admin</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="text-gray-400 group-hover:text-white" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
              >
                <div className="px-1 py-1">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">Admin Panel</p>
                    <p className="text-xs text-gray-400">admin@doubtclear</p>
                  </div>
                  
                  {/* Settings Option Added Here */}
                  <button className="w-full flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors">
                    <FiSettings className="mr-3 text-gray-400" size={14} />
                    Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
                    <FiLogOut className="mr-3" size={14} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}