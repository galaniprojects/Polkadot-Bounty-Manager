import { writable } from 'svelte/store';

export const open = writable(false);
export const message = writable('');

export function showErrorModal(messageString: string) {
	message.set(messageString);
	open.set(true);
}
