// Simple event emitter implementation for browser
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  off(event: string, callback: Function) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    return this;
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return false;
    this.events[event].forEach(callback => callback(...args));
    return true;
  }
}

// Mock Socket implementation
class MockSocket extends SimpleEventEmitter {
  connected = false;
  private alertInterval: number | null = null;

  connect() {
    this.connected = true;
    console.log('Socket connected');
    this.startAlertSimulation();
  }

  disconnect() {
    this.connected = false;
    if (this.alertInterval) {
      window.clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
    console.log('Socket disconnected');
  }

  // Simulate real-time alerts
  private startAlertSimulation() {
    if (this.alertInterval) {
      window.clearInterval(this.alertInterval);
    }

    this.alertInterval = window.setInterval(() => {
      if (this.connected) {
        const randomIndex = Math.floor(Math.random() * mockDisasters.length);
        const alert = {
          ...mockDisasters[randomIndex],
          id: `alert-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        
        this.emit('new-alert', alert);
      }
    }, 60000); // Send new alert every minute
  }

  // Method to manually trigger an alert (for testing)
  triggerAlert(type: string) {
    const alertOfType = mockDisasters.find(d => d.type === type);
    if (alertOfType && this.connected) {
      const alert = {
        ...alertOfType,
        id: `manual-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      this.emit('new-alert', alert);
      return alert;
    }
    return null;
  }
}

import { mockDisasters } from '../data/mockDisasters';
export const mockSocket = new MockSocket();