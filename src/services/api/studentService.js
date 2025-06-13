import studentData from '../mockData/students.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StudentService {
  constructor() {
    this.students = [...studentData];
  }

  async getAll() {
    await delay(300);
    return [...this.students];
  }

  async getById(id) {
    await delay(200);
    const student = this.students.find(s => s.id === id);
    return student ? { ...student } : null;
  }

  async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      enrolledCourses: studentData.enrolledCourses || []
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    this.students[index] = { ...this.students[index], ...updates };
    return { ...this.students[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    
    this.students.splice(index, 1);
    return true;
  }

  async searchByName(query) {
    await delay(200);
    const filtered = this.students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    return [...filtered];
  }

  async filterByProgram(program) {
    await delay(250);
    const filtered = this.students.filter(student =>
      student.program.toLowerCase() === program.toLowerCase()
    );
    return [...filtered];
  }

  async getStats() {
    await delay(200);
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'Active').length;
    const avgGpa = this.students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents;
    
    return {
      total: totalStudents,
      active: activeStudents,
      averageGpa: parseFloat(avgGpa.toFixed(2))
    };
  }
}

export const studentService = new StudentService();