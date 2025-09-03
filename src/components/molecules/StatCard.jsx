import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = "primary",
  trend = "neutral"
}) => {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 text-primary",
    secondary: "from-secondary/10 to-secondary/5 text-secondary",
    accent: "from-accent/10 to-accent/5 text-accent",
    success: "from-green-500/10 to-green-500/5 text-green-600",
    warning: "from-orange-500/10 to-orange-500/5 text-orange-600",
    error: "from-red-500/10 to-red-500/5 text-red-600"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  const trendIcons = {
    up: "TrendingUp",
    down: "TrendingDown",
    neutral: "Minus"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            {change && (
              <div className={`flex items-center text-sm ${trendColors[trend]}`}>
                <ApperIcon name={trendIcons[trend]} size={16} className="mr-1" />
                {change}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;