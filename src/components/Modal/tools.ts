import styles from './Modal.module.css';

export const modalStyles = styles;

export function clickAway(element: HTMLDialogElement) {
	function handleClick({ target }: MouseEvent) {
		if (target === element) {
			element.close();
		}
	}

	element.addEventListener('click', handleClick);

	return {
		destroy() {
			element.removeEventListener('click', handleClick);
		}
	};
}
