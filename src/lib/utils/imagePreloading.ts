/**
 * Image preloading utilities for MapContainer component
 * Handles preloading of animal images for instant popup display
 */

/**
 * Generate array of all animal species IDs (1 through 60)
 * @returns Array of animal species IDs [1, 2, 3, ..., 60]
 */
const getAllAnimalSpeciesIds = (): number[] => {
	return Array.from({ length: 60 }, (_, i) => i + 1);
};

/**
 * Preload all animal images for instant popup display
 * @param _polygonData - Optional GeoJSON FeatureCollection (kept for compatibility, but not used)
 * @returns Promise that resolves when all images are processed (success or failure)
 */
export const preloadAnimalImages = async (): Promise<void> => {
	const animalSpeciesIds = getAllAnimalSpeciesIds();
	let successCount = 0;
	let failCount = 0;

	console.log(`Preloading ${animalSpeciesIds.length} animal images...`);

	const imagePromises = animalSpeciesIds.map((id) => {
		return new Promise<void>((resolve) => {
			const img = new Image();

			// Set a timeout for each image (5 seconds)
			const timeout = setTimeout(() => {
				console.warn(`Timeout preloading: /zwierzaki/${id}.webp`);
				failCount++;
				resolve();
			}, 5000);

			img.onload = () => {
				clearTimeout(timeout);
				successCount++;
				resolve();
			};

			img.onerror = () => {
				clearTimeout(timeout);
				console.warn(`Failed to preload: /zwierzaki/${id}.webp`);
				failCount++;
				resolve();
			};

			img.src = `/zwierzaki/${id}.webp`;
		});
	});

	await Promise.all(imagePromises);

	console.log(`Animal image preloading complete: ${successCount} success, ${failCount} failed`);
};
