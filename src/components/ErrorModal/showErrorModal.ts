import { get, writable } from 'svelte/store';

export const dialog = writable<HTMLDialogElement>();
export const message = writable('');

export function showErrorModal(messageString: string) {
	message.set(messageString);
	get(dialog).showModal();
}
