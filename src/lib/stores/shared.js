import { writable } from 'svelte/store';

export const APP_HEIGHT = writable(undefined);
export const MAP_WIDTH = writable(undefined);
export const CENTER_ON = writable("europe");

export const csvData = writable(undefined);
export const dataReady = writable(false);
export const selectedLanguage = writable({ value: 'en', label: 'English' });

export const MOUSE = writable(undefined);
MOUSE.set({ 
  x: 0, 
  y: 0,
  tooltip: {}
});