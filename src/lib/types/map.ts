import type { Map as LeafletMap, LatLngTuple, MapOptions } from 'leaflet';

// Map configuration types
export interface MapConfig {
	center: LatLngTuple;
	zoom: number;
	minZoom?: number;
	maxZoom?: number;
	options?: Partial<MapOptions>;
}

// Poland map specific configuration
export const POLAND_MAP_CONFIG: MapConfig = {
	center: [52.0, 19.0], // Center of Poland
	zoom: 9.5,
	minZoom: 9,
	maxZoom: 10,
	options: {
		zoomControl: true,
		zoomSnap: 0.5,
		zoomDelta: 0.5
		// inertiaDeceleration: 4000
	}
};

// Map bounds for Poland
export const POLAND_BOUNDS: [LatLngTuple, LatLngTuple] = [
	[48.95, 14.0], // Southwest corner
	[55.1, 25.33] // Northeast corner
];

// Map bounds for Poland on mobile considering no popup space
export const POLAND_BOUNDS_MOBILE: [LatLngTuple, LatLngTuple] = [
	[48.95, 14.0], // Southwest corner
	[55.1, 24.25] // Northeast corner
];

// Map image bounds for Poland
export const POLAND_IMAGE_BOUNDS: [LatLngTuple, LatLngTuple] = [
	[48.485, 13.451], // Southwest corner
	[55.489, 24.859] // Northeast corner
];

// Region-specific map center coordinates (initially all using Poland center)
export const regionCenterMap: Record<number, LatLngTuple> = {
	1: [53.5, 15.5], // Rzeki północny wschód
	2: [54.14, 18.76], // Pomorze
	3: [53.9, 22.06], // Mazury
	4: [52.76, 22.75], // Podlasie puszcza
	5: [52.12, 20.06], // Centralna Polska
	6: [51.32, 16.84], // Południowy wschód
	7: [49.73, 20.04], // Tatry
	8: [50.47, 22.49], // Bieszczady
	9: [52.89, 17.63] // Bory Tucholskie
};

// Map store state
export interface MapState {
	map: LeafletMap | null;
	center: LatLngTuple;
	zoom: number;
	loading: boolean;
}

// Marker cluster options
export interface ClusterOptions {
	showCoverageOnHover: boolean;
	zoomToBoundsOnClick: boolean;
	spiderfyOnMaxZoom: boolean;
	removeOutsideVisibleBounds: boolean;
	maxClusterRadius: number;
}

// GeoJSON polygon properties interface
export interface PolygonProperties {
	point_id: number;
	animal_species_id: number;
	animal_species: string;
	animal_species_ext: string;
	animal_description: string;
	adopted: boolean;
	animal_name?: string; // Only present for adopted animals
}

// GeoJSON feature interface for polygons
export interface PolygonFeature {
	type: 'Feature';
	properties: PolygonProperties;
	geometry: {
		type: 'MultiPolygon';
		coordinates: number[][][][];
	};
}

// Adoption modal state
export interface AdoptionModalState {
	isOpen: boolean;
	animalId: number | null;
}
