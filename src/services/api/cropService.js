class CropService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "type_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "area_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        orderBy: [
          {
            fieldName: "planting_date_c",
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
        console.error("Error fetching crops:", error?.response?.data?.message);
      } else {
        console.error("Error fetching crops:", error);
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
          { field: { Name: "type_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "area_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
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
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching crop with ID ${id}:`, error);
      }
      throw error;
    }
  }

  async getByFarmId(farmId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "type_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "area_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        where: [
          {
            FieldName: "farm_id_c",
            Operator: "EqualTo",
            Values: [parseInt(farmId)]
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
        console.error("Error fetching crops by farm:", error?.response?.data?.message);
      } else {
        console.error("Error fetching crops by farm:", error);
      }
      throw error;
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
            Name: cropData.Name || cropData.type,
            Tags: cropData.Tags || "",
            type_c: cropData.type_c || cropData.type,
            planting_date_c: cropData.planting_date_c || cropData.plantingDate,
            expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
            status_c: cropData.status_c || cropData.status || "planted",
            area_c: parseFloat(cropData.area_c || cropData.area),
            notes_c: cropData.notes_c || cropData.notes || "",
            farm_id_c: parseInt(cropData.farm_id_c || cropData.farmId)
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
          console.error(`Failed to create crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating crop:", error?.response?.data?.message);
      } else {
        console.error("Error creating crop:", error);
      }
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            // Only include Updateable fields
            Name: cropData.Name || cropData.type,
            Tags: cropData.Tags || "",
            type_c: cropData.type_c || cropData.type,
            planting_date_c: cropData.planting_date_c || cropData.plantingDate,
            expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
            status_c: cropData.status_c || cropData.status,
            area_c: parseFloat(cropData.area_c || cropData.area),
            notes_c: cropData.notes_c || cropData.notes,
            farm_id_c: parseInt(cropData.farm_id_c || cropData.farmId)
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
          console.error(`Failed to update crops ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating crop:", error?.response?.data?.message);
      } else {
        console.error("Error updating crop:", error);
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
          console.error(`Failed to delete crops ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
      } else {
        console.error("Error deleting crop:", error);
      }
      throw error;
    }
  }
}

export const cropService = new CropService();