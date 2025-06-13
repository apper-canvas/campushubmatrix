import announcementData from '../mockData/announcements.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnnouncementService {
  constructor() {
    this.announcements = [...announcementData];
  }

  async getAll() {
    await delay(300);
    return [...this.announcements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const announcement = this.announcements.find(a => a.id === id);
    return announcement ? { ...announcement } : null;
  }

  async create(announcementData) {
    await delay(400);
    const newAnnouncement = {
      ...announcementData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      author: 'Admin User'
    };
    this.announcements.unshift(newAnnouncement);
    return { ...newAnnouncement };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Announcement not found');
    
    this.announcements[index] = { ...this.announcements[index], ...updates };
    return { ...this.announcements[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.announcements.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Announcement not found');
    
    this.announcements.splice(index, 1);
    return true;
  }

  async getRecent(limit = 5) {
    await delay(200);
    return [...this.announcements]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

export const announcementService = new AnnouncementService();