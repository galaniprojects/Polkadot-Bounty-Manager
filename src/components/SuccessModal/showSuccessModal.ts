import { get, writable } from 'svelte/store';

export const dialog = writable<HTMLDialogElement>();
export const title = writable('');
export const message = writable('');

export function showSuccessModal(titleString: string, messageString: string) {
	title.set(titleString);
	message.set(messageString);
	get(dialog).showModal();
}
