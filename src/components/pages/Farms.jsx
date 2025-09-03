import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FarmCard from "@/components/molecules/FarmCard";
import AddFarmModal from "@/components/organisms/AddFarmModal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [farmsData, cropsData, tasksData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll()
      ]);
      
      setFarms(farmsData);
      setCrops(cropsData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load farms data");
    } finally {
      setLoading(false);
    }
  };

  const handleFarmAdded = (newFarm) => {
    setFarms(prev => [...prev, newFarm]);
  };

  const handleFarmClick = (farm) => {
    // In a real app, this would navigate to a detailed farm view
    console.log("Farm clicked:", farm);
  };

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFarmStats = (farmId) => {
    const farmCrops = crops.filter(crop => crop.farmId === farmId);
    const activeCrops = farmCrops.filter(crop => crop.status !== "harvested").length;
    const activeTasks = tasks.filter(task => task.farmId === farmId && !task.completed).length;
    
    return { cropCount: activeCrops, activeTaskCount: activeTasks };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Farms</h1>
          <p className="text-gray-600">
            Manage your farm properties and track their performance.
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setShowAddModal(true)}
          size="lg"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Farm
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search farms by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        farms.length === 0 ? (
          <Empty
            title="No farms yet"
            message="Get started by adding your first farm property to begin tracking your agricultural operations."
            buttonText="Add Your First Farm"
            onAction={() => setShowAddModal(true)}
            icon="Tractor"
          />
        ) : (
          <Empty
            title="No farms match your search"
            message="Try adjusting your search terms to find the farm you're looking for."
            icon="Search"
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFarms.map((farm, index) => {
            const stats = getFarmStats(farm.Id);
            return (
              <motion.div
                key={farm.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FarmCard
                  farm={farm}
                  cropCount={stats.cropCount}
                  activeTaskCount={stats.activeTaskCount}
                  onClick={handleFarmClick}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Farm Statistics */}
      {farms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Tractor" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{farms.length}</p>
                <p className="text-sm text-gray-600">Total Farms</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Map" size={24} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {farms.reduce((total, farm) => total + farm.size, 0).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Total Acres</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Leaf" size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => crop.status !== "harvested").length}
                </p>
                <p className="text-sm text-gray-600">Active Crops</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Farm Modal */}
      <AddFarmModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFarmAdded={handleFarmAdded}
      />
    </div>
  );
};

export default Farms;