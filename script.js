const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";


const dropdowns = document.querySelectorAll("select");
const btn = document.getElementById("convert-btn");
const fromCurr = document.getElementById("from-currency");
const toCurr = document.getElementById("to-currency");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".swap");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        // Set default selections
        if (select.id === "from-currency" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.id === "to-currency" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to fetch exchange rate
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input").value;
    if (amount === "" || amount < 1) {
        amount = 1;
    }

    const URL = `${BASE_URL}${fromCurr.value}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate");
        }

        let data = await response.json();
        let rate = data.rates[toCurr.value];

        let finalAmount = (amount * rate).toFixed(2);
        msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Exchange rate unavailable";
        console.error(error);
    }
};


// Function to update flag images
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    }
};

// Swap Button Functionality
swapBtn.addEventListener("click", () => {
    let tempCode = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCode;

    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
});

// Event listeners
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);
