import tasksData from "@/services/mockData/tasks.json";

// Simulate API delay
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay();
    return [...this.tasks];
  }

  async getById(id) {
    await delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByFarmId(farmId) {
    await delay();
    return this.tasks.filter(t => t.farmId === parseInt(farmId)).map(t => ({ ...t }));
  }

  async getByCropId(cropId) {
    await delay();
    return this.tasks.filter(t => t.cropId === parseInt(cropId)).map(t => ({ ...t }));
  }

  async create(taskData) {
    await delay();
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks[index] = { ...this.tasks[index], ...taskData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async markComplete(id, completed = true) {
    await delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks[index].completed = completed;
return { ...this.tasks[index] };
  }

  async getTasksDueSoon(daysAhead = 1) {
    await delay();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    targetDate.setHours(23, 59, 59, 999); // End of target day
    
    const now = new Date();
    
    return this.tasks.filter(task => {
      if (task.completed) return false;
      
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= targetDate;
    }).map(task => ({ ...task }));
  }
}

export const taskService = new TaskService();