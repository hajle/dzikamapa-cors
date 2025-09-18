export function formatValue(inputValue: string) {
	// Remove all non-digits
	let digits = inputValue.replace(/\D/g, '');

	// Limit to 6 digits
	if (digits.length > 6) {
		digits = digits.substring(0, 6);
	}

	// Add space after 3rd digit
	if (digits.length > 3) {
		return digits.substring(0, 3) + ' ' + digits.substring(3);
	}

	return digits;
}

export function handleInput(value: string, event: { target: { value: string } }) {
	const formattedValue = formatValue(event.target.value);
	event.target.value = formattedValue;

	// Update the bound value (raw digits only)
	value = formattedValue.replace(/\s/g, '');
}
