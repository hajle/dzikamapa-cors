<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { Map as LeafletMap, LatLngTuple } from 'leaflet';
	import {
		POLAND_MAP_CONFIG,
		POLAND_BOUNDS,
		POLAND_IMAGE_BOUNDS,
		POLAND_BOUNDS_MOBILE,
		type PolygonProperties
	} from '$lib/types/map.js';
	import AdoptionModal from '../AdoptionModal.svelte';
	import { useDeviceDetection } from '$lib/composables/useDeviceDetection';
	import PopupContainer from './PopupContainer.svelte';
	import { validateAnimalName, resetFormState, type FormState } from '$lib/utils/formValidation';
	import { preloadAnimalImages } from '$lib/utils/imagePreloading';

	// Svelte 5 runes: props with proper typing and defaults
	let {
		height = '400px',
		enableControls = false,
		zoomControl = false,
		initialZoom = POLAND_MAP_CONFIG.zoom,
		fitToBounds = true,
		showLogo = false,
		center = POLAND_MAP_CONFIG.center
	}: {
		height?: string;
		enableControls?: boolean;
		zoomControl?: boolean;
		initialZoom?: number;
		fitToBounds?: boolean;
		showLogo?: boolean;
		center?: LatLngTuple;
	} = $props();

	// Consolidated state management
	let mapContainer: HTMLDivElement;

	// @ts-expect-error - Svelte 5 rune syntax
	let state = $state({
		map: null as LeafletMap | null,
		imageOverlay: null as import('leaflet').ImageOverlay | null,
		polygonsLayer: null as import('leaflet').GeoJSON | null,
		LeafletLib: null as typeof import('leaflet') | null,
		isLoading: true,
		imageLoaded: false,
		polygonsLoaded: false,
		animalImagesLoaded: false,
		forAdoptionPopup: {
			visible: false,
			pointId: null as number | null,
			animalSpeciesId: null as string | null,
			animalSpecies: null as string | null,
			animalSpeciesExt: null as string | null,
			animalDescription: null as string | null,
			isDesktop: false
		},
		initAdoptionPopup: {
			visible: false,
			pointId: null as number | null,
			animalSpeciesId: null as string | null,
			animalSpecies: null as string | null,
			animalSpeciesExt: null as string | null,
			animalDescription: null as string | null,
			isDesktop: false
		},
		adoptedPopup: {
			visible: false,
			animalSpeciesId: null as string | null,
			animalSpecies: null as string | null,
			animalName: null as string | null,
			isDesktop: false
		}
	});

	let handleResize: (() => void) | null = null;
	let resizeTimeout: ReturnType<typeof setTimeout>;

	// Adoption modal state
	let adoptionModal = $state({
		isOpen: false,
		pointId: null as number | null,
		animalSpeciesId: null as number | null,
		animalName: null as string | null
	});

	// INIT ADOPTION FORM STATE - Works for both desktop and mobile
	let initAdoptionFormState = $state({
		animalName: '',
		isValid: false,
		hasError: false,
		pointId: null as number | null,
		animalSpeciesId: null as number | null
	});

	// Form validation utilities - now using imported functions
	const resetInitAdoptionForm = () => {
		resetFormState(initAdoptionFormState);
	};

	// Modal handler functions
	const openAdoptionModal = (pointId: number, animalSpeciesId: number, animalName: string) => {
		adoptionModal.isOpen = true;
		adoptionModal.pointId = pointId;
		adoptionModal.animalSpeciesId = animalSpeciesId;
		adoptionModal.animalName = animalName;
	};

	const closeAdoptionModal = () => {
		adoptionModal.isOpen = false;
		adoptionModal.pointId = null;
		adoptionModal.animalSpeciesId = null;
		adoptionModal.animalName = null;
	};

	const showForAdoptionPopup = (
		pointId: number,
		animalSpeciesId: string,
		animalSpecies: string,
		animalSpeciesExt: string,
		animalDescription: string
	) => {
		state.forAdoptionPopup.visible = true;
		state.forAdoptionPopup.pointId = pointId;
		state.forAdoptionPopup.animalSpeciesId = animalSpeciesId;
		state.forAdoptionPopup.animalSpecies = animalSpecies;
		state.forAdoptionPopup.animalSpeciesExt = animalSpeciesExt;
		state.forAdoptionPopup.animalDescription = animalDescription;
	};

	const hideForAdoptionPopup = () => {
		state.forAdoptionPopup.visible = false;
		state.forAdoptionPopup.pointId = null;
		state.forAdoptionPopup.animalSpeciesId = null;
		state.forAdoptionPopup.animalSpecies = null;
		state.forAdoptionPopup.animalSpeciesExt = null;
	};

	const showInitAdoptionPopup = (
		pointId: number,
		animalSpeciesId: string,
		animalSpecies: string,
		animalSpeciesExt: string,
		animalDescription: string
	) => {
		state.initAdoptionPopup.visible = true;
		state.initAdoptionPopup.pointId = pointId;
		state.initAdoptionPopup.animalSpeciesId = animalSpeciesId;
		state.initAdoptionPopup.animalSpecies = animalSpecies;
		state.initAdoptionPopup.animalSpeciesExt = animalSpeciesExt;
		state.initAdoptionPopup.animalDescription = animalDescription;
		resetInitAdoptionForm();
		initAdoptionFormState.pointId = pointId;
		initAdoptionFormState.animalSpeciesId = animalSpeciesId;
	};

	const hideInitAdoptionPopup = () => {
		state.initAdoptionPopup.visible = false;
		state.initAdoptionPopup.pointId = null;
		state.initAdoptionPopup.animalSpeciesId = null;
		state.initAdoptionPopup.animalSpecies = null;
		state.initAdoptionPopup.animalSpeciesExt = null;
		state.initAdoptionPopup.animalDescription = null;
		resetInitAdoptionForm();
	};

	const showAdoptedPopup = (animalSpeciesId: string, animalSpecies: string, animalName: string) => {
		state.adoptedPopup.visible = true;
		state.adoptedPopup.animalSpeciesId = animalSpeciesId;
		state.adoptedPopup.animalSpecies = animalSpecies;
		state.adoptedPopup.animalName = animalName;
	};

	const hideAdoptedPopup = () => {
		state.adoptedPopup.visible = false;
		state.adoptedPopup.animalSpeciesId = null;
		state.adoptedPopup.animalSpecies = null;
		state.adoptedPopup.animalName = null;
	};

	// Handle mobile button click in forAdoptionPopup
	const handleMobileAdoptionClick = () => {
		const popup = state.forAdoptionPopup;

		if (
			popup.pointId !== null &&
			popup.animalSpeciesId !== null &&
			popup.animalSpecies !== null &&
			popup.animalSpeciesExt !== null &&
			popup.animalDescription !== null
		) {
			state.initAdoptionPopup.pointId = popup.pointId;
			state.initAdoptionPopup.animalSpeciesId = popup.animalSpeciesId;
			state.initAdoptionPopup.animalSpecies = popup.animalSpecies;
			state.initAdoptionPopup.animalSpeciesExt = popup.animalSpeciesExt;
			state.initAdoptionPopup.animalDescription = popup.animalDescription;

			hideForAdoptionPopup();

			showInitAdoptionPopup(
				state.initAdoptionPopup.pointId,
				state.initAdoptionPopup.animalSpeciesId,
				state.initAdoptionPopup.animalSpecies,
				state.initAdoptionPopup.animalSpeciesExt,
				state.initAdoptionPopup.animalDescription
			);
		} else {
			console.error('Missing required animal data in forAdoptionPopup state:', {
				pointId: popup.pointId,
				animalSpeciesId: popup.animalSpeciesId,
				animalSpecies: popup.animalSpecies,
				animalSpeciesExt: popup.animalSpeciesExt,
				animalDescription: popup.animalDescription
			});
		}
	};

	// INIT ADOPTION FORM VALIDATION EFFECT - Works for both desktop and mobile
	$effect(() => {
		if (state.initAdoptionPopup.visible && browser) {
			// Use a small delay to ensure DOM is updated
			setTimeout(() => {
				const adoptButtons = document.querySelectorAll('[id^="init-adopt-btn-"]');
				const nameInputs = document.querySelectorAll('[id^="init-name-input-"]');

				nameInputs.forEach((input) => {
					const inputId = input.id.replace('init-name-input-', '');
					const button = document.getElementById(`init-adopt-btn-${inputId}`) as HTMLButtonElement;

					const validateAndUpdateButton = () => {
						const value = (input as HTMLInputElement).value;
						const isValid = validateAnimalName(value);

						initAdoptionFormState.animalName = value;
						initAdoptionFormState.isValid = isValid;
						initAdoptionFormState.hasError = !isValid && value.length > 0;

						// Update input styling
						if (initAdoptionFormState.hasError) {
							input.classList.add('border-red-500');
							input.classList.remove('border-[#CCCDCF]');
						} else {
							input.classList.remove('border-red-500');
							input.classList.add('border-[#CCCDCF]');
						}

						// Update button state
						if (button) {
							if (isValid) {
								button.disabled = false;
								button.classList.remove('bg-gray-400', 'cursor-not-allowed');
								button.classList.add('bg-[#7FC241]', 'cursor-pointer');
							} else {
								button.disabled = true;
								button.classList.add('bg-gray-400', 'cursor-not-allowed');
								button.classList.remove('bg-[#7FC241]', 'cursor-pointer');
							}
						}
					};

					// Add input event listeners
					input.addEventListener('input', validateAndUpdateButton);
					input.addEventListener('blur', validateAndUpdateButton);
				});

				adoptButtons.forEach((button) => {
					const pointId = parseInt(button.id.replace('init-adopt-btn-', ''));
					const animalSpeciesId = state.initAdoptionPopup.animalSpeciesId;
					const handleClick = (e: Event) => {
						e.preventDefault();

						// Read current animal name at click time, not at closure creation time
						const currentAnimalName = initAdoptionFormState.animalName;
						if (initAdoptionFormState.isValid && currentAnimalName.trim()) {
							// Close init adoption popup
							hideInitAdoptionPopup();
							// Open adoption modal with animal name
							openAdoptionModal(pointId, animalSpeciesId, currentAnimalName);
						}
					};

					// Remove existing listeners to prevent duplicates
					button.removeEventListener('click', handleClick);
					// Add new listener
					button.addEventListener('click', handleClick);
				});
			}, 10);
		}
	});

	// Check if all required assets are loaded and update loading state
	const checkLoadingComplete = () => {
		if (state.imageLoaded && state.polygonsLoaded && state.animalImagesLoaded) {
			state.isLoading = false;
		}
	};

	// Device detection using composable
	const { isDesktop } = useDeviceDetection();

	// Get Leaflet library
	const getLeaflet = async () => {
		if (!state.LeafletLib) {
			state.LeafletLib = await import('leaflet');
		}
		return state.LeafletLib;
	};

	// UNIFIED POLYGON LAYER CREATION - Simplified event handling
	const createPolygonsLayer = async (L: typeof import('leaflet')) => {
		if (!state.map) return;

		try {
			// Fetch GeoJSON data from static directory
			const response = await fetch('/polygons.geojson');
			const polygons = await response.json();

			// Start preloading animal images in parallel with polygon creation
			const imagePreloadPromise = preloadAnimalImages();

			// Create GeoJSON layer with conditional styling based on adopted property
			state.polygonsLayer = L.geoJson(polygons, {
				pane: 'polygons',
				style: (feature) => {
					const isAdopted = feature?.properties?.adopted === true;
					return {
						fillColor: isAdopted ? '' : '#ffffff', // Transparent if adopted, white otherwise
						color: '#ffffff',
						weight: 0.5,
						fillOpacity: isAdopted ? 0 : 0.3 // 0.4 opacity if adopted, 0 otherwise
					};
				}
			}).addTo(state.map);

			// UNIFIED EVENT BINDING - Single approach for all polygons
			state.polygonsLayer.eachLayer((layer: import('leaflet').Layer) => {
				const geoJsonLayer = layer as L.GeoJSON & {
					feature: { properties: PolygonProperties };
					setStyle: (style: { fillOpacity: number }) => void;
					getBounds: () => import('leaflet').LatLngBounds;
				};
				if (geoJsonLayer.feature && geoJsonLayer.feature.properties) {
					const pointId = geoJsonLayer.feature.properties.point_id;
					const animalSpeciesId = geoJsonLayer.feature.properties.animal_species_id;
					const animalSpecies = geoJsonLayer.feature.properties.animal_species;
					const animalSpeciesExt = geoJsonLayer.feature.properties.animal_species_ext;
					const animalDescription = geoJsonLayer.feature.properties.animal_description;
					const isAdopted = geoJsonLayer.feature.properties.adopted === true;
					const animalName = geoJsonLayer.feature.properties.animal_name;

					// UNIFIED HOVER EVENTS - Visual effects and desktop adopted animal popups
					geoJsonLayer.on('mouseover', () => {
						geoJsonLayer.setStyle({ fillOpacity: 0 });

						const deviceIsDesktop = isDesktop();
						if (deviceIsDesktop && isAdopted) {
							showAdoptedPopup(animalSpeciesId, animalSpecies, animalName);
						} else if (deviceIsDesktop && !isAdopted && state.initAdoptionPopup.visible === false) {
							showForAdoptionPopup(
								pointId,
								animalSpeciesId,
								animalSpecies,
								animalSpeciesExt,
								animalDescription
							);
						}
					});

					geoJsonLayer.on('mouseout', () => {
						// Return to original opacity based on adopted state
						const originalOpacity = isAdopted ? 0 : 0.3;
						geoJsonLayer.setStyle({ fillOpacity: originalOpacity });

						// Hide popup on mouse out for desktop adopted animals
						const deviceIsDesktop = isDesktop();
						if (deviceIsDesktop && isAdopted) {
							hideAdoptedPopup();
						} else if (deviceIsDesktop && !isAdopted) {
							hideForAdoptionPopup();
						}
					});

					// UNIFIED CLICK EVENTS - Mobile/touch interaction and non-adopted animals
					geoJsonLayer.on('click', () => {
						const deviceIsDesktop = isDesktop();

						if (isAdopted) {
							// Adopted animals: desktop uses hover (handled above), mobile uses click
							if (!deviceIsDesktop) {
								showAdoptedPopup(animalSpeciesId, animalSpecies, animalName);
							}
						} else {
							// Non-adopted animals: both platforms show form popup on click
							if (deviceIsDesktop) {
								hideForAdoptionPopup();
								showInitAdoptionPopup(
									pointId,
									animalSpeciesId,
									animalSpecies,
									animalSpeciesExt,
									animalDescription
								);
							} else {
								showForAdoptionPopup(
									pointId,
									animalSpeciesId,
									animalSpecies,
									animalSpeciesExt,
									animalDescription
								);
							}
						}
					});
				}
			});

			// Wait for image preloading to complete
			try {
				await imagePreloadPromise;
				state.animalImagesLoaded = true;
			} catch (error) {
				console.warn('Animal image preloading failed, but continuing anyway:', error);
				// Even if preloading fails, mark as loaded to not block the UI
				state.animalImagesLoaded = true;
			}
		} catch (error) {
			console.error('Failed to load polygons data:', error);
			// Even if polygon loading fails, mark animal images as loaded to not block the UI
			state.animalImagesLoaded = true;
		}
	};

	onMount(async () => {
		if (!browser || !mapContainer) return;

		try {
			const L = await getLeaflet();

			// Initialize the map
			state.map = L.map(mapContainer, {
				center: center,
				zoom: initialZoom,
				minZoom: POLAND_MAP_CONFIG.minZoom,
				maxZoom: POLAND_MAP_CONFIG.maxZoom,
				maxBounds: isDesktop() ? POLAND_BOUNDS : POLAND_BOUNDS_MOBILE, // Poland bounds
				maxBoundsViscosity: 1.0, // Prevent dragging outside bounds
				...POLAND_MAP_CONFIG.options,
				zoomControl: false // Disable default zoom control, we'll add custom one,
			});

			state.map.attributionControl.addAttribution(
				'<a href="https://greenpeace.org/poland" target="_blank">Greenpeace Polska</a>'
			);

			// Add custom zoom control positioned at bottom left
			if (zoomControl) {
				L.control
					.zoom({
						position: 'bottomleft'
					})
					.addTo(state.map);
			}

			// Preload the image before creating the overlay
			const preloadImage = (src: string): Promise<void> => {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = () => resolve();
					img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
					img.src = src;
				});
			};

			try {
				// Wait for image to fully load before creating overlay
				await preloadImage('/mapazwierzaki.webp');

				// Now create the image overlay with the preloaded image
				state.imageOverlay = L.imageOverlay('/mapazwierzaki.webp', POLAND_IMAGE_BOUNDS, {
					opacity: 1,
					interactive: false
				});

				state.imageOverlay.addTo(state.map);

				// Mark image as loaded since we preloaded it
				state.imageLoaded = true;
				checkLoadingComplete();
			} catch (error) {
				console.warn('Image overlay failed to preload, continuing anyway');
				// Create overlay anyway and mark as loaded
				state.imageOverlay = L.imageOverlay('/mapazwierzaki.webp', POLAND_IMAGE_BOUNDS, {
					opacity: 1,
					interactive: false
				});
				state.imageOverlay.addTo(state.map);
				state.imageLoaded = true;
				checkLoadingComplete();
			}

			// Fit map to Poland bounds only if requested
			if (fitToBounds) {
				if (isDesktop()) {
					state.map.fitBounds(POLAND_BOUNDS);
				} else {
					state.map.fitBounds(POLAND_BOUNDS_MOBILE);
				}
			}

			// Configure map interactions based on enableControls prop
			if (enableControls) {
				// Enable all controls for interactive map
				state.map.touchZoom.enable();
				state.map.scrollWheelZoom.enable();
				state.map.dragging.enable();
				// Add scale control for interactive maps
				// L.control.scale({ imperial: false }).addTo(state.map);
			} else {
				// Disable all controls for fixed workflow map
				state.map.touchZoom.disable();
				state.map.scrollWheelZoom.disable();
				state.map.dragging.disable();
			}

			// Create custom 'polygons' pane
			state.map.createPane('polygons');
			state.map.getPane('polygons')!.style.zIndex = '640';

			// Create and populate polygon layer
			await createPolygonsLayer(L);

			// Mark polygons as loaded
			state.polygonsLoaded = true;
			checkLoadingComplete();

			// Optimized resize handler with debouncing
			handleResize = () => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					if (state.map) {
						state.map.invalidateSize();
						// Only fit bounds if requested and zoom is very low
						if (fitToBounds && state.map.getZoom() < 6) {
							state.map.fitBounds(POLAND_BOUNDS);
						}
					}
				}, 0);
			};

			window.addEventListener('resize', handleResize);
		} catch (error) {
			console.error('Failed to initialize map:', error);
		}
	});

	onDestroy(() => {
		// Remove resize event listener to prevent memory leaks
		if (typeof window !== 'undefined' && handleResize) {
			window.removeEventListener('resize', handleResize);
		}

		// Clean up map instance
		if (state.polygonsLayer) {
			state.polygonsLayer.remove();
			state.polygonsLayer = null;
		}
		if (state.imageOverlay) {
			state.imageOverlay.remove();
			state.imageOverlay = null;
		}
		if (state.map) {
			state.map.remove();
			state.map = null;
		}

		// Clear library reference
		state.LeafletLib = null;
	});
