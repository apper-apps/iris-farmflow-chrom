import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.farmId) {
      const farmCrops = crops.filter(crop => crop.farmId === parseInt(formData.farmId));
      setFilteredCrops(farmCrops);
      setFormData(prev => ({ ...prev, cropId: "" }));
    } else {
      setFilteredCrops([]);
    }
  }, [formData.farmId, crops]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.farmId || !formData.title.trim() || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTask = await taskService.create({
        farmId: parseInt(formData.farmId),
        cropId: formData.cropId ? parseInt(formData.cropId) : null,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        priority: formData.priority,
        completed: false,
        createdAt: new Date().toISOString()
      });
      
      onTaskAdded(newTask);
      toast.success("Task added successfully!");
      setFormData({
        farmId: "",
        cropId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "medium"
      });
      onClose();
    } catch (error) {
      toast.error("Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Water tomatoes, Apply fertilizer"
                required
              />

              <Select
                label="Farm"
                name="farmId"
                value={formData.farmId}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                <option value="">Select a farm</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>
                    {farm.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Crop (optional)"
                name="cropId"
                value={formData.cropId}
                onChange={handleChange}
                disabled={!formData.farmId}
              >
                <option value="">Select a crop (optional)</option>
                {filteredCrops.map(crop => (
                  <option key={crop.Id} value={crop.Id}>
                    {crop.type} ({crop.area} acres)
                  </option>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>

              <Textarea
                label="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Any additional details about this task..."
                rows={3}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || isLoading}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Add Task
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;