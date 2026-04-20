import * as SecureStore from 'expo-secure-store';
import { AcademicData } from '../types';
import { SkywardProvider } from './skywardProvider';
import { CanvasProvider } from './canvasProvider';

export const SyncManager = {
  refreshData: async (): Promise<AcademicData> => {
    const platform = await SecureStore.getItemAsync('ACTIVE_PLATFORM');
    if (!platform) throw new Error("No active platform session.");

    let provider;
    if (platform === 'SKYWARD') provider = SkywardProvider;
    if (platform === 'CANVAS') provider = CanvasProvider;
    else throw new Error("Unknown platform.");

    return await provider.fetchData();
  }
};