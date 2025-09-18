declare module '*.geojson' {
	const value: {
		type: 'FeatureCollection';
		features: Array<{
			type: 'Feature';
			properties: Record<string, unknown>;
			geometry: {
				type: 'Point';
				coordinates: [number, number];
			};
		}>;
	};
	export default value;
}
