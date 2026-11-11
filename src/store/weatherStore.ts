import { create } from "zustand";

type WeatherState = {
    weather: string | null;
    setWeather: (w: string) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
    weather: null,
    setWeather: (w) => set({weather: w}),
}));