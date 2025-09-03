import weatherData from "@/services/mockData/weather.json";

// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

class WeatherService {
  constructor() {
    this.weather = { ...weatherData };
  }

  async getCurrentWeather() {
    await delay();
    // Simulate slight variations in temperature and conditions
    const variations = [-2, -1, 0, 1, 2];
    const tempVariation = variations[Math.floor(Math.random() * variations.length)];
    
    return {
      ...this.weather,
      temperature: this.weather.temperature + tempVariation,
      humidity: Math.max(20, Math.min(80, this.weather.humidity + (Math.random() * 10 - 5))),
      windSpeed: Math.max(0, this.weather.windSpeed + (Math.random() * 6 - 3))
    };
  }

  async getForecast(days = 5) {
    await delay();
    return [...this.weather.forecast].slice(0, days);
  }

  async getWeatherAlerts() {
    await delay();
    // Mock weather alerts based on conditions
    const alerts = [];
    
    if (this.weather.condition === "rainy" || this.weather.condition === "stormy") {
      alerts.push({
        type: "warning",
        title: "Heavy Rain Warning",
        message: "Avoid field work for the next 24 hours. Risk of soil compaction and equipment damage."
      });
    }
    
    if (this.weather.temperature > 35) {
      alerts.push({
        type: "advisory",
        title: "Heat Advisory",
        message: "Extreme heat conditions. Ensure adequate hydration for workers and livestock."
      });
    }
    
    if (this.weather.temperature < 5) {
      alerts.push({
        type: "warning",
        title: "Frost Warning",
        message: "Protect sensitive crops from frost damage. Consider covering plants overnight."
      });
    }
    
    return alerts;
  }
}

export const weatherService = new WeatherService();