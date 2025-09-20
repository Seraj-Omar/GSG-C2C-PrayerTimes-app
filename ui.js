const continentSelect = document.getElementById("continent");
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const methodSelect = document.getElementById("method");
const resetBtn = document.getElementById("resetBtn");
const prayerTimesTable = document.getElementById("prayerTimes");
const nextPrayer = document.getElementById("nextPrayer");
const countdown = document.getElementById("countdown");
const errorDiv = document.getElementById("error");

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
    nextPrayer.textContent = `${next.name} at ${next.time}`;
    countdown.textContent = formatCountdown(next.remaining);
  } else {
    nextPrayer.textContent = "No more prayers today";
    countdown.textContent = "--:--:--";
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
  errorDiv.textContent = message;
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
    const res = await fetch(`https://restcountries.com/v3.1/region/${selectedContinent}`);
    const countries = await res.json();
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
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry })
      });
      const data = await res.json();
      cityCache[selectedCountry] = data.data;
      renderCities(data.data);
    }
  } catch (error) {
    showError("Failed to load cities.");
  }
});


async function fetchPrayerTimes() {
  const city = citySelect.value;
  const method = methodSelect.value;
  if (!city || !method) return;

  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&method=${method}`);
    const data = await res.json();

    const prayers = {
      Fajr: data.data.timings.Fajr,
      Dhuhr: data.data.timings.Dhuhr,
      Asr: data.data.timings.Asr,
      Maghrib: data.data.timings.Maghrib,
      Isha: data.data.timings.Isha
    };

    renderPrayerTimes(prayers);

    const next = getNextPrayer(prayers); 
    renderNextPrayer(next);

    clearError();
  } catch (error) {
    showError("Failed to load prayer times.");
  }
}

citySelect.addEventListener("change", fetchPrayerTimes);
methodSelect.addEventListener("change", fetchPrayerTimes);


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