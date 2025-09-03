import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mb-4"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading your farm data...</h3>
        <p className="text-gray-600">Please wait while we gather your information</p>
      </motion.div>
    </div>
  );
};

export default Loading;