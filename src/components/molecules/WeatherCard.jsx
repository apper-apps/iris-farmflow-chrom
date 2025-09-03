import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      "sunny": "Sun",
      "cloudy": "Cloud",
      "rainy": "CloudRain",
      "stormy": "Zap",
      "partly-cloudy": "CloudSun",
      "snow": "Snowflake"
    };
    return iconMap[condition] || "Sun";
  };

  const getConditionColor = (condition) => {
    const colorMap = {
      "sunny": "text-yellow-500",
      "cloudy": "text-gray-500",
      "rainy": "text-blue-500",
      "stormy": "text-purple-500",
      "partly-cloudy": "text-orange-400",
      "snow": "text-blue-300"
    };
    return colorMap[condition] || "text-gray-500";
  };

  if (!weather) {
    return (
      <Card className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-12 bg-gray-200 rounded w-20"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="gradient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
          <ApperIcon 
            name={getWeatherIcon(weather.condition)} 
            size={32} 
            className={getConditionColor(weather.condition)}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-gray-900">{weather.temperature}°C</p>
            <p className="text-sm text-gray-600 capitalize">{weather.condition.replace("-", " ")}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.windSpeed} km/h</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-600 mb-1">{day.day}</p>
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={16} 
                  className={`mx-auto mb-1 ${getConditionColor(day.condition)}`}
                />
                <p className="text-xs font-medium">{day.high}°</p>
                <p className="text-xs text-gray-500">{day.low}°</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;