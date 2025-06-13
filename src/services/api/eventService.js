import eventData from '../mockData/events.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EventService {
  constructor() {
    this.events = [...eventData];
  }

  async getAll() {
    await delay(300);
    return [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getById(id) {
    await delay(200);
    const event = this.events.find(e => e.id === id);
    return event ? { ...event } : null;
  }

  async create(eventData) {
    await delay(400);
    const newEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    
    this.events[index] = { ...this.events[index], ...updates };
    return { ...this.events[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    
    this.events.splice(index, 1);
    return true;
  }

  async getUpcoming(limit = 5) {
    await delay(200);
    const now = new Date();
    return [...this.events]
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  }
}

export const eventService = new EventService();