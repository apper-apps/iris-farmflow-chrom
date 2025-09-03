import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const AddCropModal = ({ isOpen, onClose, onCropAdded }) => {
const [formData, setFormData] = useState({
    farm_id_c: "",
    type_c: "",
    planting_date_c: "",
    expected_harvest_date_c: "",
    status_c: "planted",
    area_c: "",
    notes_c: ""
  });
  const [farms, setFarms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFarms();
    }
  }, [isOpen]);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
    } catch (error) {
      toast.error("Failed to load farms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.farm_id_c || !formData.type_c.trim() || !formData.planting_date_c || !formData.expected_harvest_date_c || !formData.area_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.expected_harvest_date_c) <= new Date(formData.planting_date_c)) {
      toast.error("Expected harvest date must be after planting date");
      return;
    }

    setIsSubmitting(true);
    try {
const newCrop = await cropService.create({
        farm_id_c: parseInt(formData.farm_id_c),
        type_c: formData.type_c.trim(),
        planting_date_c: formData.planting_date_c,
        expected_harvest_date_c: formData.expected_harvest_date_c,
        status_c: formData.status_c,
        area_c: parseFloat(formData.area_c),
        notes_c: formData.notes_c.trim()
      });
      
      onCropAdded(newCrop);
      toast.success("Crop added successfully!");
setFormData({
        farm_id_c: "",
        type_c: "",
        planting_date_c: "",
        expected_harvest_date_c: "",
        status_c: "planted",
        area_c: "",
        notes_c: ""
      });
      onClose();
    } catch (error) {
      toast.error("Failed to add crop");
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
              <h3 className="text-lg font-semibold text-gray-900">Add New Crop</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
<Select
                label="Farm"
                name="farm_id_c"
                value={formData.farm_id_c}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                <option value="">Select a farm</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>
                    {farm.Name} ({farm.size_c} {farm.unit_c})
                  </option>
                ))}
              </Select>

              <Input
label="Crop Type"
                name="type_c"
                value={formData.type_c}
                onChange={handleChange}
                placeholder="e.g., Corn, Wheat, Tomatoes"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
label="Planting Date"
                  name="planting_date_c"
                  type="date"
                  value={formData.planting_date_c}
                  onChange={handleChange}
                  required
                />
<Input
                  label="Expected Harvest Date"
                  name="expected_harvest_date_c"
                  type="date"
                  value={formData.expected_harvest_date_c}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
label="Area (acres)"
                  name="area_c"
                  type="number"
                  value={formData.area_c}
                  onChange={handleChange}
                  placeholder="Enter area"
                  min="0"
                  step="0.1"
                  required
                />
<Select
                  label="Status"
                  name="status_c"
                  value={formData.status_c}
                  onChange={handleChange}
                >
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="ready">Ready</option>
                  <option value="harvested">Harvested</option>
                </Select>
              </div>

              <Textarea
label="Notes (optional)"
                name="notes_c"
                value={formData.notes_c}
                onChange={handleChange}
                placeholder="Any additional notes about this crop..."
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
                      Add Crop
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

export default AddCropModal;