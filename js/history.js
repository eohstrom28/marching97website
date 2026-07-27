const worldsFair = document.getElementById("worlds-fair");
const worldsFairDesc = worldsFair.querySelector("details");
const fiftyAndSubway = document.getElementById("fifty-and-subway");

// change image layout next to World's Fair article depending on whether the World's Fair dropdown is open or not
// toggle covers both opening/closing with mouse and keyboard!
worldsFairDesc.addEventListener("toggle", () => {
    if (worldsFairDesc.open) {
        fiftyAndSubway.style.justifyContent = "flex-start";
    }
    else {
        fiftyAndSubway.style.justifyContent = "space-evenly";
    }
});