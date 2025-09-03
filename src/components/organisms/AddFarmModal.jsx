import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { farmService } from "@/services/api/farmService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const AddFarmModal = ({ isOpen, onClose, onFarmAdded, farm, editMode = false }) => {
const [formData, setFormData] = useState({
    Name: "",
    size_c: "",
    unit_c: "acres",
    location_c: ""
  });
  
  // Populate form when editing
  useEffect(() => {
    if (editMode && farm) {
      setFormData({
        Name: farm.Name || "",
        size_c: farm.size_c ? farm.size_c.toString() : "",
        unit_c: farm.unit_c || "acres",
        location_c: farm.location_c || ""
      });
    } else if (!editMode) {
      setFormData({
        Name: "",
        size_c: "",
        unit_c: "acres",
        location_c: ""
      });
    }
  }, [editMode, farm, isOpen]);
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim() || !formData.size_c || isNaN(parseFloat(formData.size_c)) || !formData.location_c.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const farmData = {
        Name: formData.Name.trim(),
        size_c: parseFloat(formData.size_c),
        unit_c: formData.unit_c,
        location_c: formData.location_c.trim(),
        created_at_c: editMode ? farm.created_at_c : new Date().toISOString()
      };

      let result;
      if (editMode) {
        result = await farmService.update(farm.Id, farmData);
        toast.success("Farm updated successfully!");
      } else {
        result = await farmService.create(farmData);
        toast.success("Farm added successfully!");
      }
      
      onFarmAdded(result);
      if (!editMode) {
        setFormData({ Name: "", size_c: "", unit_c: "acres", location_c: "" });
      }
      onClose();
    } catch (error) {
      toast.error("Failed to add farm");
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
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b">
<h3 className="text-lg font-semibold text-gray-900">
                {editMode ? "Edit Farm" : "Add New Farm"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
<Input
                label="Farm Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Enter farm name"
                required
              />

              <div className="grid grid-cols-2 gap-4">
<Input
                  label="Size"
                  name="size_c"
                  type="number"
                  value={formData.size_c}
                  onChange={handleChange}
                  placeholder="Enter size"
                  min="0"
                  step="0.1"
                  required
                />
<Select
                  label="Unit"
                  name="unit_c"
                  value={formData.unit_c}
                  onChange={handleChange}
                >
<option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </Select>
              </div>

<Input
                label="Location"
                name="location_c"
                value={formData.location_c}
                onChange={handleChange}
                placeholder="Enter farm location"
                required
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
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
{editMode ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <ApperIcon name={editMode ? "Save" : "Plus"} size={16} className="mr-2" />
                      {editMode ? "Update Farm" : "Add Farm"}
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

export default AddFarmModal;