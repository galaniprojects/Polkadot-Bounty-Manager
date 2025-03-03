export interface LoadingDialogState {
	open: boolean;
	status: 'loading' | 'success' | 'error';
	title: string;
	successMessage: string;
	callData: string | undefined;
	errorMessage: string;
}
