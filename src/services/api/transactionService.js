class TransactionService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
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
        console.error("Error fetching transactions:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions:", error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } }
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
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching transaction with ID ${id}:`, error);
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
          { field: { Name: "title_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } }
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
        console.error("Error fetching transactions by farm:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions by farm:", error);
      }
      throw error;
    }
  }

  async getByCropId(cropId) {
    try {
      const params = {
        fields: [
{ field: { Name: "Id" } },
          { field: { Name: "title_c" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } }
        ],
        where: [
          {
            FieldName: "crop_id_c",
            Operator: "EqualTo",
            Values: [parseInt(cropId)]
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
        console.error("Error fetching transactions by crop:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions by crop:", error);
      }
      throw error;
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
{ field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
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
        console.error("Error fetching transactions by type:", error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions by type:", error);
      }
      throw error;
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [
          {
            // Only include Updateable fields
Name: transactionData.Name || transactionData.title_c || transactionData.description,
            Tags: transactionData.Tags || "",
            farm_id_c: parseInt(transactionData.farm_id_c || transactionData.farmId),
            crop_id_c: transactionData.crop_id_c || transactionData.cropId ? parseInt(transactionData.crop_id_c || transactionData.cropId) : null,
            type_c: transactionData.type_c || transactionData.type,
            category_c: transactionData.category_c || transactionData.category,
            amount_c: parseFloat(transactionData.amount_c || transactionData.amount),
            date_c: transactionData.date_c || transactionData.date,
            description_c: transactionData.description_c || transactionData.description
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
          console.error(`Failed to create transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating transaction:", error?.response?.data?.message);
      } else {
        console.error("Error creating transaction:", error);
      }
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
// Only include Updateable fields
            title_c: transactionData.title_c,
            Name: transactionData.Name || transactionData.description,
            Tags: transactionData.Tags || "",
            farm_id_c: parseInt(transactionData.farm_id_c || transactionData.farmId),
            crop_id_c: transactionData.crop_id_c || transactionData.cropId ? parseInt(transactionData.crop_id_c || transactionData.cropId) : null,
            type_c: transactionData.type_c || transactionData.type,
            category_c: transactionData.category_c || transactionData.category,
            amount_c: parseFloat(transactionData.amount_c || transactionData.amount),
            date_c: transactionData.date_c || transactionData.date,
            description_c: transactionData.description_c || transactionData.description
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
          console.error(`Failed to update transactions ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating transaction:", error?.response?.data?.message);
      } else {
        console.error("Error updating transaction:", error);
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
          console.error(`Failed to delete transactions ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
      } else {
        console.error("Error deleting transaction:", error);
      }
      throw error;
    }
  }
}

export const transactionService = new TransactionService();