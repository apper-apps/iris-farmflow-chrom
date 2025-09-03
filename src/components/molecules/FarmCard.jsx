import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const FarmCard = ({ farm, cropCount = 0, activeTaskCount = 0, onClick, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer hover:shadow-lg" onClick={() => onClick(farm)}>
        <div className="flex items-start justify-between mb-4">
<div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{farm.Name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
<ApperIcon name="MapPin" size={14} />
              {farm.location_c}
            </p>
</div>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <ApperIcon name="Tractor" size={24} className="text-primary" />
          </div>
        </div>
        
        {/* Farm Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Size:</span>
            <span className="font-medium">{farm.size_c} {farm.unit_c}</span>
          </div>
          {farm.created_at_c && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">{format(new Date(farm.created_at_c), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="Sprout" size={14} />
            <span>{cropCount} crops</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="CheckSquare" size={14} />
            <span>{activeTaskCount} tasks</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(farm);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit" size={14} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(farm);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
            Delete
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
<div className="text-center p-3 bg-gradient-to-br from-surface to-white rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{farm.size_c}</p>
            <p className="text-sm text-gray-600">{farm.unit_c}</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-surface to-white rounded-lg">
            <p className="text-2xl font-bold text-primary">{cropCount}</p>
            <p className="text-sm text-gray-600">Active Crops</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={14} />
            <span>{activeTaskCount} pending tasks</span>
          </div>
          <div className="flex items-center gap-1">
<ApperIcon name="Calendar" size={14} />
            <span>Est. {format(new Date(farm.created_at_c || farm.createdAt), "MMM yyyy")}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default FarmCard;