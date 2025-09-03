import cropsData from "@/services/mockData/crops.json";

// Simulate API delay
const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    await delay();
    return [...this.crops];
  }

  async getById(id) {
    await delay();
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  }

  async getByFarmId(farmId) {
    await delay();
    return this.crops.filter(c => c.farmId === parseInt(farmId)).map(c => ({ ...c }));
  }

  async create(cropData) {
    await delay();
    const maxId = Math.max(...this.crops.map(c => c.Id), 0);
    const newCrop = {
      ...cropData,
      Id: maxId + 1
    };
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await delay();
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    this.crops[index] = { ...this.crops[index], ...cropData };
    return { ...this.crops[index] };
  }

  async delete(id) {
    await delay();
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    const deletedCrop = this.crops.splice(index, 1)[0];
    return { ...deletedCrop };
  }
}

export const cropService = new CropService();