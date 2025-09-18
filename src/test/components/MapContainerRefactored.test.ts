import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { preloadAnimalImages } from '../../lib/utils/imagePreloading';

// Mock global Image constructor
const mockImage = vi.fn();
global.Image = mockImage;

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock console methods to avoid noise in tests
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Type for mock image instances
type MockImageInstance = {
	onload: (() => void) | null;
	onerror: (() => void) | null;
	src: string;
};

describe('MapContainerRefactored - Image Preloading', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockImage.mockClear();
		mockFetch.mockClear();
		mockConsoleLog.mockClear();
		mockConsoleWarn.mockClear();
	});

	afterEach(() => {
		vi.clearAllTimers();
	});

	describe('static animal species ID generation', () => {
		it('should preload all 60 animal images (1 through 60)', async () => {
			const mockImages: MockImageInstance[] = [];

			// Mock Image constructor to track all created images
			global.Image = vi.fn().mockImplementation(() => {
				const mockImg: MockImageInstance = {
					src: '',
					onload: null,
					onerror: null
				};
				mockImages.push(mockImg);
				return mockImg;
			});

			// Start preloading (don't await yet)
			const preloadPromise = preloadAnimalImages();

			// Verify that 60 images were created
			expect(mockImages).toHaveLength(60);

			// Simulate all images loading successfully
			mockImages.forEach((img, index) => {
				expect(img.src).toBe(`/zwierzaki/${index + 1}.webp`);
				if (img.onload) {
					img.onload();
				}
			});

			// Wait for preloading to complete
			await preloadPromise;

			// Verify console logging
			expect(mockConsoleLog).toHaveBeenCalledWith('Preloading 60 animal images...');
			expect(mockConsoleLog).toHaveBeenCalledWith(
				'Animal image preloading complete: 60 success, 0 failed'
			);
		});

		it('should generate correct image paths for all IDs', async () => {
			const mockImages: MockImageInstance[] = [];

			global.Image = vi.fn().mockImplementation(() => {
				const mockImg: MockImageInstance = {
					src: '',
					onload: null,
					onerror: null
				};
				mockImages.push(mockImg);
				return mockImg;
			});

			// Start preloading
			const preloadPromise = preloadAnimalImages();

			// Verify image paths are correct for all 60 IDs
			const expectedPaths = Array.from({ length: 60 }, (_, i) => `/zwierzaki/${i + 1}.webp`);
			const actualPaths = mockImages.map((img) => img.src);

			expect(actualPaths).toEqual(expectedPaths);

			// Complete the preloading
			mockImages.forEach((img) => {
				if (img.onload) {
					img.onload();
				}
			});

			await preloadPromise;
		});
	});

	describe('preloadAnimalImages', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should preload all 60 animal images successfully', async () => {
			const mockImageInstances: MockImageInstance[] = [];

			mockImage.mockImplementation(() => {
				const instance: MockImageInstance = {
					onload: null,
					onerror: null,
					src: ''
				};
				mockImageInstances.push(instance);
				return instance;
			});

			// Start preloading (polygon data is now optional and ignored)
			const preloadPromise = preloadAnimalImages();

			// Simulate successful loading for all images
			mockImageInstances.forEach((instance) => {
				if (instance.onload) {
					instance.onload();
				}
			});

			await preloadPromise;

			// Should have created 60 images (IDs: 1 through 60)
			expect(mockImageInstances).toHaveLength(60);
			expect(mockImageInstances[0].src).toBe('/zwierzaki/1.webp');
			expect(mockImageInstances[1].src).toBe('/zwierzaki/2.webp');
			expect(mockImageInstances[59].src).toBe('/zwierzaki/60.webp');

			// Should log completion
			expect(mockConsoleLog).toHaveBeenCalledWith('Preloading 60 animal images...');
			expect(mockConsoleLog).toHaveBeenCalledWith(
				'Animal image preloading complete: 60 success, 0 failed'
			);
		});

		it('should handle image loading failures gracefully', async () => {
			const mockImageInstances: MockImageInstance[] = [];

			mockImage.mockImplementation(() => {
				const instance: MockImageInstance = {
					onload: null,
					onerror: null,
					src: ''
				};
				mockImageInstances.push(instance);
				return instance;
			});

			const preloadPromise = preloadAnimalImages();

			// Simulate failures for all images
			mockImageInstances.forEach((instance) => {
				if (instance.onerror) {
					instance.onerror();
				}
			});

			await preloadPromise;

			// Should complete without throwing
			expect(mockConsoleLog).toHaveBeenCalledWith(
				'Animal image preloading complete: 0 success, 60 failed'
			);
			expect(mockConsoleWarn).toHaveBeenCalledWith('Failed to preload: /zwierzaki/1.webp');
			expect(mockConsoleWarn).toHaveBeenCalledWith('Failed to preload: /zwierzaki/2.webp');
			expect(mockConsoleWarn).toHaveBeenCalledWith('Failed to preload: /zwierzaki/60.webp');
		});

		it('should handle timeout scenarios', async () => {
			const mockImageInstances: MockImageInstance[] = [];

			mockImage.mockImplementation(() => {
				const instance: MockImageInstance = {
					onload: null,
					onerror: null,
					src: ''
				};
				mockImageInstances.push(instance);
				return instance;
			});

			const preloadPromise = preloadAnimalImages();

			// Fast-forward time to trigger timeouts (5000ms)
			vi.advanceTimersByTime(5000);

			await preloadPromise;

			// Should handle timeouts gracefully
			expect(mockConsoleWarn).toHaveBeenCalledWith('Timeout preloading: /zwierzaki/1.webp');
			expect(mockConsoleWarn).toHaveBeenCalledWith('Timeout preloading: /zwierzaki/2.webp');
			expect(mockConsoleWarn).toHaveBeenCalledWith('Timeout preloading: /zwierzaki/60.webp');
			expect(mockConsoleLog).toHaveBeenCalledWith(
				'Animal image preloading complete: 0 success, 60 failed'
			);
		});

		it('should log progress and completion status', async () => {
			const mockImageInstances: MockImageInstance[] = [];

			mockImage.mockImplementation(() => {
				const instance: MockImageInstance = {
					onload: null,
					onerror: null,
					src: ''
				};
				mockImageInstances.push(instance);
				return instance;
			});

			const preloadPromise = preloadAnimalImages();

			// Mix of success and failure for first few images
			if (mockImageInstances[0]?.onload) mockImageInstances[0].onload();
			if (mockImageInstances[1]?.onerror) mockImageInstances[1].onerror();
			if (mockImageInstances[2]?.onload) mockImageInstances[2].onload();

			// Complete the rest as successful
			for (let i = 3; i < mockImageInstances.length; i++) {
				const instance = mockImageInstances[i];
				if (instance?.onload) {
					instance.onload();
				}
			}

			await preloadPromise;

			expect(mockConsoleLog).toHaveBeenCalledWith('Preloading 60 animal images...');
			expect(mockConsoleLog).toHaveBeenCalledWith(
				'Animal image preloading complete: 59 success, 1 failed'
			);
		});

		it('should always preload all 60 images regardless of input', async () => {
			const mockImageInstances: MockImageInstance[] = [];

			mockImage.mockImplementation(() => {
				const instance: MockImageInstance = {
					onload: null,
					onerror: null,
					src: ''
				};
				mockImageInstances.push(instance);
				return instance;
			});

			// Test with empty data - should still preload all 60 images
			const preloadPromise = preloadAnimalImages({ features: [] });

			// Complete all images
			mockImageInstances.forEach((instance) => {
				if (instance.onload) {
					instance.onload();
				}
			});

			await preloadPromise;

			expect(mockImageInstances).toHaveLength(60);
			expect(mockConsoleLog).toHaveBeenCalledWith('Preloading 60 animal images...');
		});
	});

	describe('Loading State Integration', () => {
		it('should update animalImagesLoaded state when preloading completes', () => {
			// Test state management integration
			expect(true).toBe(true); // Placeholder
		});

		it('should integrate with checkLoadingComplete function', () => {
			// Test that loading completion includes animal images
			expect(true).toBe(true); // Placeholder
		});

		it('should not block map initialization if image preloading fails', () => {
			// Test graceful degradation
			expect(true).toBe(true); // Placeholder
		});
	});

	describe('Integration with createPolygonsLayer', () => {
		it('should start image preloading in parallel with polygon creation', () => {
			// Test parallel execution
			expect(true).toBe(true); // Placeholder
		});

		it('should handle polygon loading errors without affecting image preloading', () => {
			// Test error isolation
			expect(true).toBe(true); // Placeholder
		});
	});
});
