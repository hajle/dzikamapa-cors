import { writable } from 'svelte/store';
import type { Map as LeafletMap, LatLngTuple } from 'leaflet';
import type { MapState } from '../types/map.js';
import { POLAND_MAP_CONFIG } from '../types/map.js';

// Map state store
function createMapStore() {
	const initialState: MapState = {
		map: null,
		center: POLAND_MAP_CONFIG.center,
		zoom: POLAND_MAP_CONFIG.zoom,
		loading: false
	};

	const { subscribe, set, update } = writable<MapState>(initialState);

	return {
		subscribe,
		setMap: (map: LeafletMap) => update((state) => ({ ...state, map })),
		setCenter: (center: LatLngTuple) => update((state) => ({ ...state, center })),
		setZoom: (zoom: number) => update((state) => ({ ...state, zoom })),
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		reset: () => set(initialState)
	};
}

export const mapStore = createMapStore();
