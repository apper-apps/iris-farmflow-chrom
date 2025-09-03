import React from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CropCard = ({ crop, farm }) => {
  const getStatusColor = (status) => {
    const colors = {
      planted: "info",
      growing: "warning",
      ready: "success",
      harvested: "primary"
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      planted: "Sprout",
      growing: "Leaf",
      ready: "CheckCircle2",
      harvested: "Package"
    };
    return icons[status] || "Circle";
  };

  const getDaysUntilHarvest = () => {
const today = new Date();
    const harvestDate = new Date(crop.expected_harvest_date_c);
    return differenceInDays(harvestDate, today);
  };

  const daysLeft = getDaysUntilHarvest();
const progress = Math.max(0, Math.min(100, 
    ((new Date() - new Date(crop.planting_date_c)) / 
    (new Date(crop.expected_harvest_date_c) - new Date(crop.planting_date_c))) * 100
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
<h3 className="text-lg font-semibold text-gray-900 mb-1">{crop.type_c}</h3>
<p className="text-sm text-gray-600">{farm?.Name}</p>
          </div>
<Badge variant={getStatusColor(crop.status_c)} size="md">
            <ApperIcon name={getStatusIcon(crop.status_c)} size={14} />
            {crop.status_c.charAt(0).toUpperCase() + crop.status_c.slice(1)}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Planted:</span>
<span className="font-medium">{format(new Date(crop.planting_date_c), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Expected Harvest:</span>
<span className="font-medium">{format(new Date(crop.expected_harvest_date_c), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Area:</span>
<span className="font-medium">{crop.area_c} acres</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Growth Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <ApperIcon name="Calendar" size={14} className="text-gray-500" />
            <span className={`font-medium ${daysLeft < 0 ? "text-red-600" : daysLeft < 7 ? "text-orange-600" : "text-gray-700"}`}>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
               daysLeft === 0 ? "Ready today!" : 
               `${daysLeft} days left`}
            </span>
          </div>
{crop.notes_c && (
            <ApperIcon name="FileText" size={14} className="text-gray-400" title={crop.notes_c} />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CropCard;