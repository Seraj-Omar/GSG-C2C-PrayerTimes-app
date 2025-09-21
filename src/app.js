import { CONTINENTS } from "./config.js";
import { fetchCountriesByContinent } from "./api/api.js";

const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

document.addEventListener("DOMContentLoaded", () => {
  populateContinents();
  setupEventListeners();
});

function populateContinents() {
  continentSelect.innerHTML = '<option value="">Select Continent....</option>';
  CONTINENTS.forEach((continent) => {
    const option = document.createElement("option");
    option.value = continent.toLowerCase();
    option.textContent = continent;
    continentSelect.appendChild(option);
  });
}

function setupEventListeners() {
  continentSelect.addEventListener("change", handleContinentChange);
}

async function handleContinentChange() {
  const selectedContinent = continentSelect.value;
  countrySelect.innerHTML = '<option value="">Select Country....</option>';
  countrySelect.disabled = true;
  citySelect.innerHTML = '<option value="">Select City....</option>';
  citySelect.disabled = true;

  if (!selectedContinent) {
    return;
  }

  try {
    countrySelect.innerHTML = '<option value="">Loading countries...</option>';
    const countries = await fetchCountriesByContinent(selectedContinent);
    countrySelect.innerHTML = '<option value="">Select Country....</option>';
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
    countrySelect.disabled = false;
  } catch (error) {
    countrySelect.innerHTML =
      '<option value="">Error loading countries</option>';
    console.error("Error fetching countries:", error);
  }
}
