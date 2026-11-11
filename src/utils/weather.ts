export const weatherIconMap: Record<string, string> = {
    "맑음" : "☀️",
    "구름많음" : "🌥️",
    "흐림" : "☁️",
    "비" : "🌧️",
    "눈" : "🌨️",
    "비/눈" : "🌧️/🌨️",
    "소나기" : "🌦️",
};

export function getWeatherIcon(weather: string): string {
    const cleaned = weather.replace(/\uFE0F/g, "").replace(/\u200B/g, "").trim();
    
    return weatherIconMap[cleaned] ?? "☀️";
}