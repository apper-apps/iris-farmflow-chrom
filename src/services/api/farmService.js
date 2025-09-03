import farmsData from "@/services/mockData/farms.json";

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class FarmService {
  constructor() {
    this.farms = [...farmsData];
  }

  async getAll() {
    await delay();
    return [...this.farms];
  }

  async getById(id) {
    await delay();
    const farm = this.farms.find(f => f.Id === parseInt(id));
    if (!farm) {
      throw new Error("Farm not found");
    }
    return { ...farm };
  }

  async create(farmData) {
    await delay();
    const maxId = Math.max(...this.farms.map(f => f.Id), 0);
    const newFarm = {
      ...farmData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    this.farms.push(newFarm);
    return { ...newFarm };
  }

  async update(id, farmData) {
    await delay();
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Farm not found");
    }
    this.farms[index] = { ...this.farms[index], ...farmData };
    return { ...this.farms[index] };
  }

  async delete(id) {
    await delay();
    const index = this.farms.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Farm not found");
    }
    const deletedFarm = this.farms.splice(index, 1)[0];
    return { ...deletedFarm };
  }
}

export const farmService = new FarmService();