const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const resetBtn = document.getElementById("resetBtn");
const prayerTimesTable = document.getElementById("prayerTimes");
const nextPrayer = document.getElementById("nextPrayer");
const countdown = document.getElementById("countdown");
const errorDiv = document.getElementById("error");


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
    nextPrayerEl.textContent = `${next.name} at ${next.time}`;
    countdownEl.textContent = formatCountdown(next.remaining);
  } else {
    nextPrayerEl.textContent = "No more prayers today";
    countdownEl.textContent = "--:--:--";
  }
}

function formatCountdown(ms) {
  let totalSec = Math.floor(ms / 1000);
  let h = Math.floor(totalSec / 3600);
  let m = Math.floor((totalSec % 3600) / 60);
  let s = totalSec % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}


function showError(message) {
  errorEl.textContent = message;
}

function clearError() {
  errorEl.textContent = "";
}



resetBtn.addEventListener("click", () => {
  continentSelect.value = "africa";
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
