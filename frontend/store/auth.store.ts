import { create } from 'zustand';

type AuthState = {
	token: string | null;
	setToken: (token: string, remember: boolean) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	token: null,

	setToken: (token, remember) => {
		if (remember) {
			localStorage.setItem('token', token);
		}
		set({ token });
	},

	logout: () => {
		localStorage.removeItem('token');
		set({ token: null });
	},
}));
