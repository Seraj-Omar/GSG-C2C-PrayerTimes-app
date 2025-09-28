import { safeFetch } from "../utils/utils.js";
import { API_ENDPOINTS } from "../config.js";
import { cityCache } from "../ui.js";

export async function fetchCountriesByContinent(continent) {
  const url = `${API_ENDPOINTS.restCountries}/${continent}`;
  const data = await safeFetch(url);
  return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}


export async function fetchCitiesByCountry(country) {
  if (cityCache[country]) {
    return cityCache[country];
  }
  const url = API_ENDPOINTS.countriesNow;
  const data = await safeFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country }),
  });

  if (!data.data) throw new Error("No cities found");
  cityCache[country] = data.data.sort();
  return data.data.sort();
}

export async function fetchPrayerTimes(city, country, method) {
  const url = `${API_ENDPOINTS.aladhan}?city=${encodeURIComponent(
    city
  )}&country=${encodeURIComponent(country)}&method=${method}`;
  const data = await safeFetch(url);
  return data.data.timings;
}
