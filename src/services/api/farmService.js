class FarmService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farm_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "size_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching farms:", error?.response?.data?.message);
      } else {
        console.error("Error fetching farms:", error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "size_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching farm with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching farm with ID ${id}:`, error);
      }
      throw error;
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
            Name: farmData.Name || farmData.name,
            Tags: farmData.Tags || "",
            size_c: parseFloat(farmData.size_c || farmData.size),
            unit_c: farmData.unit_c || farmData.unit,
            location_c: farmData.location_c || farmData.location,
            created_at_c: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create farms ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating farm:", error?.response?.data?.message);
      } else {
        console.error("Error creating farm:", error);
      }
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            // Only include Updateable fields
            Name: farmData.Name || farmData.name,
            Tags: farmData.Tags || "",
            size_c: parseFloat(farmData.size_c || farmData.size),
            unit_c: farmData.unit_c || farmData.unit,
            location_c: farmData.location_c || farmData.location
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update farms ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating farm:", error?.response?.data?.message);
      } else {
        console.error("Error updating farm:", error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete farms ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting farm:", error?.response?.data?.message);
      } else {
        console.error("Error deleting farm:", error);
      }
      throw error;
    }
  }
}

export const farmService = new FarmService();