/**
 * Device detection composable for determining desktop vs mobile devices
 * 
 * Uses touch capability detection and screen size to determine device type.
 * Desktop devices are defined as having no touch capability AND screen width >= 768px.
 */

/**
 * Return type for the device detection composable
 */
interface DeviceDetection {
	isDesktop: () => boolean;
}

/**
 * Device detection composable
 * @returns {DeviceDetection} Object containing device detection functions
 */
export function useDeviceDetection(): DeviceDetection {
	/**
	 * Check if the current device is a desktop device
	 * 
	 * A device is considered desktop if:
	 * - It has no touch capability (no ontouchstart property and maxTouchPoints is 0)
	 * - AND it has a large screen (width >= 768px, matching Tailwind's md breakpoint)
	 * 
	 * @returns {boolean} True if device is desktop, false if mobile/tablet
	 */
	const isDesktop = (): boolean => {
		// Check for touch capability
		const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		
		// Check screen size (768px is Tailwind's md breakpoint)
		const hasLargeScreen = window.innerWidth >= 768;
		
		// Desktop = no touch AND large screen
		return !hasTouch && hasLargeScreen;
	};

	return {
		isDesktop
	};
}
