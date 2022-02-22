const search = document.getElementById("search");
const searchBtn = document.getElementById("submit");
const randomBtn = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMealEl = document.getElementById("single-meal");

//Search meals and fetch API
function searchMeal(e) {
  e.preventDefault(); //Bc it is a "submit" event listener

  //Clear single meal result
  singleMealEl.innerHTML = "";

  //Get search keyword
  const keyword = search.value.toLowerCase();
  resultHeading.innerHTML = `<h2>Search results for "${keyword}"</h2>`;

  if (keyword.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>There are no search results for "${keyword}"</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt ="${meal.strMeal}" />

              <div class="meal-info" data-mealID="${meal.idMeal}">
                 <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join("");
        }
      });

    search.value = "";
  } else {
    alert(`Please choose a meal or click random meal suggestion`);
  }
}

//Display specific meal
function displayMeal(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
      <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt ="${meal.strMeal}" />
        <div class="single-meal-info">
          <p><strong>Area:</strong> ${meal.strArea}</p>
          <p><strong>Category:</strong> ${meal.strCategory}</p>
        </div>

        <div class="main">
          <h2>Instructions</h2>
          <p>${meal.strInstructions}</p>

          <h2>Ingredients</h2>
          <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>

          <h2> 
          <a href="${meal.strSource}" alt="Page link"> Direction to source </a>
          </h2>
        </div>
      </div>
      `;
}

//Get specific meal by ID
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => displayMeal(data.meals[0]));
}

//Fetch and get random meal
function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => displayMeal(data.meals[0]));
}

//Add event listener
searchBtn.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});
randomBtn.addEventListener("click", getRandomMeal);
