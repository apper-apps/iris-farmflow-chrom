import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isPast, isThisWeek, isToday, isTomorrow } from "date-fns";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { useNotification } from "@/services/NotificationProvider";
import ApperIcon from "@/components/ApperIcon";
import AddTaskModal from "@/components/organisms/AddTaskModal";
import TaskCard from "@/components/molecules/TaskCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const { checkTaskNotifications } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  // Check for task notifications when tasks or filters change
  useEffect(() => {
    if (tasks.length > 0) {
      try {
const filteredTasks = tasks.filter(task => {
          const matchesSearch = (task.title_c || task.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (task.description_c || task.description)?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPriority = priorityFilter === "all" || (task.priority_c || task.priority) === priorityFilter;
          const matchesStatus = statusFilter === "all" || 
                               (statusFilter === "completed" && task.completed) ||
                               (statusFilter === "pending" && !task.completed);
          
          return matchesSearch && matchesPriority && matchesStatus;
        });
        checkTaskNotifications(filteredTasks);
      } catch (notificationError) {
        console.error('Failed to check task notifications:', notificationError);
      }
    }
  }, [tasks, searchTerm, priorityFilter, statusFilter, checkTaskNotifications]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

// Helper function to validate dates
  const isValidTaskDate = (task) => {
    const date = new Date(task.due_date_c || task.dueDate);
    return date && !isNaN(date.getTime()) ? date : null;
  };

  const categorizedTasks = () => {
    const filteredTasks = tasks.filter(task => {
      const matchesSearch = (task.title_c || task.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description_c || task.description)?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || (task.priority_c || task.priority) === priorityFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "completed" && (task.completed_c || task.completed)) ||
                           (statusFilter === "pending" && !(task.completed_c || task.completed));
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
    
    return {
      overdue: filteredTasks.filter(task => {
        const taskDate = isValidTaskDate(task);
        return !(task.completed_c || task.completed) && taskDate && isPast(taskDate) && !isToday(taskDate);
      }),
      today: filteredTasks.filter(task => {
        const taskDate = isValidTaskDate(task);
        return !(task.completed_c || task.completed) && taskDate && isToday(taskDate);
      }),
      tomorrow: filteredTasks.filter(task => {
        const taskDate = isValidTaskDate(task);
        return !(task.completed_c || task.completed) && taskDate && isTomorrow(taskDate);
      }),
      thisWeek: filteredTasks.filter(task => {
        const taskDate = isValidTaskDate(task);
        return !(task.completed_c || task.completed) && taskDate && isThisWeek(taskDate) && !isToday(taskDate) && !isTomorrow(taskDate);
      }),
      completed: filteredTasks.filter(task => (task.completed_c || task.completed))
    };
  };

  const { overdue, today, tomorrow, thisWeek, completed } = categorizedTasks();

  const TaskSection = ({ title, tasks, color = "gray", icon }) => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center`}>
            <ApperIcon name={icon} size={16} className={`text-${color}-600`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Badge variant={color === "red" ? "error" : color === "green" ? "success" : "info"} size="sm">
            {tasks.length}
          </Badge>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks in this category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard
              key={task.Id}
              task={task}
              onUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      )}
    </Card>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">
            Organize and track your daily farm activities and maintenance tasks.
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setShowAddModal(true)}
          size="lg"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Quick Stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{overdue.length}</p>
            <p className="text-sm text-red-700">Overdue</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{today.length}</p>
            <p className="text-sm text-blue-700">Due Today</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{thisWeek.length}</p>
            <p className="text-sm text-orange-700">This Week</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completed.length}</p>
            <p className="text-sm text-green-700">Completed</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </Select>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      {/* Task Sections */}
      {tasks.length === 0 ? (
        <Empty
          title="No tasks created yet"
          message="Start organizing your farm work by creating your first task. Track watering, fertilizing, harvesting, and other important activities."
          buttonText="Create Your First Task"
          onAction={() => setShowAddModal(true)}
          icon="CheckSquare"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {overdue.length > 0 && (
            <TaskSection
              title="Overdue"
              tasks={overdue}
              color="red"
              icon="AlertTriangle"
            />
          )}
          
          <TaskSection
            title="Due Today"
            tasks={today}
            color="blue"
            icon="Calendar"
          />
          
          {tomorrow.length > 0 && (
            <TaskSection
              title="Due Tomorrow"
              tasks={tomorrow}
              color="orange"
              icon="Clock"
            />
          )}
          
          {thisWeek.length > 0 && (
            <TaskSection
              title="This Week"
              tasks={thisWeek}
              color="yellow"
              icon="CalendarDays"
            />
          )}
          
          {completed.length > 0 && (
            <TaskSection
              title="Completed"
              tasks={completed}
              color="green"
              icon="CheckCircle2"
            />
          )}
        </motion.div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default Tasks;