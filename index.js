import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

//what connects our app with firebase
const appSettings = {
  databaseURL: "https://shopping-list-6e0b7-default-rtdb.firebaseio.com",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
//a location inside  the database, say where we wanna store the data. Takes two
//arguments; the database and then the name you wanna give it
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEL = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
});

//fetching the data from the database.
onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingList = Object.entries(snapshot.val());
    clearShoppingListEl();
    for (let list of shoppingList) {
      appendItemToShoppingListEl(list);
    }
  } else {
    shoppingListEL.innerHTML = "No items here... yet";
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}
function clearShoppingListEl() {
  shoppingListEL.innerHTML = "";
}
function appendItemToShoppingListEl(item) {
  //   shoppingListEL.innerHTML += `
  //         <li>${itemValue}</li>
  //     `;
  let currentItemId = item[0];
  let currentItemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = currentItemValue;
  newEl.addEventListener("click", function () {
    let exactLocationofItemInDB = ref(
      database,
      `shoppingList/${currentItemId}`
    );
    remove(exactLocationofItemInDB);
  });
  shoppingListEL.append(newEl);
}
