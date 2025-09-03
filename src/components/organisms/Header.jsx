import React from "react";
import { useNotification } from "@/services/NotificationProvider";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, onNotificationClick }) => {
  const { settings, isSupported } = useNotification();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <h1 className="ml-2 text-xl font-bold text-gray-900 lg:ml-0">
              FarmFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Search" size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNotificationClick}
              className="relative"
            >
              <ApperIcon name="Bell" size={18} />
              {isSupported && settings.enabled && settings.permission === 'granted' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;