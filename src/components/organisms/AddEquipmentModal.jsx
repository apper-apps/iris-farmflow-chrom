import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { equipmentService } from "@/services/api/equipmentService";
import { farmService } from "@/services/api/farmService";

const AddEquipmentModal = ({ isOpen, onClose, onEquipmentAdded }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Type_c: '',
    PurchaseDate_c: '',
    Cost_c: '',
    FarmId_c: '',
    Notes_c: '',
    Tags: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load farms when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFarms();
      resetForm();
    }
  }, [isOpen]);

  const loadFarms = async () => {
    try {
      setFarmsLoading(true);
      const farmsData = await farmService.getAll();
      setFarms(farmsData || []);
    } catch (error) {
      console.error('Error loading farms:', error);
      toast.error('Failed to load farms');
    } finally {
      setFarmsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Type_c: '',
      PurchaseDate_c: '',
      Cost_c: '',
      FarmId_c: '',
      Notes_c: '',
      Tags: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Equipment name is required';
    }
    
    if (!formData.Type_c.trim()) {
      newErrors.Type_c = 'Equipment type is required';
    }
    
    if (formData.Cost_c && isNaN(parseFloat(formData.Cost_c))) {
      newErrors.Cost_c = 'Please enter a valid cost amount';
    }
    
    if (formData.PurchaseDate_c) {
      const purchaseDate = new Date(formData.PurchaseDate_c);
      const today = new Date();
      if (purchaseDate > today) {
        newErrors.PurchaseDate_c = 'Purchase date cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      
      const equipmentData = {
        ...formData,
        Cost_c: formData.Cost_c ? parseFloat(formData.Cost_c) : 0,
        FarmId_c: formData.FarmId_c ? parseInt(formData.FarmId_c) : null,
        PurchaseDate_c: formData.PurchaseDate_c || null
      };
      
      const newEquipment = await equipmentService.create(equipmentData);
      
      if (newEquipment) {
        toast.success('Equipment added successfully!');
        onEquipmentAdded?.(newEquipment);
        onClose();
        resetForm();
      } else {
        toast.error('Failed to add equipment. Please try again.');
      }
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast.error('An error occurred while adding the equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Truck" size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Add Equipment</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
            >
              <ApperIcon name="X" size={18} />
            </Button>
          </div>
          
          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Equipment Name *"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              error={errors.Name}
              placeholder="Enter equipment name"
              disabled={loading}
            />
            
            <Input
              label="Type *"
              name="Type_c"
              value={formData.Type_c}
              onChange={handleInputChange}
              error={errors.Type_c}
              placeholder="e.g., Tractor, Harvester, Irrigation System"
              disabled={loading}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Purchase Date"
                name="PurchaseDate_c"
                type="date"
                value={formData.PurchaseDate_c}
                onChange={handleInputChange}
                error={errors.PurchaseDate_c}
                disabled={loading}
              />
              
              <Input
                label="Cost"
                name="Cost_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.Cost_c}
                onChange={handleInputChange}
                error={errors.Cost_c}
                placeholder="0.00"
                disabled={loading}
              />
            </div>
            
            <Select
              label="Assign to Farm"
              name="FarmId_c"
              value={formData.FarmId_c}
              onChange={handleInputChange}
              error={errors.FarmId_c}
              disabled={loading || farmsLoading}
            >
              <option value="">Select a farm (optional)</option>
              {farms.map(farm => (
                <option key={farm.Id} value={farm.Id}>
                  {farm.Name}
                </option>
              ))}
            </Select>
            
            <Input
              label="Tags"
              name="Tags"
              value={formData.Tags}
              onChange={handleInputChange}
              placeholder="farming, machinery, irrigation (comma-separated)"
              disabled={loading}
            />
            
            <Textarea
              label="Notes"
              name="Notes_c"
              value={formData.Notes_c}
              onChange={handleInputChange}
              placeholder="Additional notes about this equipment..."
              rows={3}
              disabled={loading}
            />
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading && <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />}
                {loading ? 'Adding...' : 'Add Equipment'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEquipmentModal;