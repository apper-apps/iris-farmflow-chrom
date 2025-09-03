import { isToday, isTomorrow, format, differenceInDays } from "date-fns";

class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
  }

  async sendTaskDueNotification(task, daysAhead) {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return;
    }

// Helper function to validate dates
    const isValidDate = (date) => {
      return date instanceof Date && !isNaN(date.getTime());
    };

    // Helper function to safely parse dates
    const safeParseDate = (dateValue) => {
      if (!dateValue) return null;
      const parsed = new Date(dateValue);
      return isValidDate(parsed) ? parsed : null;
    };

    const dueDate = safeParseDate(task.dueDate || task.due_date_c);
    if (!dueDate) return null; // Skip invalid dates
    
    const now = new Date();
    const daysUntilDue = differenceInDays(dueDate, now);
    
    let title, body;
    
    if (isToday(dueDate)) {
      title = "Task Due Today! 📅";
      body = `${task.title} is due today`;
    } else if (isTomorrow(dueDate)) {
title = "Task Due Tomorrow! ⏰";
      body = `${task.title || task.title_c || 'Task'} is due tomorrow (${format(dueDate, "MMM d")})`;
    } else {
      title = `Task Due in ${daysUntilDue} Days`;
body = `${task.title || task.title_c || 'Task'} is due on ${format(dueDate, "MMM d, yyyy")}`;
    }

    // Add priority indicator
    if (task.priority === 'high') {
      title = "🚨 " + title;
    }

    const options = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `task-${task.Id}`,
      requireInteraction: task.priority === 'high',
      actions: [
        {
          action: 'view',
          title: 'View Task'
        },
        {
          action: 'complete',
          title: 'Mark Complete'
        }
      ]
    };

    try {
      const notification = new Notification(title, options);
      
      // Auto-close after 10 seconds unless it's high priority
      if (task.priority !== 'high') {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      notification.onclick = () => {
        window.focus();
        window.location.href = '/tasks';
        notification.close();
      };

    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async getTasksDueSoon(tasks, daysAhead = 1) {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    targetDate.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      if (task.completed) return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= targetDate;
    });
  }

  async testNotification() {
    if (!this.isSupported) {
      throw new Error("Notifications not supported");
    }

    if (Notification.permission !== 'granted') {
      throw new Error("Notification permission not granted");
    }

    const notification = new Notification("FarmFlow Notifications", {
      body: "Notifications are working correctly! You'll receive alerts for upcoming task due dates.",
      icon: '/favicon.ico',
      tag: 'test'
    });

    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  getPermissionStatus() {
    if (!this.isSupported) {
      return 'unsupported';
    }
    return Notification.permission;
  }
}

export const notificationService = new NotificationService();