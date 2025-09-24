import { formatCountdown } from "../src/utils";

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
console.log(CONTINENTS);

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

function renderContinents(continents) {
  continentSelect.innerHTML = '<option value="">Select Continent....</option>';
  continents.forEach(continent => {
    const option = document.createElement("option");
    option.value = continent;
    option.textContent = continent;
    continentSelect.appendChild(option);
  });
}

function renderCountries(countries) {
  countrySelect.innerHTML = '<option value="">Select Country...</option>';
  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country.name.common;
    option.textContent = country.name.common;
    countrySelect.appendChild(option);
  });
  countrySelect.disabled = false;
}

function renderCities(cities) {
  citySelect.innerHTML = '<option value="">Select City...</option>';
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
  citySelect.disabled = false;
}

function renderMethods(methods) {
  methodSelect.innerHTML = '<option value="">Select Method...</option>';
  methods.forEach(method => {
    const option = document.createElement("option");
    option.value = method.id;
    option.textContent = method.name;
    methodSelect.appendChild(option);
  });
}

function showLoadingState() {
  const rows = prayerTableBody.querySelectorAll("tr");
  rows.forEach(row => {
    const timeCell = row.cells[1];
    if (timeCell) timeCell.textContent = "Loading...";
  });
}

function resetPrayerTimesTable() {
  const rows = prayerTableBody.querySelectorAll("tr");
  rows.forEach(row => {
    const timeCell = row.cells[1];
    if (timeCell) timeCell.textContent = "-";
  });
}

function resetLocationChoices() {
  continentSelect.selectedIndex = 0;
  countrySelect.selectedIndex = 0;
  citySelect.selectedIndex = 0;
  countrySelect.disabled = true;
  citySelect.disabled = true;
}

function resetCalculationMethod() {
  methodSelect.value = "";
}

export {
  continentSelect,
  countrySelect,
  citySelect,
  methodSelect,
  resetBtn,
  nextPrayerEl,
  countdownEl,
  cityCache,
  renderContinents,
  renderCountries,
  renderCities,
  renderPrayerTimes,
  renderNextPrayer,
  resetPrayerTimesTable,
  resetLocationChoices,
  resetCalculationMethod,
  showLoadingState,
  showError,
  clearError
};
