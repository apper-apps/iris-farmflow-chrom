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
    title_c: "",
    farm_id_c: "",
    crop_id_c: "",
    type_c: initialType,
    category_c: "",
    amount_c: "",
    date_c: new Date().toISOString().split('T')[0],
    description_c: ""
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
if (formData.farm_id_c) {
      const farmCrops = crops.filter(crop => crop.farm_id_c === parseInt(formData.farm_id_c));
      setFilteredCrops(farmCrops);
      setFormData(prev => ({ ...prev, crop_id_c: "" }));
    } else {
      setFilteredCrops([]);
    }
  }, [formData.farm_id_c, crops]);

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
    
if (!formData.title_c || !formData.farm_id_c || !formData.category_c || !formData.amount_c || !formData.date_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.amount_c) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
const newTransaction = await transactionService.create({
        title_c: formData.title_c.trim(),
        farm_id_c: parseInt(formData.farm_id_c),
        crop_id_c: formData.crop_id_c ? parseInt(formData.crop_id_c) : null,
        type_c: formData.type_c,
        category_c: formData.category_c,
        amount_c: parseFloat(formData.amount_c),
        date_c: formData.date_c,
        description_c: formData.description_c.trim()
      });
      
      onTransactionAdded(newTransaction);
toast.success(`${formData.type_c === 'income' ? 'Income' : 'Expense'} recorded successfully!`);
setFormData({
        title_c: "",
        farm_id_c: "",
        crop_id_c: "",
        type_c: initialType,
        category_c: "",
        amount_c: "",
        date_c: new Date().toISOString().split('T')[0],
        description_c: ""
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
...(name === 'type_c' && { category_c: "" }) // Reset category when type changes
    }));
  };

const currentCategories = formData.type_c === "income" ? incomeCategories : expenseCategories;

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
variant={formData.type_c === 'expense' ? 'primary' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, type_c: 'expense', category_c: '' }))}
                  className="flex-1"
                  size="sm"
                >
                  Expense
                </Button>
                <Button
                  type="button"
variant={formData.type_c === 'income' ? 'primary' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, type_c: 'income', category_c: '' }))}
                  className="flex-1"
                  size="sm"
                >
                  Income
                </Button>
              </div>
{/* Title Field */}
              <div className="space-y-2">
                <Input
                  label="Title*"
                  name="title_c"
                  value={formData.title_c}
                  onChange={handleChange}
                  placeholder="Enter transaction title"
                  className="w-full"
                />
              </div>
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
                    {farm.Name}
                  </option>
                ))}
              </Select>

              <Select
                label="Crop (optional)"
name="crop_id_c"
                value={formData.crop_id_c}
                onChange={handleChange}
                disabled={!formData.farm_id_c}
              >
<option value="">Select a crop (optional)</option>
                {filteredCrops.map(crop => (
                  <option key={crop.Id} value={crop.Id}>
                    {crop.type_c} ({crop.area_c} acres)
                  </option>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Select
label="Category"
                  name="category_c"
                  value={formData.category_c}
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
                  name="amount_c"
                  type="number"
                  value={formData.amount_c}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <Input
label="Date"
                name="date_c"
                type="date"
                value={formData.date_c}
                onChange={handleChange}
                required
              />

              <Textarea
label="Description (optional)"
                name="description_c"
                value={formData.description_c}
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