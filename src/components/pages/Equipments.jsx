import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EquipmentCard from "@/components/molecules/EquipmentCard";
import AddEquipmentModal from "@/components/organisms/AddEquipmentModal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { equipmentService } from "@/services/api/equipmentService";
import { farmService } from "@/services/api/farmService";

const Equipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [farmFilter, setFarmFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [equipmentsData, farmsData] = await Promise.all([
        equipmentService.getAll(),
        farmService.getAll()
      ]);
      
      setEquipments(equipmentsData || []);
      setFarms(farmsData || []);
    } catch (err) {
      setError("Failed to load equipment data");
      console.error("Error loading equipment data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentAdded = (newEquipment) => {
    setEquipments(prev => [...prev, newEquipment]);
  };

  const handleEquipmentClick = (equipment) => {
    // In a real app, this would navigate to a detailed equipment view
    console.log("Equipment clicked:", equipment);
  };

  const getUniqueTypes = () => {
    const types = equipments
      .map(equipment => equipment.Type_c)
      .filter(type => type && type.trim())
      .filter((type, index, array) => array.indexOf(type) === index)
      .sort();
    return types;
  };

  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = 
      equipment.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.Type_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.Notes_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFarm = farmFilter === "all" || 
      (farmFilter === "unassigned" && !equipment.FarmId_c) ||
      equipment.FarmId_c?.Id == farmFilter;
    
    const matchesType = typeFilter === "all" || equipment.Type_c === typeFilter;
    
    return matchesSearch && matchesFarm && matchesType;
  });

  const getEquipmentStats = () => {
    const totalCost = equipments.reduce((sum, equipment) => sum + (equipment.Cost_c || 0), 0);
    const assignedCount = equipments.filter(equipment => equipment.FarmId_c).length;
    const uniqueTypes = getUniqueTypes().length;
    
    return {
      total: equipments.length,
      totalCost,
      assigned: assignedCount,
      unassigned: equipments.length - assignedCount,
      types: uniqueTypes
    };
  };

  const stats = getEquipmentStats();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Equipment</h1>
          <p className="text-gray-600">
            Manage your farm equipment and track their usage across properties.
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setShowAddModal(true)}
          size="lg"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Equipment Statistics */}
      {equipments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Truck" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Equipment</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalCost.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
                <p className="text-sm text-gray-600">Assigned to Farms</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Layers" size={24} className="text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.types}</p>
                <p className="text-sm text-gray-600">Equipment Types</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          placeholder="Search equipment by name, type, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          value={farmFilter}
          onChange={(e) => setFarmFilter(e.target.value)}
        >
          <option value="all">All Farms</option>
          <option value="unassigned">Unassigned</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id}>
              {farm.Name}
            </option>
          ))}
        </Select>

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {getUniqueTypes().map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      {/* Equipment Grid */}
      {filteredEquipments.length === 0 ? (
        equipments.length === 0 ? (
          <Empty
            title="No equipment registered yet"
            message="Start building your equipment inventory by adding your first piece of farm equipment. Track tractors, harvesters, irrigation systems, and more."
            buttonText="Add Your First Equipment"
            onAction={() => setShowAddModal(true)}
            icon="Truck"
          />
        ) : (
          <Empty
            title="No equipment matches your filters"
            message="Try adjusting your search terms or filters to find the equipment you're looking for."
            icon="Search"
          />
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEquipments.map((equipment, index) => (
            <motion.div
              key={equipment.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EquipmentCard
                equipment={equipment}
                onClick={handleEquipmentClick}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEquipmentAdded={handleEquipmentAdded}
      />
    </div>
  );
};

export default Equipments;