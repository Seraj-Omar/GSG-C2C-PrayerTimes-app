import { CONTINENTS, DEFAULT_METHOD } from "./config.js";
import {
  fetchCountriesByContinent,
  fetchCitiesByCountry,
  fetchPrayerTimes
} from "./api/api.js";
import { getNextPrayer } from "./utils/utils.js";
import {
  continentSelect,
  countrySelect,
  citySelect,
  methodSelect,
  resetBtn,
  nextPrayerEl,
  countdownEl,
  renderContinents,
  renderCountries,
  renderCities,
  renderPrayerTimes,
  renderNextPrayer,
  resetPrayerTimesTable,
  resetLocationChoices,
  resetCalculationMethod,
  showLoadingState,
  cityCache  

} from "./ui.js";

let countdownInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  renderContinents(CONTINENTS);
  setupEventListeners();
  restoreSelections();
});

function setupEventListeners() {
  continentSelect.addEventListener("change", handleContinentChange);
  countrySelect.addEventListener("change", handleCountryChange);
  citySelect.addEventListener("change", handleCityChange);
  methodSelect.addEventListener("change", handleMethodChange);
  resetBtn.addEventListener("click", resetApp);
}

async function handleContinentChange() {
  const continent = continentSelect.value;
  countrySelect.innerHTML = '<option value="">Select Country....</option>';
  countrySelect.disabled = true;
  citySelect.innerHTML = '<option value="">Select City....</option>';
  citySelect.disabled = true;

  if (!continent) return;

  try {
    countrySelect.innerHTML = '<option value="">Loading countries...</option>';
    const countries = await fetchCountriesByContinent(continent);
    renderCountries(countries);
    localStorage.setItem('continent', continent);
  } catch (error) {
    console.error("Error fetching countries:", error);
    countrySelect.innerHTML = '<option value="">Error loading countries</option>';
  }
}

async function handleCountryChange() {
  const country = countrySelect.value;
  citySelect.innerHTML = '<option value="">Select City....</option>';
  citySelect.disabled = true;
  if (cityCache[country]) {
      renderCities(cityCache[country]);   
      return;
    }
  if (!country) return;

  try {
    citySelect.innerHTML = '<option value="">Loading cities...</option>';
    const cities = await fetchCitiesByCountry(country);
    cityCache[country] = cities;         
    renderCities(cities);
    localStorage.setItem('country', country);
  } catch (error) {
    console.error("Error fetching cities:", error);
    citySelect.innerHTML = '<option value="">Error loading cities</option>';
  }
}

async function handleCityChange() {
  const city = citySelect.value;
  if (!city) return;
  localStorage.setItem('city', city);
  await updatePrayerTimes();
}

async function handleMethodChange() {
  const method = methodSelect.value || DEFAULT_METHOD;
  localStorage.setItem('method', method);
  await updatePrayerTimes();
}

async function updatePrayerTimes() {
  const city = citySelect.value;
  const country = countrySelect.value;
  const method = methodSelect.value || DEFAULT_METHOD;

  if (!city || !country) {
    resetPrayerTimesTable();
    stopCountdown();
    return;
  }

  try {
    showLoadingState();
    const prayerTimes = await fetchPrayerTimes(city, country, method);
    renderPrayerTimes(prayerTimes);
    startCountdown(prayerTimes);
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    resetPrayerTimesTable();
    stopCountdown();
  }
}

function startCountdown(prayerTimes) {
  stopCountdown();
  updateCountdownDisplay(prayerTimes);
  countdownInterval = setInterval(() => updateCountdownDisplay(prayerTimes), 1000);
}

function updateCountdownDisplay(prayerTimes) {
  const nextPrayerInfo = getNextPrayer(prayerTimes);
  renderNextPrayer(nextPrayerInfo);
}

function stopCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = null;
  nextPrayerEl.textContent = '--';
  countdownEl.textContent = '00:00:00';
}

async function restoreSelections() {
  const savedContinent = localStorage.getItem('continent');
  const savedCountry = localStorage.getItem('country');
  const savedCity = localStorage.getItem('city');
  const savedMethod = localStorage.getItem('method');

  if (savedContinent) {
    continentSelect.value = savedContinent;
    await handleContinentChange();
    if (savedCountry) {
      countrySelect.value = savedCountry;
      await handleCountryChange();
      if (savedCity) {
        citySelect.value = savedCity;
        if (savedMethod) methodSelect.value = savedMethod;
        await handleCityChange();
      }
    }
  }
}

function resetApp() {
  resetLocationChoices();
  resetPrayerTimesTable();
  resetCalculationMethod();
  stopCountdown();
  localStorage.removeItem('continent');
  localStorage.removeItem('country');
  localStorage.removeItem('city');
  localStorage.removeItem('method');
}
