export interface LoadingDialogState {
	open: boolean;
	status: 'loading' | 'success' | 'error';
	title: string;
	successMessage: string;
	errorMessage: string;
}
