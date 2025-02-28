import { writable } from 'svelte/store';

export const open = writable(false);
export const title = writable('');
export const message = writable('');

export function showSuccessModal(titleString: string, messageString: string) {
	title.set(titleString);
	message.set(messageString);
	open.set(true);
}
