import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CropCard from "@/components/molecules/CropCard";
import AddCropModal from "@/components/organisms/AddCropModal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [farmFilter, setFarmFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops data");
    } finally {
      setLoading(false);
    }
  };

  const handleCropAdded = (newCrop) => {
    setCrops(prev => [...prev, newCrop]);
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || crop.status === statusFilter;
    const matchesFarm = farmFilter === "all" || crop.farmId === parseInt(farmFilter);
    
    return matchesSearch && matchesStatus && matchesFarm;
  });

  const getStatusCounts = () => {
    return crops.reduce((acc, crop) => {
      acc[crop.status] = (acc[crop.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crops</h1>
          <p className="text-gray-600">
            Track your planted crops, monitor their progress, and manage harvest schedules.
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setShowAddModal(true)}
          size="lg"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Status Overview */}
      {crops.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <Badge variant="info" size="lg">
            Total: {crops.length}
          </Badge>
          <Badge variant="warning" size="lg">
            Planted: {statusCounts.planted || 0}
          </Badge>
          <Badge variant="primary" size="lg">
            Growing: {statusCounts.growing || 0}
          </Badge>
          <Badge variant="success" size="lg">
            Ready: {statusCounts.ready || 0}
          </Badge>
          <Badge variant="default" size="lg">
            Harvested: {statusCounts.harvested || 0}
          </Badge>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search crops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready</option>
          <option value="harvested">Harvested</option>
        </Select>

        <Select
          value={farmFilter}
          onChange={(e) => setFarmFilter(e.target.value)}
        >
          <option value="all">All Farms</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id}>
              {farm.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        crops.length === 0 ? (
          <Empty
            title="No crops planted yet"
            message="Start your agricultural journey by planting your first crop and tracking its progress from seed to harvest."
            buttonText="Plant Your First Crop"
            onAction={() => setShowAddModal(true)}
            icon="Sprout"
          />
        ) : (
          <Empty
            title="No crops match your filters"
            message="Try adjusting your search terms or filters to find the crops you're looking for."
            icon="Search"
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCrops.map((crop, index) => {
            const farm = farms.find(f => f.Id === crop.farmId);
            return (
              <motion.div
                key={crop.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CropCard crop={crop} farm={farm} />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Summary Statistics */}
      {crops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sprout" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.reduce((total, crop) => total + crop.area, 0).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Total Area (acres)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => crop.status === "ready").length}
                </p>
                <p className="text-sm text-gray-600">Ready for Harvest</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => crop.status === "growing").length}
                </p>
                <p className="text-sm text-gray-600">Currently Growing</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      <AddCropModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCropAdded={handleCropAdded}
      />
    </div>
  );
};

export default Crops;