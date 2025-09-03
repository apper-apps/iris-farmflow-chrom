import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded, initialType = "expense" }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    type: initialType,
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const expenseCategories = [
    "seeds", "fertilizer", "equipment", "labor", "fuel", "maintenance", "other"
  ];
  
  const incomeCategories = [
    "harvest", "sales", "subsidies", "other"
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [isOpen, initialType]);

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
    
    if (!formData.farmId || !formData.category || !formData.amount || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTransaction = await transactionService.create({
        farmId: parseInt(formData.farmId),
        cropId: formData.cropId ? parseInt(formData.cropId) : null,
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description.trim()
      });
      
      onTransactionAdded(newTransaction);
      toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} recorded successfully!`);
      setFormData({
        farmId: "",
        cropId: "",
        type: initialType,
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        description: ""
      });
      onClose();
    } catch (error) {
      toast.error("Failed to record transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: "" }) // Reset category when type changes
    }));
  };

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

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
              <h3 className="text-lg font-semibold text-gray-900">
                Add {formData.type === 'income' ? 'Income' : 'Expense'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.type === 'expense' ? 'primary' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                  className="flex-1"
                  size="sm"
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={formData.type === 'income' ? 'primary' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                  className="flex-1"
                  size="sm"
                >
                  Income
                </Button>
              </div>

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
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {currentCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Amount ($)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <Textarea
                label="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Any additional details about this transaction..."
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
                      Recording...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Record {formData.type === 'income' ? 'Income' : 'Expense'}
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

export default AddTransactionModal;