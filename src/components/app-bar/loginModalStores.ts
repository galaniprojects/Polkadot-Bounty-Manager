import { writable } from 'svelte/store';

export const open = writable(false);

export function showLoginModal() {
	open.set(true);
}
