import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await weatherService.getCurrentWeather();
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

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

  const getConditionBackground = (condition) => {
    const bgMap = {
      "sunny": "from-yellow-100 to-orange-100",
      "cloudy": "from-gray-100 to-gray-200",
      "rainy": "from-blue-100 to-cyan-100",
      "stormy": "from-purple-100 to-indigo-100",
      "partly-cloudy": "from-orange-100 to-yellow-100",
      "snow": "from-blue-50 to-cyan-50"
    };
    return bgMap[condition] || "from-gray-50 to-gray-100";
  };

  const getFarmingAdvice = (condition, temperature, humidity) => {
    if (condition === "rainy" || condition === "stormy") {
      return {
        title: "Not Ideal for Field Work",
        advice: "Avoid heavy machinery work and consider indoor tasks like equipment maintenance.",
        priority: "high"
      };
    } else if (condition === "sunny" && temperature > 30) {
      return {
        title: "Hot Weather Warning",
        advice: "Schedule outdoor work for early morning or evening. Ensure adequate hydration.",
        priority: "medium"
      };
    } else if (condition === "sunny" && humidity < 40) {
      return {
        title: "Good for Harvest",
        advice: "Ideal conditions for harvesting and drying crops. Low humidity prevents spoilage.",
        priority: "low"
      };
    } else if (temperature < 5) {
      return {
        title: "Frost Warning",
        advice: "Protect sensitive plants from frost. Consider covering crops overnight.",
        priority: "high"
      };
    }
    return {
      title: "Good Farming Conditions",
      advice: "Weather conditions are suitable for most outdoor farm activities.",
      priority: "low"
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWeatherData} />;

  const farmingAdvice = getFarmingAdvice(weather.condition, weather.temperature, weather.humidity);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Weather Dashboard</h1>
        <p className="text-gray-600">
          Current weather conditions and forecast to help plan your farm activities.
        </p>
      </div>

      {/* Current Weather - Large Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`bg-gradient-to-br ${getConditionBackground(weather.condition)} border-0`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Conditions */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <ApperIcon 
                  name={getWeatherIcon(weather.condition)} 
                  size={64} 
                  className={getConditionColor(weather.condition)}
                />
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-1">{weather.temperature}°C</h2>
                  <p className="text-lg text-gray-700 capitalize">
                    {weather.condition.replace("-", " ")}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-3">
                  <ApperIcon name="Droplets" size={20} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-lg font-semibold">{weather.humidity}%</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <ApperIcon name="Wind" size={20} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Wind</p>
                  <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <ApperIcon name="Eye" size={20} className="text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Visibility</p>
                  <p className="text-lg font-semibold">{weather.visibility || "10"} km</p>
                </div>
              </div>
            </div>

            {/* Farming Advice */}
            <div className="bg-white/70 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon 
                  name={farmingAdvice.priority === "high" ? "AlertTriangle" : 
                        farmingAdvice.priority === "medium" ? "Info" : "CheckCircle2"} 
                  size={24} 
                  className={farmingAdvice.priority === "high" ? "text-red-500" : 
                           farmingAdvice.priority === "medium" ? "text-orange-500" : "text-green-500"}
                />
                <h3 className="text-lg font-semibold text-gray-900">{farmingAdvice.title}</h3>
                <Badge 
                  variant={farmingAdvice.priority === "high" ? "error" : 
                          farmingAdvice.priority === "medium" ? "warning" : "success"} 
                  size="sm"
                >
                  {farmingAdvice.priority}
                </Badge>
              </div>
              <p className="text-gray-700">{farmingAdvice.advice}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="MapPin" size={14} />
                  <span>{weather.location}</span>
                  <span>•</span>
                  <ApperIcon name="Clock" size={14} />
                  <span>Updated {format(new Date(), "h:mm a")}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 5-Day Forecast */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {weather.forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <h4 className="font-medium text-gray-900 mb-3">{day.day}</h4>
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={32} 
                  className={`mx-auto mb-3 ${getConditionColor(day.condition)}`}
                />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-900">{day.high}°</p>
                  <p className="text-sm text-gray-600">{day.low}°</p>
                  <p className="text-xs text-gray-500 capitalize mt-2">
                    {day.condition.replace("-", " ")}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Details */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ApperIcon name="Thermometer" size={16} className="text-red-500" />
                <span className="text-gray-600">Feels Like</span>
              </div>
              <span className="font-medium">{weather.temperature + 2}°C</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ApperIcon name="Sun" size={16} className="text-yellow-500" />
                <span className="text-gray-600">UV Index</span>
              </div>
              <Badge variant="warning" size="sm">Moderate</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ApperIcon name="Gauge" size={16} className="text-blue-500" />
                <span className="text-gray-600">Pressure</span>
              </div>
              <span className="font-medium">1013 hPa</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <ApperIcon name="Sunrise" size={16} className="text-orange-500" />
                <span className="text-gray-600">Sunrise</span>
              </div>
              <span className="font-medium">6:24 AM</span>
            </div>
          </div>
        </Card>

        {/* Agricultural Alerts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agricultural Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <ApperIcon name="Droplets" size={16} className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-blue-900">Irrigation Recommended</p>
                <p className="text-xs text-blue-700">Low humidity levels detected. Consider watering sensitive crops.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <ApperIcon name="Sun" size={16} className="text-green-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-green-900">Perfect Growing Conditions</p>
                <p className="text-xs text-green-700">Temperature and humidity levels are ideal for plant growth.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <ApperIcon name="Wind" size={16} className="text-orange-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-orange-900">Moderate Wind Advisory</p>
                <p className="text-xs text-orange-700">Avoid spraying pesticides or herbicides today.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Weather;