import React, { createContext, useContext, useState, useEffect } from "react";
import { notificationService } from "@/services/notificationService";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    enabled: false,
    daysAhead: 1, // 1, 3, or 7 days
    permission: 'default'
  });
  
  const [lastNotificationCheck, setLastNotificationCheck] = useState(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }

    // Check browser notification permission
    if ('Notification' in window) {
      setSettings(prev => ({ 
        ...prev, 
        permission: Notification.permission 
      }));
    }
  }, []);

  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    toast.success("Notification settings updated");
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error("This browser doesn't support notifications");
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast.error("Notifications are blocked. Please enable them in your browser settings.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setSettings(prev => ({ ...prev, permission }));
      
      if (permission === 'granted') {
        toast.success("Notifications enabled!");
        return true;
      } else {
        toast.warning("Notifications were not enabled");
        return false;
      }
    } catch (error) {
      toast.error("Failed to request notification permission");
      return false;
    }
  };

  const checkTaskNotifications = async (tasks) => {
    if (!settings.enabled || settings.permission !== 'granted') {
      return;
    }

    // Prevent too frequent checks (once per hour)
    const now = Date.now();
    if (lastNotificationCheck && (now - lastNotificationCheck) < 3600000) {
      return;
    }

    try {
      const dueSoonTasks = await notificationService.getTasksDueSoon(tasks, settings.daysAhead);
      
      for (const task of dueSoonTasks) {
        // Check if we already notified about this task recently
        const notificationKey = `task-${task.Id}-${task.dueDate}`;
        const lastNotified = localStorage.getItem(notificationKey);
        
        if (!lastNotified || (now - parseInt(lastNotified)) > 86400000) { // 24 hours
          await notificationService.sendTaskDueNotification(task, settings.daysAhead);
          localStorage.setItem(notificationKey, now.toString());
        }
      }

      setLastNotificationCheck(now);
    } catch (error) {
      console.error('Failed to check task notifications:', error);
    }
  };

  const value = {
    settings,
    saveSettings,
    requestPermission,
    checkTaskNotifications,
    isSupported: 'Notification' in window
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};