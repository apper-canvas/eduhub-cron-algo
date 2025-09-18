const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'student_c';

// Field visibility mapping for student_c table
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'first_name_c', 'last_name_c', 'email_c', 'phone_c', 
  'student_id_c', 'enrollment_date_c', 'major_c', 'year_c', 'status_c', 
  'gpa_c', 'gender_c', 'rating_c', 'amount_paid_c', 'hobbies_c'
];

const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'first_name_c', 'last_name_c', 'email_c', 'phone_c', 'student_id_c', 
  'enrollment_date_c', 'major_c', 'year_c', 'status_c', 'gpa_c', 'gender_c', 
  'rating_c', 'amount_paid_c', 'hobbies_c'
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
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
      console.error("Error fetching students:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch students");
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Student with ID ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Student not found");
    }
  },

  async create(studentData) {
    try {
      // Only include updateable fields
      const createData = {
        Name: `${studentData.first_name_c || studentData.firstName || ''} ${studentData.last_name_c || studentData.lastName || ''}`.trim(),
        first_name_c: studentData.first_name_c || studentData.firstName,
        last_name_c: studentData.last_name_c || studentData.lastName,
        email_c: studentData.email_c || studentData.email,
        phone_c: studentData.phone_c || studentData.phone,
        student_id_c: studentData.student_id_c || studentData.studentId,
        enrollment_date_c: studentData.enrollment_date_c || studentData.enrollmentDate || new Date().toISOString().split("T")[0],
        major_c: studentData.major_c || studentData.major,
        year_c: studentData.year_c || studentData.year,
        status_c: studentData.status_c || studentData.status || "Active",
        gpa_c: parseFloat(studentData.gpa_c || studentData.gpa || 0.0),
        gender_c: studentData.gender_c || studentData.gender,
        rating_c: parseInt(studentData.rating_c || studentData.rating || 0),
        amount_paid_c: parseFloat(studentData.amount_paid_c || studentData.amountPaid || 0.0),
        hobbies_c: studentData.hobbies_c || (Array.isArray(studentData.hobbies) ? studentData.hobbies.join(', ') : studentData.hobbies || "")
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
          console.error(`Failed to create ${failed.length} students:`, failed);
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
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to create student");
    }
  },

  async update(id, studentData) {
    try {
      // Only include updateable fields
      const updateFields = {
        Id: parseInt(id),
        Name: `${studentData.first_name_c || studentData.firstName || ''} ${studentData.last_name_c || studentData.lastName || ''}`.trim(),
        first_name_c: studentData.first_name_c || studentData.firstName,
        last_name_c: studentData.last_name_c || studentData.lastName,
        email_c: studentData.email_c || studentData.email,
        phone_c: studentData.phone_c || studentData.phone,
        student_id_c: studentData.student_id_c || studentData.studentId,
        major_c: studentData.major_c || studentData.major,
        year_c: studentData.year_c || studentData.year,
        status_c: studentData.status_c || studentData.status,
        gpa_c: parseFloat(studentData.gpa_c || studentData.gpa || 0),
        gender_c: studentData.gender_c || studentData.gender,
        rating_c: parseInt(studentData.rating_c || studentData.rating || 0),
        amount_paid_c: parseFloat(studentData.amount_paid_c || studentData.amountPaid || 0),
        hobbies_c: studentData.hobbies_c || (Array.isArray(studentData.hobbies) ? studentData.hobbies.join(', ') : studentData.hobbies || "")
      };

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
          console.error(`Failed to update ${failed.length} students:`, failed);
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
      console.error(`Error updating student ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to update student");
    }
  },

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
          console.error(`Failed to delete ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to delete student");
    }
  }
};