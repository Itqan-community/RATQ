import type { ResourceSource } from './types';
import { ratqNativeSource } from './ratq-native';
import { cmsSource } from './cms';
import { payloadSource } from './payload';

// Add a new source here (and its own file in this folder) to bring in another
// data provider - e.g. Quran Apps Directory, or a third party's own API.
//
// ratq-native (mock data) is opt-in only, off by default, so the production
// catalog never mixes placeholder entries with real CMS/Payload resources -
// set NEXT_PUBLIC_INCLUDE_MOCK_SOURCE=true locally to bring it back for
// offline dev/demos. See .env.example.
const includeMockSource = process.env.NEXT_PUBLIC_INCLUDE_MOCK_SOURCE === 'true';

export const SOURCES: ResourceSource[] = includeMockSource
  ? [ratqNativeSource, cmsSource, payloadSource]
  : [cmsSource, payloadSource];
