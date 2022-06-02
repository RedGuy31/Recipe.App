import * as model from "./model.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import recipeView from "./views/recipeView.js";
import bookMarksView from "./views/bookMarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import icons from "url:../img/icons.svg";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime/runtime";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // resu;ts wiev
    resultsView.update(model.getSearchResultsPage());
    bookMarksView.update(model.state.bookmarks);
    //load

    await model.loadRecipe(id);

    //render
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const cotrolSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Search Query
    const query = searchView.getQuery();
    if (!query) return;
    // load results
    await model.loadSearchResult(query);

    // render

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //  render buttens
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //  render  new bagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe
  model.updateServings(newServings);
  // update recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookMarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookMarksView.render(model.state.bookmarks);

    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 500);
  } catch (err) {
    console.error(`##@## `, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(cotrolSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
