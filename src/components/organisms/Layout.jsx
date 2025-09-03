import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import NotificationSettings from "@/components/organisms/NotificationSettings";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleNotificationClick = () => {
    setNotificationSettingsOpen(true);
  };

  const handleNotificationSettingsClose = () => {
    setNotificationSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <Header 
          onMenuClick={handleMenuClick} 
          onNotificationClick={handleNotificationClick}
        />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notification Settings Modal */}
      <NotificationSettings 
        isOpen={notificationSettingsOpen}
        onClose={handleNotificationSettingsClose}
      />
    </div>
  );
};

export default Layout;