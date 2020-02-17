// BUDGET CONTROLLER - responsible for controlling data
var budgetController = (function() {

})();

// BUDGET CONTORLLER - responsible for controlling and changing the UI
var UIController = (function() {

  var DOMStrings = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn'
  }


  return {
    getInput : function() {
      return {
        type : document.querySelector(DOMStrings.inputType).value, //either inc or exp
        description : document.querySelector(DOMStrings.inputDescription).value,
        value : document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings : function() { return DOMStrings; }
  };
})();

// overall APP CONTROLLER - responsible for connecting other controllers
//only pass these variables to make renaming easier - good practice
var controller = (function(budgetCtrl, UICtrl) {

  var setUpEventListeners = function() {

    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  }

  var ctrlAddItem = function() {

    // 1. get field input data
    var input = UICtrl.getInput()

    // 2. add item to budget controller

    // 3. add item to the UI

    // 4. calculate budget

    // 5. display budget in the UI
  }

  return {
    init : function() {
      console.log("Application Started");
      setUpEventListeners();
    }
  }



})(budgetController, UIController);


controller.init();
