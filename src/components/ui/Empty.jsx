import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  buttonText = "Add Item",
  onAction,
  icon = "Plus"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={36} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{message}</p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name={icon} size={18} className="mr-2" />
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;