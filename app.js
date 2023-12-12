const cuisineTypes = [
  "American",
  "Asian",
  "British",
  "Caribbean",
  "Chinese",
  "Indian",
  "French",
  "Italian",
  "Japanese",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "South American",
];

// Form input validation for Cuisine
const cuisineInput = document.getElementById("Cuisine");
console.log(cuisineInput.value);

const validateForm = () => {
  if (cuisineTypes.includes(cuisineInput.value)) {
    return true;
  } else {
    alert("Sorry Don't Have That Cuisine");
    return false;
  }
};

const health = document.getElementById("health");
const meal = document.getElementById("meal");
const dish = document.getElementById("dish");
const numberOfRecipes = document.getElementById("numberOfRecipes");

// Save the input value to local storage
function saveToLocalStorage() {
  const searchFor = `Searching for ${cuisineInput.value} ${meal.value} Recipes `;

  localStorage.setItem("searchText", searchFor);

  displaySavedValue();
}

// Get the saved value from local storage and display
function displaySavedValue() {
  const savedText = localStorage.getItem("searchText");

  const displayDiv = document.getElementById("display");
  displayDiv.innerHTML = `${savedText}`;
}

window.onload = displaySavedValue;

document.addEventListener("DOMContentLoaded", function () {
  const myForm = document.getElementById("myForm");
  const loadingSpinner = document.getElementById("loading-spinner");

  myForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // If validation fails prevent default form submission
    if (!validateForm()) {
      return false;
    }

    // Clear content
    const resultContainer = document.querySelector(".result-container");
    resultContainer.innerHTML = "";

    // Create url based on diet restrict
    const createURL = (health, cuisineType, mealType, dishType) => {
      const baseApiUrl = "https://api.edamam.com/api/recipes/v2?type=public";
      const queryString = `app_id=${app_id}&app_key=${app_key}&cuisineType=${cuisineType}&mealType=${mealType}&dishType=${dishType}&field=label&field=image&field=calories&field=ingredientLines&field=url&field=totalTime`;

      if (health === "None") {
        return `${baseApiUrl}&${queryString}`;
      } else {
        return `${baseApiUrl}&health=${health}&${queryString}`;
      }
    };

    const apiURL = createURL(
      health.value,
      cuisineInput.value,
      meal.value,
      dish.value
    );
    console.log(apiURL);

    // Display the loading spinner
    loadingSpinner.classList.remove("hidden");

    fetch(apiURL)
      .then(function (data) {
        return data.json();
      })
      .then(function (responseJson) {
        const recipeArray = responseJson.hits;
        console.log(recipeArray);

        const mybody = document.querySelector(".result-container");

        // Using number of recipes to return the requested recipes total
        for (let i = 0; i < numberOfRecipes.value; i++) {
          const displayContent = document.createElement("div");

          let label = recipeArray[i].recipe.label;
          let img = recipeArray[i].recipe.image;
          let resURL = recipeArray[i].recipe.url;
          let calories = recipeArray[i].recipe.calories;
          let timeInMinutes = recipeArray[i].recipe.totalTime;
          let ingred = recipeArray[i].recipe.ingredientLines;

          // Label
          const name = document.createElement("h2");
          name.appendChild(document.createTextNode(label));

          // Image
          const foodIMG = document.createElement("img");
          foodIMG.src = img;

          // Calories
          const cal = document.createElement("p");
          cal.appendChild(
            document.createTextNode(`Calories: ${Math.trunc(calories)}`)
          );

          // Ingredients
          const ing = document.createElement("p");
          ing.appendChild(document.createTextNode(`Ingredients:`));
          ing.appendChild(document.createElement("br"));

          // Adding line break to ingredients
          for (let x = 0; x < ingred.length; x++) {
            ing.appendChild(document.createTextNode(`${ingred[x]}`));

            if (x < ingred.length - 1) {
              ing.appendChild(document.createElement("br"));
            }
          }

          // Time
          const timeM = document.createElement("p");
          timeM.appendChild(
            document.createTextNode(`Cook Time: ${timeInMinutes} minutes`)
          );

          // Recipe link
          const link = document.createElement("a");
          link.href = resURL;
          link.target = "_blank";
          link.appendChild(document.createTextNode("Recipe"));

          displayContent.classList.add("result-item");

          // Adding all the elements to the display
          const elements = [name, foodIMG, cal, ing, timeM, link];
          elements.forEach((element) => displayContent.appendChild(element));

          mybody.append(displayContent);
        }

        //Hiding the loading spinner after two seconds of spinning
        setTimeout(function () {
          loadingSpinner.classList.add("hidden");
        }, 2000);
      })
      // Helpful error text based api limitations
      .catch((error) => {
        console.error(
          "Error fetching: API doesn't have enough recipes to fill your request",
          error
        );
        loadingSpinner.classList.add("hidden");
      });
  });
});
