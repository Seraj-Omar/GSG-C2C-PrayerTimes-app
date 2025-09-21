import { safeFetch } from "../utils/utils.js";
import { API_ENDPOINTS } from "../config.js";

export async function fetchCountriesByContinent(continent) {
  const url = `${API_ENDPOINTS.restCountries}/${continent}`;
  const data = await safeFetch(url);
  return data.map((country) => country.name.common).sort();
}
