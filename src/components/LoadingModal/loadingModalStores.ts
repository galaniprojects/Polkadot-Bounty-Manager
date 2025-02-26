import { writable } from 'svelte/store';

export const visible = writable(false);
export const title = writable('');

export function showLoadingModal(titleString: string) {
	title.set(titleString);
	visible.set(true);
}

export function hideLoadingModal() {
	visible.set(false);
}
