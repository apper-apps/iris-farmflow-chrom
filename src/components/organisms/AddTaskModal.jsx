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
    farm_id_c: "",
    crop_id_c: "",
    title_c: "",
    description_c: "",
    due_date_c: "",
    priority_c: "medium",
    status_c: "open"
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
if (formData.farm_id_c) {
      const farmCrops = crops.filter(crop => crop.farm_id_c === parseInt(formData.farm_id_c));
      setFilteredCrops(farmCrops);
      setFormData(prev => ({ ...prev, crop_id_c: "" }));
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
    
if (!formData.farm_id_c || !formData.title_c.trim() || !formData.due_date_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
const newTask = await taskService.create({
        farm_id_c: parseInt(formData.farm_id_c),
        crop_id_c: formData.crop_id_c ? parseInt(formData.crop_id_c) : null,
        title_c: formData.title_c.trim(),
        description_c: formData.description_c.trim(),
        due_date_c: formData.due_date_c,
        priority_c: formData.priority_c,
        status_c: formData.status_c,
        completed_c: false,
        created_at_c: new Date().toISOString()
      });
      
      onTaskAdded(newTask);
      toast.success("Task added successfully!");
setFormData({
        farm_id_c: "",
        crop_id_c: "",
        title_c: "",
        description_c: "",
        due_date_c: "",
        priority_c: "medium",
        status_c: "open"
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
                    {farm.Name}
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
                    {crop.type_c} ({crop.area_c} acres)
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

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Status"
                  name="status_c"
                  value={formData.status_c}
                  onChange={handleChange}
                  required
                >
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                </Select>

                <Select
                  label="Priority"
                  name="priority_c"
                  value={formData.priority_c}
                  onChange={handleChange}
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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