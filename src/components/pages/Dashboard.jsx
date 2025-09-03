import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskCard from "@/components/molecules/TaskCard";
import CropCard from "@/components/molecules/CropCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";
import { useNotification } from "@/services/NotificationProvider";
const Dashboard = () => {
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    transactions: [],
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [farms, crops, tasks, transactions, weather] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getCurrentWeather()
      ]);

setData({ farms, crops, tasks, transactions, weather });
      
      // Check for task notifications after loading data
      const { checkTaskNotifications } = useNotification();
      checkTaskNotifications(tasks);
      
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      )
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate stats
  const activeCrops = data.crops.filter(crop => crop.status !== "harvested").length;
  const todayTasks = data.tasks.filter(task => 
    !task.completed && isToday(new Date(task.dueDate))
  ).length;
  const upcomingTasks = data.tasks.filter(task => 
    !task.completed && (isTomorrow(new Date(task.dueDate)) || isThisWeek(new Date(task.dueDate)))
  ).slice(0, 5);
  
  const thisMonthIncome = data.transactions
    .filter(t => t.type === "income" && 
      format(new Date(t.date), "yyyy-MM") === format(new Date(), "yyyy-MM"))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonthExpenses = data.transactions
    .filter(t => t.type === "expense" && 
      format(new Date(t.date), "yyyy-MM") === format(new Date(), "yyyy-MM"))
    .reduce((sum, t) => sum + t.amount, 0);

  const recentCrops = data.crops
    .filter(crop => crop.status !== "harvested")
    .sort((a, b) => new Date(a.expectedHarvestDate) - new Date(b.expectedHarvestDate))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Farm Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening on your farm today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={data.farms.length}
          icon="Tractor"
          color="primary"
        />
        <StatCard
          title="Active Crops"
          value={activeCrops}
          icon="Leaf"
          color="secondary"
        />
        <StatCard
          title="Today's Tasks"
          value={todayTasks}
          icon="CheckSquare"
          color="accent"
          trend={todayTasks > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="Net Income (Month)"
          value={`$${(thisMonthIncome - thisMonthExpenses).toFixed(0)}`}
          icon="DollarSign"
          color={thisMonthIncome - thisMonthExpenses >= 0 ? "success" : "error"}
          trend={thisMonthIncome - thisMonthExpenses >= 0 ? "up" : "down"}
          change={`+$${thisMonthIncome.toFixed(0)} income`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather Card */}
        <div className="lg:col-span-1">
          <WeatherCard weather={data.weather} />
        </div>

        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Task
              </Button>
            </div>
            
            {todayTasks === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="CheckCircle2" size={32} className="text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
                <p className="text-gray-600">No tasks due today. Great work!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.tasks
                  .filter(task => !task.completed && isToday(new Date(task.dueDate)))
                  .slice(0, 3)
                  .map(task => (
                    <TaskCard
                      key={task.Id}
                      task={task}
                      onUpdate={handleTaskUpdate}
                    />
                  ))}
                {todayTasks > 3 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    And {todayTasks - 3} more tasks...
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Crops */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Crops</h3>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Crop
            </Button>
          </div>
          
          {recentCrops.length === 0 ? (
            <Empty
              title="No active crops"
              message="Start by adding your first crop to track its progress."
              buttonText="Add Crop"
              icon="Sprout"
            />
          ) : (
            <div className="space-y-4">
              {recentCrops.map(crop => {
                const farm = data.farms.find(f => f.Id === crop.farmId);
                return (
                  <CropCard key={crop.Id} crop={crop} farm={farm} />
                );
              })}
            </div>
          )}
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calendar" size={32} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming tasks</h4>
              <p className="text-gray-600">Your schedule is clear for the next few days.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingTasks.map(task => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onUpdate={handleTaskUpdate}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <ApperIcon name="Plus" size={20} className="mb-2" />
            <span className="text-sm">Add Farm</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <ApperIcon name="Sprout" size={20} className="mb-2" />
            <span className="text-sm">Plant Crop</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <ApperIcon name="CheckSquare" size={20} className="mb-2" />
            <span className="text-sm">Add Task</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <ApperIcon name="DollarSign" size={20} className="mb-2" />
            <span className="text-sm">Record Expense</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;