import transactionsData from "@/services/mockData/transactions.json";

// Simulate API delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await delay();
    return [...this.transactions];
  }

  async getById(id) {
    await delay();
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return { ...transaction };
  }

  async getByFarmId(farmId) {
    await delay();
    return this.transactions.filter(t => t.farmId === parseInt(farmId)).map(t => ({ ...t }));
  }

  async getByCropId(cropId) {
    await delay();
    return this.transactions.filter(t => t.cropId === parseInt(cropId)).map(t => ({ ...t }));
  }

  async getByType(type) {
    await delay();
    return this.transactions.filter(t => t.type === type).map(t => ({ ...t }));
  }

  async create(transactionData) {
    await delay();
    const maxId = Math.max(...this.transactions.map(t => t.Id), 0);
    const newTransaction = {
      ...transactionData,
      Id: maxId + 1
    };
    this.transactions.unshift(newTransaction); // Add to beginning for recent-first ordering
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    this.transactions[index] = { ...this.transactions[index], ...transactionData };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    const deletedTransaction = this.transactions.splice(index, 1)[0];
    return { ...deletedTransaction };
  }
}

export const transactionService = new TransactionService();