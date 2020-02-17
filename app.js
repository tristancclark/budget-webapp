// BUDGET CONTROLLER - responsible for controlling data
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems : {
      exp : [],
      inc : []
    },
    totals : {
      exp : 0,
      inc : 0
    }
  };

  return {
    addItem : function(type, des, val) {

      // 1. Create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else{
        ID = 0;
      }

      // 2. Create new item depending on type
      var newItem;
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // 3. push item onto data structure
      data.allItems[type].push(newItem);

      // 4. return new element
      return newItem;
    }
  };

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

    var input, newItem

    // 1. get field input data
    input = UICtrl.getInput();

    // 2. add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

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
