import { writable } from 'svelte/store';

export const open = writable(false);
export const title = writable('');

export function showLoadingModal(titleString: string) {
	title.set(titleString);
	open.set(true);
}

export function hideLoadingModal() {
	open.set(false);
}
