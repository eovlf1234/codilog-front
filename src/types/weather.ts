export type ForecastDay = {
    date: string;
    hourTempMap: Record<string, number>;
    hourSkyMap: Record<string, number>;
    hourPtyMap: Record<string, number>;
    hourWeatherMap: Record<string, string>;
    maxTemp: number | null;
    minTemp: number | null;
}

export type Weather = {
    address: {
        city: string;
        district: string;
    };
    currentWeather: {
        weather: string;
        temp: number;
        reh: number;
        rn1: number;
        pty: number;
        maxTemp: number;
        minTemp: number;
    };
    forecastWeather: Record<string, ForecastDay>;
    coordi: {
        top: string;
        bottom: string;
        shoes: string;
    }
};

export type CacheWeather = {
    data: Weather;
    time: number;
}