import { safeFetch } from "../utils/utils.js";
import { API_ENDPOINTS } from "../config.js";

export async function fetchCountriesByContinent(continent) {
  const url = `${API_ENDPOINTS.restCountries}/${continent}`;
  const data = await safeFetch(url);
  return data.map((country) => country.name.common).sort();
}

export async function fetchCitiesByCountry(country) {
  const url = API_ENDPOINTS.countriesNow;
  const data = await safeFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country }),
  });

  if (!data.data) throw new Error("No cities found");
  return data.data.sort();
}

export async function fetchPrayerTimes(city, country, method) {
  const url = `${API_ENDPOINTS.aladhan}?city=${encodeURIComponent(
    city
  )}&country=${encodeURIComponent(country)}&method=${method}`;
  const data = await safeFetch(url);
  return data.data.timings;
}
