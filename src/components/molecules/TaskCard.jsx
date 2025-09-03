import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const TaskCard = ({ task, onUpdate }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      high: "error",
      medium: "warning",
      low: "success"
    };
    return colors[priority] || "default";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: "AlertTriangle",
      medium: "Clock",
      low: "CheckCircle2"
    };
    return icons[priority] || "Circle";
  };

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        ...task,
        completed: !task.completed
      });
      onUpdate(updatedTask);
      toast.success(task.completed ? "Task marked as incomplete" : "Task completed!");
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setIsCompleting(false);
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`${task.completed ? "opacity-60" : ""} ${isOverdue ? "border-red-200 bg-red-50/50" : ""}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleToggleComplete}
                disabled={isCompleting}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed 
                    ? "bg-primary border-primary text-white" 
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                {task.completed && <ApperIcon name="Check" size={12} />}
              </button>
              <h3 className={`font-semibold text-gray-900 ${task.completed ? "line-through" : ""}`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" size={14} />
                <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              <ApperIcon name={getPriorityIcon(task.priority)} size={12} className="mr-1" />
              {task.priority}
            </Badge>
            {isOverdue && (
              <Badge variant="error" size="sm">
                Overdue
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;