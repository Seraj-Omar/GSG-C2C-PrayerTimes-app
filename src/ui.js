import { formatCountdown, getNextPrayer } from "./utils/utils.js";
import { fetchCountriesByContinent, fetchCitiesByCountry, fetchPrayerTimes } from "../src/api/api.js";

const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const resetBtn = document.getElementById("resetBtn");
const prayerTableBody = document.getElementById("prayerTimes");
const nextPrayerEl = document.getElementById("nextPrayer");
const countdownEl = document.getElementById("countdown");
const errorEl = document.getElementById("error");

const cityCache = {};

function renderPrayerTimes(prayers) {
  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const rows = prayerTableBody.querySelectorAll("tr");

  rows.forEach((row, index) => {
    const timeCell = row.querySelector("td:nth-child(2)");
    timeCell.textContent = prayers[prayerNames[index]] || "-";
  });
}

function renderNextPrayer(next) {
  if (next) {
    nextPrayerEl.textContent = `${next.name} at ${next.time} ${next.isTomorrow ? '(Tomorrow)' : '(Today)'}`;
    countdownEl.textContent = formatCountdown(next.remaining);
  } else {
    nextPrayerEl.textContent = "No more prayers today";
    countdownEl.textContent = "--:--:--";
  }
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function clearError() {
  errorEl.textContent = "";
  errorEl.style.display = 'none';
}

resetBtn.addEventListener("click", () => {
  continentSelect.value = "";
  countrySelect.value = "";
  citySelect.value = "";
  methodSelect.value = "";
  prayerTableBody.querySelectorAll("td:nth-child(2)").forEach(td => td.textContent = "-");
  nextPrayerEl.textContent = "--";
  countdownEl.textContent = "00:00:00";
  clearError();
  localStorage.clear();
});

function renderCountries(countries) {
  countrySelect.innerHTML = ""; 
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Country...";
  countrySelect.appendChild(defaultOption);

  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country.name.common; 
    option.textContent = country.name.common;
    countrySelect.appendChild(option);
  });

  countrySelect.disabled = false; 
}

function renderCities(cities) {
  citySelect.innerHTML = "";
  
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select City...";
  citySelect.appendChild(defaultOption);

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  citySelect.disabled = false;
}

function renderMethods(methods) {
  methodSelect.innerHTML = "";
  
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Method...";
  methodSelect.appendChild(defaultOption);

  methods.forEach(method => {
    const option = document.createElement("option");
    option.value = method.id; 
    option.textContent = method.name;
    methodSelect.appendChild(option);
  });
}

continentSelect.addEventListener("change", async () => {
  const selectedContinent = continentSelect.value;

  countrySelect.innerHTML = "<option>Loading...</option>";
  countrySelect.disabled = true;
  citySelect.innerHTML = "<option>Select City...</option>";
  citySelect.disabled = true;

  try {
    const countries = await fetchCountriesByContinent(selectedContinent);
    renderCountries(countries);
  } catch (error) {
    showError("Failed to load countries.");
  }
});

countrySelect.addEventListener("change", async () => {
  const selectedCountry = countrySelect.value;
  if (!selectedCountry) return;

  citySelect.innerHTML = "<option>Loading...</option>";
  citySelect.disabled = true;

  try {
    if (cityCache[selectedCountry]) {
      renderCities(cityCache[selectedCountry]);
    } else {
      const cities = await fetchCitiesByCountry(selectedCountry);
      cityCache[selectedCountry] = cities;
      renderCities(cities);
    }
  } catch (error) {
    showError("Failed to load cities.");
  }
});


async function fetchPrayerTimesHandler() {
  const city = citySelect.value; 
  const country = countrySelect.value; 
  const method = methodSelect.value;
  if (!city || !method || !country) return;

  try {
    const timings = await fetchPrayerTimes(city, country, method);

    const prayers = {
      Fajr: timings.Fajr,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha
    };

    renderPrayerTimes(prayers);
    const next = getNextPrayer(prayers);
    renderNextPrayer(next);
    clearError();
  } catch (error) {
    showError("Failed to load prayer times.");
  }
}


citySelect.addEventListener("change", fetchPrayerTimesHandler);
methodSelect.addEventListener("change", fetchPrayerTimesHandler);



export {
  continentSelect,
  countrySelect,
  citySelect,
  methodSelect,
  cityCache,
  renderPrayerTimes,
  renderNextPrayer,
  showError,
  clearError,
  renderCountries,
  renderCities,
  renderMethods
};