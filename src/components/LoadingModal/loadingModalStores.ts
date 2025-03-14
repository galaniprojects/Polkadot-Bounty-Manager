import { get, writable } from 'svelte/store';

export const dialog = writable<HTMLDialogElement>();
export const title = writable('');
export const message = writable('');

function preventCloseOnEscKey(event: KeyboardEvent) {
	if (event.key === 'Escape') {
		event.preventDefault();
	}
}

function cleanup() {
	document.removeEventListener('keydown', preventCloseOnEscKey);
}

export function showLoadingModal(titleString: string, messageString: string) {
	title.set(titleString);
	message.set(messageString);

	const modal = get(dialog);
	modal.showModal();

	document.addEventListener('keydown', preventCloseOnEscKey);
	modal.addEventListener('close', cleanup, { once: true });
}

export function hideLoadingModal() {
	get(dialog).close();
}
