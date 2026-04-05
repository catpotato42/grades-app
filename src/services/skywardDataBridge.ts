import { MOCK_DATA } from '../data/mockGrades';
import { AcademicData } from '../types';

export const SkywardDataBridge = {
  //fetches from mock courses for now, scraper later
  async login(state: string, district: string, username: string, password: string): Promise<AcademicData> {
    return new Promise((resolve, reject) => {
      //state and district doesn't matter for now
      //Simulating some time for the scraper to parse and return html
      setTimeout(() => {
        if (username === 'test' && password === '1') {
          resolve(MOCK_DATA);
        } else {
          reject(new Error('Invalid Skyward credentials. Please try again.'));
        }
      }, 1000); 
    });
  },

  //useful for pull to refresh
  async refreshData(): Promise<AcademicData> {
    // Logic for re-triggering the scraper would go here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DATA); // Simulating a successful refresh
      }, 1000);
    });
  }
};