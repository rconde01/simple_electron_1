import { contextBridge } from 'electron';

const api = {
  platform: process.platform,
  versions: process.versions
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
