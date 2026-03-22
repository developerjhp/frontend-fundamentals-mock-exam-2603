// Delete XMLHttpRequest before any imports to force Axios to use http adapter
delete (globalThis as any).XMLHttpRequest;

// Set XMLHttpRequest to undefined to prevent Axios from using XHR adapter
(globalThis as any).XMLHttpRequest = undefined;

// Save the original localStorage before any imports if it exists
const originalLocalStorage = (globalThis as any).localStorage;

import '@testing-library/jest-dom/vitest';
import { server } from './src/_tosslib/server/node';
import { resetData } from './src/_tosslib/server/handlers';
import { beforeAll, afterAll, afterEach } from 'vitest';

// Restore or create localStorage for MSW compatibility
if (originalLocalStorage && typeof originalLocalStorage.getItem === 'function') {
  // localStorage already exists from jsdom
  (globalThis as any).localStorage = originalLocalStorage;
} else {
  // Create a mock storage if jsdom's isn't available
  const mockStorage: Record<string, string> = {};
  (globalThis as any).localStorage = Object.create(Object.prototype, {
    getItem: { value: (key: string) => mockStorage[key] ?? null },
    setItem: { value: (key: string, value: string) => { mockStorage[key] = String(value); } },
    removeItem: { value: (key: string) => { delete mockStorage[key]; } },
    clear: { value: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); } },
    length: { get: () => Object.keys(mockStorage).length },
    key: { value: (index: number) => Object.keys(mockStorage)[index] ?? null },
  });
}

// Canvas mock for lottie-web
HTMLCanvasElement.prototype.getContext = (() => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Array(w * h * 4),
    }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  };
}) as any;

HTMLCanvasElement.prototype.toDataURL = () => '';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
  server.resetHandlers();
  resetData();
});
afterAll(() => {
  server.close();
});