</script>

<div class="relative" style="height: {height}">
	<div
		bind:this={mapContainer}
		class="h-full w-full bg-white"
		class:opacity-0={state.isLoading}
		class:opacity-100={!state.isLoading}
		class:transition-opacity={true}
		class:duration-500={true}
		aria-label="Mapa Polski"
	>
		{#if !browser}
			<div class="flex h-full items-center justify-center">
				<p class="text-gray-500">Mapa ładuje się...</p>
			</div>
		{/if}
	</div>

	<!-- Loading overlay -->
	{#if state.isLoading}
		<div
			class="absolute inset-0 z-[2000] flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100"
		>
			<div class="text-center">
				<div
					class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"
				></div>
				<p class="font-medium text-gray-700">Ładuję mapę...</p>
			</div>
		</div>
	{/if}

	<!-- Greenpeace Logo Overlay - Responsive -->
	{#if showLogo}
		{#if !isDesktop()}
			<!-- Mobile Logo: White logo with original styling -->
			<div class="absolute top-6 left-[21px] z-[9998]">
				<img src="/logo_biale.png" alt="Greenpeace" class="h-[23px] w-[150px]" />
			</div>
		{/if}
		{#if isDesktop()}
			<!-- Desktop Logo: Green logo with 200px width -->
			<div
				class="absolute top-6 left-[21px] z-[9998] h-[30.94px] w-[200px] bg-[url('/logo_green.png')] bg-cover bg-no-repeat"
				style="mix-blend-mode: plus-lighter;"
			></div>
		{/if}
	{/if}
</div>

<!-- FOR ADOPTION POPUP RENDERING - Using extracted PopupContainer component -->
<PopupContainer
	visible={state.forAdoptionPopup.visible}
	zIndex={99998}
	close={false}
	closeMobile={true}
	onClose={hideForAdoptionPopup}
	><div class="mx-auto flex w-full flex-col gap-y-6">
		<h3 class="font-paytone text-[28px] leading-[34px] tracking-[1px] text-[#444444]">
			{state.forAdoptionPopup.animalSpecies}
			{state.forAdoptionPopup.pointId}
		</h3>
		<div class="flex flex-col gap-y-5 rounded-md bg-white pb-5">
			<div class="text-center">
				<img
					src={`/zwierzaki/${state.forAdoptionPopup.animalSpeciesId}.webp`}
					alt={state.forAdoptionPopup.animalSpecies}
					class="mx-auto"
				/>
			</div>
			<h4 class="font-paytone text-[22px] leading-[24px] tracking-[0.5px]">
				<span class="md:hidden">Obejmij to zwierzę opieką</span>
				<span class="max-md:hidden">To zwierzę jest dostępne! Kliknij w nie i obejmij opieką.</span>
			</h4>
			<button
				class="font-paytone mx-auto w-full max-w-[200px] rounded bg-[#7FC241] px-6 py-2.5 text-[16px] leading-[20px] tracking-[1px] text-white uppercase transition-colors md:hidden"
				type="button"
				onclick={handleMobileAdoptionClick}
			>
				Adoptuję
			</button>
		</div>
	</div></PopupContainer
>

<!-- INIT ADOPTION POPUP RENDERING - Using extracted PopupContainer component -->
<PopupContainer
	visible={state.initAdoptionPopup.visible}
	zIndex={99998}
	close={true}
	closeMobile={true}
	onClose={hideInitAdoptionPopup}
	><div class="flex flex-col items-center justify-center gap-y-6">
		<h3 class="font-paytone mx-auto max-w-md text-[28px] leading-[34px] tracking-[1px]">
			Obejmij opieką <span class="block">{state.initAdoptionPopup.animalSpeciesExt}</span>
		</h3>
		<p class="text-[14px] leading-[16px]">{state.initAdoptionPopup.animalDescription}</p>
		<div class="flex flex-col gap-y-6 rounded-md bg-white pb-5">
			<img
				src="/zwierzaki/{state.initAdoptionPopup.animalSpeciesId}.webp"
				alt={state.initAdoptionPopup.animalSpecies}
			/>
			<h4 class="font-paytone text-[24px] leading-[24px] tracking-[0.5px]">
				Nazwij swoje zwierzę:
			</h4>
			<input
				type="text"
				id="init-name-input-{state.initAdoptionPopup.pointId}"
				placeholder="Imię zwierzęcia*"
				class="mx-auto w-full max-w-[300px] rounded border border-[#CCCDCF] px-3 py-2 text-center transition-colors placeholder:text-[14px] placeholder:text-[#5B5B5B] focus:border-[#7FC241] focus:ring-0 focus:outline-none focus:placeholder:opacity-0"
				required
			/>
			<button
				id="init-adopt-btn-{state.initAdoptionPopup.pointId}"
				class="font-paytone mx-auto w-full max-w-[200px] cursor-not-allowed rounded bg-gray-400 px-6 py-2.5 text-[16px] leading-[20px] tracking-[1px] text-white uppercase transition-colors"
				type="button"
				disabled
			>
				Adoptuję
			</button>
		</div>
	</div></PopupContainer
>

<!-- ADOPTED POPUP RENDERING - Using extracted PopupContainer component -->
<PopupContainer
	visible={state.adoptedPopup.visible}
	zIndex={99999}
	close={false}
	closeMobile={true}
	onClose={hideAdoptedPopup}
	><div class="mx-auto flex w-full flex-col gap-y-6">
		<h3 class="font-paytone text-[28px] leading-[34px] tracking-[1px] text-[#444444]">
			{state.adoptedPopup.animalSpecies}
			{state.adoptedPopup.animalName}
			<span class="block">ma już opiekę</span>
		</h3>
		<div class="rounded-md bg-white pb-5 text-center">
			<img
				src="/zwierzaki/{state.adoptedPopup.animalSpeciesId}.webp"
				alt={state.adoptedPopup.animalSpecies}
				class="mx-auto"
			/>
		</div>
		<h4 class="leading-5 font-extrabold tracking-[1px]">Wybierz inne zwierzę</h4>
	</div>
</PopupContainer>

<!-- Adoption Modal -->
<AdoptionModal
	isOpen={adoptionModal.isOpen}
	pointId={adoptionModal.pointId}
	animalSpeciesId={adoptionModal.animalSpeciesId}
	animalName={adoptionModal.animalName}
	onClose={closeAdoptionModal}
/>

<style>
	:global(.leaflet-container) {
		font-family: inherit;
		background-color: #ffffff;
	}

	:global(.leaflet-popup-content-wrapper) {
		border-radius: 6px;
		background: #f8f8f8;
		box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25);
		display: flex;
		width: 100%;
		height: 100%;
		padding: 20px;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		flex-shrink: 0;
		overflow-y: auto;
		text-align: center;
		z-index: 99988 !important;
	}

	:global(.leaflet-control-zoom) {
		border: 0 !important;
		border-radius: 4px;
	}

	:global(.leaflet-control-zoom-in) {
		border-bottom-color: transparent !important;
	}

	:global(.leaflet-popup-tip-container) {
		display: none !important;
	}
</style>
