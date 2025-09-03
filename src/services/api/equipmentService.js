class EquipmentService {
  constructor() {
    this.tableName = 'equipment_c';
    
    // Initialize ApperClient
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Type_c" } },
          { field: { Name: "PurchaseDate_c" } },
          { field: { Name: "Cost_c" } },
          { field: { Name: "Notes_c" } },
          { field: { Name: "FarmId_c" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching equipment:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching equipment:", error?.response?.data?.message);
      } else {
        console.error("Error fetching equipment:", error);
      }
      return [];
    }
  }

  async getById(equipmentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Type_c" } },
          { field: { Name: "PurchaseDate_c" } },
          { field: { Name: "Cost_c" } },
          { field: { Name: "Notes_c" } },
          { field: { Name: "FarmId_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, equipmentId, params);
      
      if (!response.success) {
        console.error("Error fetching equipment by ID:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching equipment by ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching equipment by ID:", error);
      }
      return null;
    }
  }

  async create(equipmentData) {
    try {
      // Only include updateable fields
      const params = {
        records: [
          {
            Name: equipmentData.Name || '',
            Tags: equipmentData.Tags || '',
            Type_c: equipmentData.Type_c || '',
            PurchaseDate_c: equipmentData.PurchaseDate_c || null,
            Cost_c: parseFloat(equipmentData.Cost_c) || 0,
            FarmId_c: equipmentData.FarmId_c ? parseInt(equipmentData.FarmId_c) : null,
            Notes_c: equipmentData.Notes_c || ''
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating equipment:", response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} equipment records:${JSON.stringify(failedRecords)}`);
          return null;
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating equipment:", error?.response?.data?.message);
      } else {
        console.error("Error creating equipment:", error);
      }
      return null;
    }
  }

  async update(equipmentId, equipmentData) {
    try {
      // Only include updateable fields
      const params = {
        records: [
          {
            Id: parseInt(equipmentId),
            Name: equipmentData.Name || '',
            Tags: equipmentData.Tags || '',
            Type_c: equipmentData.Type_c || '',
            PurchaseDate_c: equipmentData.PurchaseDate_c || null,
            Cost_c: parseFloat(equipmentData.Cost_c) || 0,
            FarmId_c: equipmentData.FarmId_c ? parseInt(equipmentData.FarmId_c) : null,
            Notes_c: equipmentData.Notes_c || ''
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating equipment:", response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} equipment records:${JSON.stringify(failedUpdates)}`);
          return null;
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating equipment:", error?.response?.data?.message);
      } else {
        console.error("Error updating equipment:", error);
      }
      return null;
    }
  }

  async delete(equipmentIds) {
    try {
      const params = {
        RecordIds: Array.isArray(equipmentIds) ? equipmentIds : [equipmentIds]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting equipment:", response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} equipment records:${JSON.stringify(failedDeletions)}`);
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting equipment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting equipment:", error);
      }
      return false;
    }
  }
}

export const equipmentService = new EquipmentService();