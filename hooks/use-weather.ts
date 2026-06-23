import { useEffect, useState } from "react";

import * as Location from "expo-location";

export default function useWeather() {
  const [temperature, setTemperature] = useState("--");

  const [city, setCity] = useState("");

  const [weatherCode, setWeatherCode] = useState(0);

  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const latitude = location.coords.latitude;

      const longitude = location.coords.longitude;

      // CITY NAME
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        setCity(reverseGeocode[0].city || "");
      }

      // WEATHER API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`,
      );

      const data = await response.json();

      setTemperature(Math.round(data.current.temperature_2m).toString());

      setWeatherCode(data.current.weather_code);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.log("Weather error:", error);
    }
  };

  return {
    temperature,
    city,
    weatherCode,
  };
}
