import type { LayoutLoad } from './$types';
import staticContent from '../assets/content';

export const load: LayoutLoad = async () => {
	const content = staticContent;
	return {
		content
	};
};

export const prerender = true;
