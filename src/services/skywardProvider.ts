import { MOCK_DATA } from '../data/mockGrades';
import { AcademicData } from '../types';
import { PlatformProvider } from './interfaces';

export const SkywardProvider: PlatformProvider = {
  async login(credentials: any): Promise<boolean> {
    const { username, password } = credentials;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'test' && password === '1') {
          resolve(true);
        } else {
          reject(new Error('Invalid credentials.'));
        }
      }, 1000); 
    });
  },

  async fetchData(): Promise<AcademicData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DATA), 1000);
    });
  }
};