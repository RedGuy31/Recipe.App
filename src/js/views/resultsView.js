import View from "./views";
import icons from "../../img/icons.svg";
import recipeView from "./recipeView";
import previewView from "./previewView";

class ResultsView extends View {
  _parentElement = document.querySelector(`.results`);
  _errorMessage = `No Recipes were Found`;
  _message = ``;

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join(``);
  }
}

export default new ResultsView();
