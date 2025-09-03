import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useNotification } from "@/services/NotificationProvider";
import { notificationService } from "@/services/notificationService";
import { toast } from "react-toastify";

const NotificationSettings = ({ isOpen, onClose }) => {
  const { settings, saveSettings, requestPermission, isSupported } = useNotification();
  const [testingNotification, setTestingNotification] = useState(false);

  const handleEnableToggle = async () => {
    if (!settings.enabled) {
      const granted = await requestPermission();
      if (granted) {
        saveSettings({ enabled: true });
      }
    } else {
      saveSettings({ enabled: false });
    }
  };

  const handleDaysChange = (days) => {
    saveSettings({ daysAhead: parseInt(days) });
  };

  const handleTestNotification = async () => {
    setTestingNotification(true);
    try {
      await notificationService.testNotification();
      toast.success("Test notification sent!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTestingNotification(false);
    }
  };

  const getPermissionBadge = () => {
    switch (settings.permission) {
      case 'granted':
        return <Badge variant="success" size="sm">Granted</Badge>;
      case 'denied':
        return <Badge variant="error" size="sm">Denied</Badge>;
      case 'default':
        return <Badge variant="warning" size="sm">Not Requested</Badge>;
      default:
        return <Badge variant="default" size="sm">Unknown</Badge>;
    }
  };

  const getDaysLabel = (days) => {
    switch (days) {
      case 1:
        return "1 day before";
      case 3:
        return "3 days before";
      case 7:
        return "1 week before";
      default:
        return `${days} days before`;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Browser Support */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Browser Support</h3>
                  <p className="text-sm text-gray-600">
                    {isSupported ? "Your browser supports notifications" : "Notifications not supported"}
                  </p>
                </div>
                <Badge variant={isSupported ? "success" : "error"} size="sm">
                  {isSupported ? "Supported" : "Not Supported"}
                </Badge>
              </div>

              {isSupported && (
                <>
                  {/* Permission Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Permission Status</h3>
                      <p className="text-sm text-gray-600">Browser notification permission</p>
                    </div>
                    {getPermissionBadge()}
                  </div>

                  {/* Enable/Disable Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Task Due Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Get notified when tasks are approaching their due dates
                      </p>
                    </div>
                    <Button
                      variant={settings.enabled ? "primary" : "outline"}
                      size="sm"
                      onClick={handleEnableToggle}
                      disabled={!isSupported}
                    >
                      {settings.enabled ? "Enabled" : "Enable"}
                    </Button>
                  </div>

                  {/* Timing Settings */}
                  {settings.enabled && settings.permission === 'granted' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Notification Timing</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        When should you be notified about upcoming tasks?
                      </p>
                      
                      <Select
                        value={settings.daysAhead}
                        onChange={(e) => handleDaysChange(e.target.value)}
                        className="w-full"
                      >
                        <option value={1}>1 day before due date</option>
                        <option value={3}>3 days before due date</option>
                        <option value={7}>1 week before due date</option>
                      </Select>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Currently set to notify {getDaysLabel(settings.daysAhead)} the due date
                      </p>
                    </div>
                  )}

                  {/* Test Notification */}
                  {settings.enabled && settings.permission === 'granted' && (
                    <div className="border-t pt-4">
                      <Button
                        variant="outline"
                        onClick={handleTestNotification}
                        disabled={testingNotification}
                        className="w-full"
                      >
                        <ApperIcon 
                          name={testingNotification ? "Loader2" : "Bell"} 
                          size={16} 
                          className={`mr-2 ${testingNotification ? "animate-spin" : ""}`} 
                        />
                        {testingNotification ? "Sending..." : "Send Test Notification"}
                      </Button>
                    </div>
                  )}

                  {/* Permission Denied Help */}
                  {settings.permission === 'denied' && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start">
                        <ApperIcon name="AlertTriangle" size={20} className="text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-orange-900 mb-1">Notifications Blocked</h4>
                          <p className="text-sm text-orange-800 mb-3">
                            Notifications are currently blocked for this site. To enable them:
                          </p>
                          <ol className="text-sm text-orange-800 space-y-1 list-decimal list-inside">
                            <li>Click the lock icon in your browser's address bar</li>
                            <li>Select "Allow" for notifications</li>
                            <li>Refresh this page</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Not Supported Help */}
              {!isSupported && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <ApperIcon name="XCircle" size={20} className="text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">Notifications Not Supported</h4>
                      <p className="text-sm text-red-800">
                        Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Safari.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationSettings;