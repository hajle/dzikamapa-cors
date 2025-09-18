/**
 * Form validation utilities for animal adoption forms
 * Extracted from MapContainer for reusability and testability
 */

export interface FormState {
	animalName: string;
	isValid: boolean;
	hasError: boolean;
	animalSpeciesId: number | null;
}

/**
 * Validates an animal name input
 * @param name - The animal name to validate
 * @returns true if the name is valid (non-empty after trimming), false otherwise
 */
export const validateAnimalName = (name: string): boolean => {
	return name.trim().length > 0;
};

/**
 * Resets a form state object to its initial values
 * @param formState - The form state object to reset (modified in place)
 */
export const resetFormState = (formState: FormState): void => {
	formState.animalName = '';
	formState.isValid = false;
	formState.hasError = false;
	formState.animalSpeciesId = null;
};
