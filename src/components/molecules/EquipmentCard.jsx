import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EquipmentCard = ({ equipment, onClick }) => {
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const getFarmName = () => {
    if (equipment.FarmId_c?.Name) {
      return equipment.FarmId_c.Name;
    }
    return 'No Farm Assigned';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary cursor-pointer">
        <div onClick={() => onClick?.(equipment)} className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Truck" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                  {equipment.Name || 'Unnamed Equipment'}
                </h3>
                <p className="text-sm text-gray-600">
                  {equipment.Type_c || 'Equipment'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(equipment.Cost_c)}
              </p>
              <p className="text-xs text-gray-500">Purchase Cost</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="MapPin" size={16} className="text-gray-400" />
              <span>{getFarmName()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Calendar" size={16} className="text-gray-400" />
              <span>Purchased: {formatDate(equipment.PurchaseDate_c)}</span>
            </div>

            {equipment.Notes_c && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <ApperIcon name="FileText" size={16} className="text-gray-400 mt-0.5" />
                <p className="line-clamp-2">{equipment.Notes_c}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {equipment.Tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {equipment.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit equipment:', equipment);
            }}
          >
            <ApperIcon name="Edit" size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('View equipment details:', equipment);
            }}
          >
            <ApperIcon name="Eye" size={14} className="mr-1" />
            View
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default EquipmentCard;