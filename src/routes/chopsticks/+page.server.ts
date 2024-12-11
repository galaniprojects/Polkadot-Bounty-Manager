import { error } from '@sveltejs/kit';
import { PUBLIC_HIDE_TEST_BAR } from '$env/static/public';

export const ssr = false;

export function load() {
	if (!PUBLIC_HIDE_TEST_BAR) return {};
	error(404);
}
