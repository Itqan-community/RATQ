import type { ResourceSource } from './types';
import { ratqNativeSource } from './ratq-native';
import { cmsSource } from './cms';
import { payloadSource } from './payload';

// Add a new source here (and its own file in this folder) to bring in another
// data provider - e.g. Quran Apps Directory, or a third party's own API.
export const SOURCES: ResourceSource[] = [ratqNativeSource, cmsSource, payloadSource];
