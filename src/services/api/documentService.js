const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'document_c';

// Simulate async operations with realistic delays
// Field visibility mapping for document_c table
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'title_c', 'description_c', 'category_c', 
  'file_name_c', 'file_size_c', 'file_type_c', 'file_url_c', 
  'upload_date_c', 'status_c', 'uploaded_by_c', 'last_modified_c', 
  'student_id_c'
];

const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title_c', 'description_c', 'category_c', 'file_name_c', 'file_size_c', 
  'file_type_c', 'file_url_c', 'upload_date_c', 'status_c', 'uploaded_by_c', 
  'last_modified_c', 'student_id_c'
];

export const documentService = {
  // Get all documents
  async getAll() {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch documents");
    }
  },

  // Get document by ID
  async getById(id) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Document with ID ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || `Document with ID ${id} not found`);
    }
  },

  // Get documents by student ID
  async getByStudentId(studentId) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
        where: [{ FieldName: "student_id_c", Operator: "EqualTo", Values: [parseInt(studentId)] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching documents for student ${studentId}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch student documents");
    }
  },

  // Create new document
  async create(documentData) {
    try {
      // Only include updateable fields
      const createData = {
        Name: documentData.title_c || documentData.title || "Document",
        title_c: documentData.title_c || documentData.title,
        description_c: documentData.description_c || documentData.description || "",
        category_c: documentData.category_c || documentData.category,
        student_id_c: parseInt(documentData.student_id_c || documentData.studentId),
        file_name_c: documentData.file_name_c || documentData.fileName,
        file_size_c: parseInt(documentData.file_size_c || documentData.fileSize || 0),
        file_type_c: documentData.file_type_c || documentData.fileType,
        file_url_c: documentData.file_url_c || documentData.fileUrl,
        upload_date_c: documentData.upload_date_c || documentData.uploadDate || new Date().toISOString(),
        status_c: documentData.status_c || documentData.status || "Active",
        uploaded_by_c: documentData.uploaded_by_c || documentData.uploadedBy || "System",
        last_modified_c: new Date().toISOString()
      };

      const params = { records: [createData] };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} documents:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating document:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to create document");
    }
  },

  // Update document
  async update(id, updateData) {
    try {
      // Only include updateable fields
      const updateFields = {
        Id: parseInt(id),
        Name: updateData.title_c || updateData.title,
        title_c: updateData.title_c || updateData.title,
        description_c: updateData.description_c || updateData.description,
        category_c: updateData.category_c || updateData.category,
        student_id_c: parseInt(updateData.student_id_c || updateData.studentId),
        status_c: updateData.status_c || updateData.status,
        last_modified_c: new Date().toISOString()
      };

      // Include file fields only if provided
      if (updateData.file_name_c || updateData.fileName) {
        updateFields.file_name_c = updateData.file_name_c || updateData.fileName;
      }
      if (updateData.file_size_c || updateData.fileSize) {
        updateFields.file_size_c = parseInt(updateData.file_size_c || updateData.fileSize);
      }
      if (updateData.file_type_c || updateData.fileType) {
        updateFields.file_type_c = updateData.file_type_c || updateData.fileType;
      }
      if (updateData.file_url_c || updateData.fileUrl) {
        updateFields.file_url_c = updateData.file_url_c || updateData.fileUrl;
      }

      const params = { records: [updateFields] };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} documents:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error(`Error updating document ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to update document");
    }
  },

  // Delete document
  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} documents:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to delete document");
    }
  }
};