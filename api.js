const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
const populateDropdowns = () => {
    dropdowns.forEach((select) => {
        Object.keys(countryList).forEach((currCode) => {
            const option = document.createElement("option");
            option.value = currCode;
            option.innerText = currCode;
            option.classList.add("option1");
            if (select.name === "from" && currCode === "USD") option.selected = true;
            if (select.name === "to" && currCode === "INR") option.selected = true;
            select.append(option);
        });

        // Update flag on currency change
        select.addEventListener("change", (e) => updateFlag(e.target));
    });
};

// Update flag image based on selected currency
const updateFlag = (element) => {
    const countryCode = countryList[element.value];
    const flagImg = element.parentElement.querySelector("img");
    flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Fetch and display the exchange rate
const updateExchangeRate = async () => {
    const fromCurr = document.querySelector(".from select").value.toLowerCase();
    const toCurr = document.querySelector(".to select").value.toLowerCase();
    const amountInput = document.querySelector(".amount input");
    let amount = parseFloat(amountInput.value) || 1;

    amountInput.value = amount; // Reset invalid input to 1
    msg.innerText = "Fetching exchange rate...";

    try {
        const response = await fetch(`${BASE_URL}/currencies/${fromCurr}.json`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        const rate = data[fromCurr][toCurr];

        if (!rate) throw new Error("Exchange rate not available");
        const finalAmount = (amount * rate).toFixed(2);
        msg.innerText = `${amount} ${fromCurr.toUpperCase()} = ${finalAmount} ${toCurr.toUpperCase()}`;
    } catch (error) {
        msg.innerText = `Error: ${error.message}`;
    }
};

// Add event listeners
const init = () => {
    populateDropdowns();
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        updateExchangeRate();
    });
    window.addEventListener("load", updateExchangeRate);
};

// Initialize the app
init();
