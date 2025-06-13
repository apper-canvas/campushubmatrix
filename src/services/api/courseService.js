const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CourseService {
  constructor() {
    this.tableName = 'course';
  }

  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'code', 'instructor', 'enrollment_count', 'capacity', 'schedule_days', 'schedule_time', 'room']
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'code', 'instructor', 'enrollment_count', 'capacity', 'schedule_days', 'schedule_time', 'room']
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }
  }

  async create(courseData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: courseData.name || courseData.Name,
          code: courseData.code,
          instructor: courseData.instructor,
          enrollment_count: courseData.enrollment_count || 0,
          capacity: courseData.capacity,
          schedule_days: Array.isArray(courseData.schedule?.days) ? courseData.schedule.days.join(',') : (courseData.schedule_days || ''),
          schedule_time: courseData.schedule?.time || courseData.schedule_time,
          room: courseData.room
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  async update(id, updates) {
    await delay(350);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          Name: updates.name || updates.Name,
          code: updates.code,
          instructor: updates.instructor,
          enrollment_count: updates.enrollment_count,
          capacity: updates.capacity,
          schedule_days: Array.isArray(updates.schedule?.days) ? updates.schedule.days.join(',') : (updates.schedule_days || ''),
          schedule_time: updates.schedule?.time || updates.schedule_time,
          room: updates.room
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  }

  async delete(id) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }

  async getStats() {
    await delay(200);
    try {
      const courses = await this.getAll();
      const totalCourses = courses.length;
      const totalEnrollment = courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);
      const avgEnrollment = totalEnrollment / totalCourses;
      const utilization = courses.reduce((sum, c) => sum + ((c.enrollment_count || 0) / (c.capacity || 1)), 0) / totalCourses;
      
      return {
        total: totalCourses,
        totalEnrollment,
        averageEnrollment: Math.round(avgEnrollment),
        utilization: Math.round(utilization * 100)
      };
    } catch (error) {
      console.error("Error getting course stats:", error);
      throw error;
    }
  }
}

export const courseService = new CourseService();