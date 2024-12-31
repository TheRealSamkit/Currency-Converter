const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";


const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const currCode = "";

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    const endpoint = `currencies/${fromCurr.value.toLowerCase()}.json`;
    const URL = `${BASE_URL}/${endpoint}`;
    console.log(BASE_URL, URL)
    try {
        msg.innerText = "Fetching exchange rate...";
        let response = await fetch(URL);
        console.log(response)
        if (!response.ok) throw new Error("Failed to fetch data");

        let data = await response.json();
        console.log(data);
        console.log("Hello", data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]);
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        console.log(rate)

        if (!rate) throw new Error("Exchange rate not available");

        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = `Error: ${error.message}`;
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
