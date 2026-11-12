import { create } from "zustand";

type LoadingState = {
    requestCount: number;
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
    requestCount: 0,
    isLoading: false,

    startLoading: () => set((state) => ({
        requestCount: state.requestCount + 1,
        isLoading: true
    })),

    stopLoading: () => set((state) => {
        const requestCount = Math.max(0, state.requestCount - 1);

        return {
            requestCount,
            isLoading: requestCount > 0
        };
    })
}));