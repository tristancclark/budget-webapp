// BUDGET CONTROLLER - responsible for controlling data
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100)
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() { return this.percentage; };

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

    calculatePercentages : function() {
      data.allItems.exp.forEach((item) => {
        item.calcPercentage(data.totals.inc);
      });
    },

    getPercentages : function() {
      var allPercentages = data.allItems.exp.map(item => {
        return item.getPercentage();
      })
      return allPercentages
    },

    getBudget : function() {
      return {
        budget : data.budget,
        totalIncome : data.totals.inc,
        totalExpense : data.totals.exp,
        percentage : data.percentage
      }
    },

    deleteItem : function(type, id) {
      var ids = data.allItems[type].map((item) => {
        return item.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1)
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
    budgetLabel : '.budget__value',
    incomeLabel : '.budget__income--value',
    expenseLabel : '.budget__expenses--value',
    percentageLabel : '.budget__expenses--percentage',
    container : '.container',
    expensesPecLabel : '.item__percentage',
    dateLabel : '.budget__title--month',
  }

  var formatNumber = function(num, type) {
    var numSplit, int, decimal;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];
    decimal = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;
  };


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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__des' +
        'cription">%description%</div><div class="right clearfix"><div class="item__value"' +
        '>%value%</div><div class="item__delete"><button class="item__delete--btn' +
        '"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else {
        element = DOMStrings.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">' +
        '%description%</div><div class="right clearfix"><div class="item__value">' +
        '%value%</div><div class="item__percentage">21%</div><div class="item__del' +
        'ete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i>' +
        '</button></div></div></div>'
      }

      // 2. replace placeholder with info
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
    },
    displayBudget : function(obj) {
      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      }else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
      document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');
    },

    deleteItem : function(selectorID) {
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    displayPercentages : function(percentages) {

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      }
      var fields = document.querySelectorAll(DOMStrings.expensesPecLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth : function() {
      var now, year;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  }

  var updateBudget = function() {

    // 1. calculate budget
    budgetCtrl.calculateBudget();

    // 2. return budget
    var budget = budgetCtrl.getBudget();

    // 3. display budget
    UICtrl.displayBudget(budget);
  }

  var updatePercentages = function() {

    // 1. calc percentages
    budgetCtrl.calculatePercentages();

    // 2. read from budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. update UI
    UICtrl.displayPercentages(percentages);
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

      // 6. update updatePercentages
      updatePercentages();
    }
  }

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
    }

    // 1. delete item from data structure
    budgetCtrl.deleteItem(type, ID);

    // 2. delete item from UI
    UICtrl.deleteItem(itemID);

    // 3. update and show new budget
    updateBudget();

    // 4. update updatePercentages
    updatePercentages();
  };

  return {
    init : function() {
      console.log("Application Started");
      UICtrl.displayBudget({
        budget : 0,
        totalIncome : 0,
        totalExpense : 0,
        percentage : -1
      });
      setUpEventListeners();
      UICtrl.displayMonth();
    }
  }



})(budgetController, UIController);


controller.init();
