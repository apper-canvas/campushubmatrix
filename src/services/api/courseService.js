import courseData from '../mockData/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CourseService {
  constructor() {
    this.courses = [...courseData];
  }

  async getAll() {
    await delay(300);
    return [...this.courses];
  }

  async getById(id) {
    await delay(200);
    const course = this.courses.find(c => c.id === id);
    return course ? { ...course } : null;
  }

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      id: Date.now().toString(),
      enrollmentCount: 0
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    this.courses[index] = { ...this.courses[index], ...updates };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    this.courses.splice(index, 1);
    return true;
  }

  async getStats() {
    await delay(200);
    const totalCourses = this.courses.length;
    const totalEnrollment = this.courses.reduce((sum, c) => sum + c.enrollmentCount, 0);
    const avgEnrollment = totalEnrollment / totalCourses;
    const utilization = this.courses.reduce((sum, c) => sum + (c.enrollmentCount / c.capacity), 0) / totalCourses;
    
    return {
      total: totalCourses,
      totalEnrollment,
      averageEnrollment: Math.round(avgEnrollment),
      utilization: Math.round(utilization * 100)
    };
  }
}

export const courseService = new CourseService();