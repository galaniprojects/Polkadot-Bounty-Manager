import styles from './Modal.module.css';

export const modalStyles = styles;

export function clickAway({ target, currentTarget }: MouseEvent) {
	if (target === currentTarget && target instanceof HTMLDialogElement) {
		target.close();
	}
}
