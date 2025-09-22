import { CONTINENTS, PRAYERS, DEFAULT_METHOD } from "./config.js";
import {
  fetchCountriesByContinent,
  fetchCitiesByCountry,
  fetchPrayerTimes,
} from "./api/api.js";
import { getNextPrayer, formatCountdown } from "./utils/utils.js";

const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const prayerTimesTable = document.getElementById("prayerTimes");
const resetBtn = document.getElementById("resetBtn");
const nextPrayer = document.getElementById("nextPrayer");
const countdown = document.getElementById("countdown");

let countdownInterval = null;
let currentPrayerTimes = {};

document.addEventListener("DOMContentLoaded", () => {
  populateContinents();
  setupEventListeners();
  restoreSelections();
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
  countrySelect.addEventListener("change", handleCountryChange);
  citySelect.addEventListener("change", handleCityChange);
  methodSelect.addEventListener("change", handleMethodChange);
  resetBtn.addEventListener("click", resetApp);
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
    localStorage.setItem('continent', selectedContinent);
  } catch (error) {
    countrySelect.innerHTML =
      '<option value="">Error loading countries</option>';
    console.error("Error fetching countries:", error);
  }
}

async function handleCountryChange() {
  const selectedCountry = countrySelect.value;

  citySelect.innerHTML = '<option value="">Select City....</option>';
  citySelect.disabled = true;
  if (!selectedCountry) {
    return;
  }

  try {
    citySelect.innerHTML = '<option value="">Loading cities...</option>';
    const cities = await fetchCitiesByCountry(selectedCountry);
    citySelect.innerHTML = '<option value="">Select City....</option>';
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });

    citySelect.disabled = false;
    localStorage.setItem('country', selectedCountry);
  } catch (error) {
    citySelect.innerHTML = '<option value="">Error loading cities</option>';
    console.error("Error fetching cities:", error);
  }
}

async function handleCityChange() {
  const selectedCity = citySelect.value;
  if (selectedCity) {
    localStorage.setItem('city', selectedCity);
  }
  await updatePrayerTimes();
}

async function handleMethodChange() {
  const selectedMethod = methodSelect.value;
  if (selectedMethod) {
    localStorage.setItem('method', selectedMethod);
  }
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
    currentPrayerTimes = prayerTimes;
    updatePrayerTimesTable(prayerTimes);
    startCountdown(prayerTimes);
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    resetPrayerTimesTable();
    stopCountdown();
  }
}

function showLoadingState() {
  const rows = prayerTimesTable.querySelectorAll("tr");
  rows.forEach((row) => {
    const timeCell = row.cells[1];
    if (timeCell) timeCell.textContent = "Loading...";
  });
}

function updatePrayerTimesTable(prayerTimes) {
  const rows = prayerTimesTable.querySelectorAll("tr");

  rows.forEach((row, index) => {
    const prayerName = PRAYERS[index];
    const timeCell = row.cells[1];

    if (timeCell && prayerTimes[prayerName]) {
      timeCell.textContent = prayerTimes[prayerName];
    }
  });
}

function startCountdown(prayerTimes) {
  stopCountdown();
  updateCountdownDisplay(prayerTimes);
  countdownInterval = setInterval(() => {
    updateCountdownDisplay(prayerTimes);
  }, 1000);
}

function updateCountdownDisplay(prayerTimes) {
  const nextPrayerInfo = getNextPrayer(prayerTimes);
  
  if (nextPrayerInfo) {
    const { name, time, remaining, isTomorrow } = nextPrayerInfo;
    nextPrayer.textContent = `${name} at ${time} ${isTomorrow ? '(Tomorrow)' : '(Today)'}`;
    countdown.textContent = formatCountdown(remaining);
  } else {
    nextPrayer.textContent = 'No more prayers today';
    countdown.textContent = '00:00:00';
  }
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  nextPrayer.textContent = '--';
  countdown.textContent = '00:00:00';
}

function restoreSelections() {
  const savedContinent = localStorage.getItem('continent');
  const savedCountry = localStorage.getItem('country');
  const savedCity = localStorage.getItem('city');
  const savedMethod = localStorage.getItem('method');
  
  if (savedContinent) {
    continentSelect.value = savedContinent;
    handleContinentChange().then(() => {
      if (savedCountry) {
        setTimeout(() => {
          countrySelect.value = savedCountry;
          handleCountryChange().then(() => {
            if (savedCity) {
              setTimeout(() => {
                citySelect.value = savedCity;
                if (savedMethod) {
                  methodSelect.value = savedMethod;
                }
                handleCityChange();
              }, 500);
            }
          });
        }, 500);
      }
    });
  }
}

function resetApp(){
  resetLocationChoices();
  resetPrayerTimesTable();
  resetCalculationMethod();
  stopCountdown();
  localStorage.clear();
}

function resetLocationChoices(){
  continentSelect.selectedIndex = 0;
  countrySelect.selectedIndex = 0;
  citySelect.selectedIndex = 0;
  citySelect.disabled = true;
  countrySelect.disabled = true;
  countrySelect.value = "";
  citySelect.value = "";
}

function resetCalculationMethod(){
  methodSelect.value = "";
}

function resetPrayerTimesTable() {
  const rows = prayerTimesTable.querySelectorAll("tr");
  rows.forEach((row) => {
    const timeCell = row.cells[1];
    if (timeCell) timeCell.textContent = "-";
  });
}
