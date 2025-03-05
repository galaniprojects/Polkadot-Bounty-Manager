import { loadingDialogState } from '../stores';
import type { LoadingDialogState } from '../types/loading-screen';

export function showLoadingDialog(title: string) {
	const state: LoadingDialogState = {
		open: true,
		status: 'loading',
		title: title,
		successMessage: '',
		callData: undefined,
		errorMessage: ''
	};
	loadingDialogState.set(state);
}

export function hideLoadingDialog() {
	const state: LoadingDialogState = {
		open: false,
		status: 'loading',
		title: '',
		successMessage: '',
		callData: undefined,
		errorMessage: ''
	};
	loadingDialogState.set(state);
}

export function showErrorDialog(message: string) {
	const state: LoadingDialogState = {
		open: true,
		status: 'error',
		title: 'Error',
		successMessage: '',
		callData: undefined,
		errorMessage: message
	};
	loadingDialogState.set(state);
}

export function showSuccessDialog(title: string, message: string, callData?: string) {
	const state: LoadingDialogState = {
		open: true,
		status: 'success',
		title: title,
		successMessage: message,
		callData,
		errorMessage: ''
	};
	loadingDialogState.set(state);
}
