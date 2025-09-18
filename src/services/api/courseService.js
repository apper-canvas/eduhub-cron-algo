const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'course_c';

// Field visibility mapping for course_c table
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'course_code_c', 'title_c', 'credits_c', 'department_c', 
  'semester_c', 'year_c', 'capacity_c', 'enrolled_c', 'instructor_c', 
'schedule_c', 'room_c', 'phone_c', 'email_c', 'website_c', 'amount_c'
];

const ALL_FIELDS = [
'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'course_code_c', 'title_c', 'credits_c', 'department_c', 'semester_c', 'year_c', 
  'capacity_c', 'enrolled_c', 'instructor_c', 'schedule_c', 'room_c', 'phone_c', 
  'email_c', 'website_c', 'amount_c'
];
export const courseService = {
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
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch courses");
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Course with ID ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Course not found");
    }
  },

  async create(courseData) {
    try {
      // Only include updateable fields
const createData = {
        Name: courseData.Name || courseData.title_c || courseData.title || "Course",
        Tags: courseData.Tags || "",
        course_code_c: courseData.course_code_c || courseData.courseCode || "",
        title_c: courseData.title_c || courseData.title || "",
        credits_c: parseInt(courseData.credits_c || courseData.credits || 0),
        department_c: courseData.department_c || courseData.department || "",
        semester_c: courseData.semester_c || courseData.semester || "Spring",
        year_c: parseInt(courseData.year_c || courseData.year || new Date().getFullYear()),
        capacity_c: parseInt(courseData.capacity_c || courseData.capacity || 0),
        enrolled_c: parseInt(courseData.enrolled_c || courseData.enrolled || 0),
        instructor_c: courseData.instructor_c || courseData.instructor || "",
        schedule_c: courseData.schedule_c || courseData.schedule || "",
        room_c: courseData.room_c || courseData.room || "",
        phone_c: courseData.phone_c || courseData.phone || "",
        email_c: courseData.email_c || courseData.email || "",
        website_c: courseData.website_c || courseData.website || "",
        amount_c: courseData.amount_c ? parseFloat(courseData.amount_c) : (courseData.amount ? parseFloat(courseData.amount) : null)
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
          console.error(`Failed to create ${failed.length} courses:`, failed);
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
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to create course");
    }
  },

  async update(id, courseData) {
    try {
      // Only include updateable fields
      const updateFields = {
Id: parseInt(id),
        Name: courseData.Name || courseData.title_c || courseData.title,
        Tags: courseData.Tags || "",
        course_code_c: courseData.course_code_c || courseData.courseCode,
        title_c: courseData.title_c || courseData.title,
        credits_c: parseInt(courseData.credits_c || courseData.credits),
        department_c: courseData.department_c || courseData.department,
        semester_c: courseData.semester_c || courseData.semester,
        year_c: parseInt(courseData.year_c || courseData.year),
        capacity_c: parseInt(courseData.capacity_c || courseData.capacity),
        enrolled_c: parseInt(courseData.enrolled_c || courseData.enrolled || 0),
        instructor_c: courseData.instructor_c || courseData.instructor,
        schedule_c: courseData.schedule_c || courseData.schedule,
        room_c: courseData.room_c || courseData.room,
        phone_c: courseData.phone_c || courseData.phone,
        email_c: courseData.email_c || courseData.email,
        website_c: courseData.website_c || courseData.website,
        amount_c: courseData.amount_c ? parseFloat(courseData.amount_c) : (courseData.amount ? parseFloat(courseData.amount) : null)
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
          console.error(`Failed to update ${failed.length} courses:`, failed);
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
      console.error(`Error updating course ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to update course");
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
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to delete course");
    }
  }
};