import { CONTINENTS } from "./config.js";

const continentSelect = document.getElementById("continent");

document.addEventListener("DOMContentLoaded", () => {
  populateContinents();
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
