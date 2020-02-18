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
    },
    budget : 0,
    percentage : -1
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach((item, i) => {
      sum = sum + item.value;
    });
    data.totals[type] = sum;
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
    },

    calculateBudget : function() {

      // 1. calc total income and expense
      calculateTotal('exp');
      calculateTotal('inc');

      // 2. calc budget income-exp
      data.budget = data.totals.inc - data.totals.exp;

      // 3. calc percentage of income that has been spent
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBudget : function() {
      return {
        budget : data.budget,
        totalIncome : data.totals.inc,
        totalExpense : data.totals.inc,
        percentage : data.percentage
      }
    },
  };

})();

// UI CONTORLLER - responsible for controlling and changing the UI
var UIController = (function() {

  var DOMStrings = {
    inputType : '.add__type',
    inputDescription : '.add__description',
    inputValue : '.add__value',
    inputBtn : '.add__btn',
    incomeContainer : '.income__list',
    expenseContainer : '.expenses__list',
  }


  return {
    getInput : function() {
      return {
        type : document.querySelector(DOMStrings.inputType).value, //either inc or exp
        description : document.querySelector(DOMStrings.inputDescription).value,
        value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    addListItem : function(obj, type) {
      var html, newHtml, element;

      // 1. create html string with place holder tags
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__des' +
        'cription">%description%</div><div class="right clearfix"><div class="item__value"' +
        '>%value%</div><div class="item__delete"><button class="item__delete--btn' +
        '"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else {
        element = DOMStrings.expenseContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">' +
        '%description%</div><div class="right clearfix"><div class="item__value">' +
        '%value%</div><div class="item__percentage">21%</div><div class="item__del' +
        'ete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i>' +
        '</button></div></div></div>'
      }

      // 2. replace placeholder with info
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // 3. insert html
      console.log(element);
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },
    getDOMStrings : function() { return DOMStrings; },

    clearFields : function() {
      var fields, fieldsArray;
      // returns a list so need to convert to array
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' +
                                         DOMStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach((current, index, array) => {
        current.value = "";
      });
      fieldsArray[0].focus();
    }
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

  var updateBudget = function() {

    // 1. calculate budget
    budgetCtrl.calculateBudget();

    // 2. return budget
    var budget = budgetCtrl.getBudget();

    // 3. display budget
    console.log(budget);
  }

  var ctrlAddItem = function() {

    var input, newItem

    // 1. get field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. add item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear the fields
      UICtrl.clearFields();

      // 5. calculate and update budget
      updateBudget();
    }
  }

  return {
    init : function() {
      console.log("Application Started");
      setUpEventListeners();
    }
  }



})(budgetController, UIController);


controller.init();
