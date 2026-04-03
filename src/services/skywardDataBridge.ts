import { MOCK_DATA } from '../data/mockGrades'; // Make sure your path is correct
import { SkywardData } from '../types'; // Import the new wrapper type from your index.ts

export const SkywardDataBridge = {
  //fetches from mock courses for now, scraper later
  async login(username: string, password: string): Promise<SkywardData> {
    return new Promise((resolve, reject) => {
      //Simulating some time for the scraper to parse and return html
      setTimeout(() => {
        if (username === 'test' && password === '123') {
          resolve(MOCK_DATA); // <-- Returning the new object here
        } else {
          reject(new Error('Invalid Skyward credentials. Please try again.'));
        }
      }, 1000); 
    });
  },

  //useful for pull to refresh
  async refreshData(): Promise<SkywardData> {
    // Logic for re-triggering the scraper would go here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DATA); // Simulating a successful refresh
      }, 1000);
    });
  }
};