/* jshint esversion: 6 */

document.addEventListener("DOMContentLoaded", function () {
  const passwordGeneratorCheckbox = document.getElementById(
    "passwordGeneratorCheckbox"
  );
  const quotesCheckbox = document.getElementById("quotesCheckbox");
  const userInput = document.getElementById("userInput");
  const apiResponse = document.getElementById("apiResponse");
  const apiSubmitButton = document.getElementById("apiSubmitButton");
  const apiKey = "OsN9vRvLgT/34FimLo7b3A==vhKDOmso0TFaQVmr";

  function clearInputAndResponse() {
    userInput.value = "";
    apiResponse.innerHTML = "";
  }

  passwordGeneratorCheckbox.addEventListener("change", () => {
    if (passwordGeneratorCheckbox.checked) {
      quotesCheckbox.checked = false;
      clearInputAndResponse();
    }
  });

  quotesCheckbox.addEventListener("change", () => {
    if (quotesCheckbox.checked) {
      passwordGeneratorCheckbox.checked = false;
      clearInputAndResponse();
    }
  });

  apiSubmitButton.addEventListener("click", (event) => {
    event.preventDefault();

    let selectedApi = null;

    if (document.getElementById("passwordGeneratorCheckbox").checked) {
      selectedApi = "passwordGenerator";
    } else if (document.getElementById("quotesCheckbox").checked) {
      selectedApi = "quotes";
    } else {
      apiResponse.innerHTML = "Please select an API.";
      return;
    }

    let userInputValue = userInput.value.trim();

    let previousContent = "";

    if (selectedApi === "quotes" && userInputValue) {
      previousContent = `<p>Category parameter is for premium subscribers only. Fetching a random quote instead.</p>`;
      userInputValue = "";
    }

    let apiURL = "";

    if (selectedApi === "passwordGenerator") {
      const length = parseInt(userInputValue, 10);
      if (isNaN(length) || length < 1 || length > 64) {
        apiResponse.innerHTML =
          "Please enter a number in between 1 to 64 for valid password length.";
        return;
      }
      apiURL = `https://api.api-ninjas.com/v1/passwordgenerator?length=${userInputValue}`;
    } else if (selectedApi === "quotes") {
      if (userInputValue) {
        apiURL = `https://api.api-ninjas.com/v1/quotes?category=${userInputValue}`;
      } else {
        apiURL = `https://api.api-ninjas.com/v1/quotes`;
      }
    }

    fetch(apiURL, {
      headers: { "X-Api-Key": apiKey },
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            const errorMessage =
              data.error ||
              data.message ||
              data.detail ||
              `API request failed with status: ${response.status}`;
            throw new Error(errorMessage);
          }
          return data;
        });
      })

      .then((data) => {
        console.log("API Response:", data);

        if (selectedApi === "passwordGenerator") {
          apiResponse.innerHTML = `<p><strong>Hope you like the results!</strong></p>
                                              <p>Generated Password: ${data.random_password}</p>`;
        } else if (selectedApi === "quotes") {
          const quote = data[0];
          apiResponse.innerHTML =
            previousContent +
            `<p><strong>Hope you like the results!</strong></p>
                                              <p><strong>Quote:</strong> ${quote.quote}</p>
                                              <p><strong>Author:</strong> ${quote.author}</p>
                                              <p><strong>Category:</strong> ${quote.category}</p>`;
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        apiResponse.innerHTML = `Error: ${error.message}`;
      });
  });
});
