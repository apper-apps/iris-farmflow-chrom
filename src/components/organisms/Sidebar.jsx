import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/farms", icon: "Tractor", label: "Farms" },
    { to: "/crops", icon: "Leaf", label: "Crops" },
    { to: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { to: "/finances", icon: "DollarSign", label: "Finances" },
    { to: "/weather", icon: "Cloud", label: "Weather" },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Tractor" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FarmFlow</h1>
              <p className="text-sm text-gray-600">Agriculture Manager</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Tractor" size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">FarmFlow</h1>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <ApperIcon name="X" size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;