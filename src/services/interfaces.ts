import { AcademicData } from '../types';

export interface PlatformProvider {
  login(credentials: any): Promise<boolean>;
  fetchData(): Promise<AcademicData>;
}