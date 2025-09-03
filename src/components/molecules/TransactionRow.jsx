import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TransactionRow = ({ transaction, crop, farm }) => {
const isIncome = (transaction.type_c || transaction.type) === "income";
  const amount = parseFloat(transaction.amount_c || transaction.amount);

  const getCategoryIcon = (category) => {
    const iconMap = {
      seeds: "Sprout",
      fertilizer: "Leaf",
      equipment: "Wrench",
      labor: "Users",
      fuel: "Fuel",
      maintenance: "Settings",
      harvest: "Package",
      sales: "DollarSign",
      other: "Circle"
    };
    return iconMap[category] || "Circle";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}>
          <ApperIcon 
name={isIncome ? "TrendingUp" : getCategoryIcon(transaction.category_c || transaction.category)} 
            size={18}
          />
        </div>
        <div>
<p className="font-medium text-gray-900">{transaction.description_c || transaction.description || transaction.category_c || transaction.category}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
<span>{farm?.Name}</span>
            {crop && (
              <>
                <span>•</span>
                <span>{crop.type_c}</span>
              </>
            )}
            <span>•</span>
<span>
              {(() => {
                const date = new Date(transaction.date_c || transaction.date);
                return date && !isNaN(date.getTime()) ? format(date, "MMM d, yyyy") : "Invalid date";
              })()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`text-lg font-semibold ${
          isIncome ? "text-green-600" : "text-red-600"
        }`}>
          {isIncome ? "+" : "-"}${amount.toFixed(2)}
        </p>
        <Badge variant={isIncome ? "success" : "error"} size="sm">
{transaction.category_c || transaction.category}
        </Badge>
      </div>
    </motion.div>
  );
};

export default TransactionRow;