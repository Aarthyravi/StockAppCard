var initialStock = [
  {
    title: 'Google',
    symbol: 'GOOGL',
    quan: 4,
    stockPrice: 850,
    total: 0,
  },var initialStock = [
  {
    title: 'Google',
    symbol: 'GOOGL',
    quan: 4,
    stockPrice: 850,
    total: 0,
  }
];

t = 0;
var $totalport = $('#totalport');
/*for (i=0;i<initialStock.length;i++) {
  t += initialStock[i].quan * initialStock[i].stockPrice;
}
$total.append(t.toFixed(2))*/
var alphavantageUrl;


var yurl = "https://sheets.googleapis.com/v4/spreadsheets/1sIdMhMMOkxAI-s9xJ1nOLf6LtqaR2GArQlBSKyOcnXQ/values/Sheet1?key=AIzaSyAMygfS590YrNHD0sh838PLSoAb-jy4X90&alt=json";
$.ajax({
  url: yurl,
  dataType: "json",
  success: function( data ){
    console.log(data.values.length)
    //console.log(data.values[1][0])
    for (let j=1;j<data.values.length;j++) {
      // Get the data from the google spread row and update  the  initialStock list
      // data.values[j][0] -> stock symbol
      // data.values[j][1] -> stock current price
      // data.values[j][2] -> number of stocks bought
      // data.values[j][3] -> price of stock while bought
      // data.values[j][4] -> total cost while bought
      initialStock.push(
        {
          "title": data.values[j][0],
          "symbol": data.values[j][0],
          "quan":data.values[j][2],
          "stockPrice":data.values[j][3],
          "total":data.values[j][4]
        });

      alphavantageUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ data.values[j][0] + '&apikey=MC0RBZLQPSIREYCD';
      currentstock(function(Cdata,data1) {
        console.log(j + "asjka")
        console.log("aarthy")

        t1 += data.values[j][2] * Cdata;
        t += data.values[j][2] * data.values[j][3];
        stockdiff = cdata - data.values[j][2];


       document.getElementById("totalport").innerHTML = t.toFixed(2)
       document.getElementById("currentinfo").innerHTML = t1.toFixed(2)
       document.getElementById("gain").innerHTML = (t1 - t).toFixed(2)
       if((t1 - t).toFixed(2) < 0){
         document.getElementById("gain").style.backgroundColor = "#ff0000"
         document.getElementById("gain").style.color = "#ffffff"
       }
       else {
         document.getElementById("gain").style.backgroundColor = "#00cc00"
         document.getElementById("gain").style.color = "#ffffff"
       }
      });
    }
  }
});
t1 = 0
var $currenttotal = $('#currentinfo')
stockdiff =0
/*for (j=0;j<initialStock.length;j++) {
  var alphavantageUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ initialStock[j].symbol + '&apikey=MC0RBZLQPSIREYCD';
  currentstock(function(data,data1) {
    for (k=0;k<initialStock.length;k++) {
      if (initialStock[k].symbol == data1){
        t1 += initialStock[k].quan * data
        t += initialStock[k].quan * initialStock[k].stockPrice;
        stockdiff = data - initialStock[k].stockPrice;

      }
    }
   document.getElementById("totalport").innerHTML = t.toFixed(2)
   document.getElementById("currentinfo").innerHTML = t1.toFixed(2)
   document.getElementById("gain").innerHTML = (t1 - t).toFixed(2)
   if((t1 - t).toFixed(2) < 0){
     document.getElementById("gain").style.backgroundColor = "#ff0000"
     document.getElementById("gain").style.color = "#ffffff"
   }
   else {
     document.getElementById("gain").style.backgroundColor = "#00cc00"
     document.getElementById("gain").style.color = "#ffffff"
   }
  });
}*/

function currentstock (callback){
  $.ajax({
    url: alphavantageUrl,
    dataType: "json",
    success: function( data ){
      var stockdata = (data["Meta Data"]["2. Symbol"]);
      var stockdata1 = (data["Meta Data"]["3. Last Refreshed"]);
      var currentdate = new Date();
      var date =  currentdate.getFullYear() + "-"
                 + (currentdate.getMonth()+1)  + "-"
                 + ("0"+(currentdate.getDate())).slice(-2)
      var stockdata2 = (data["Time Series (Daily)"][stockdata1]["4. close"]);
      if(typeof callback === "function") callback(stockdata2,stockdata);
    }
  });
}

ko.bindingHandlers.modal = {
    init: function (element, valueAccessor) {
        $(element).modal({
            show: false
        });

        var value = valueAccessor();
        if (ko.isObservable(value)) {
            $(element).on('hide.bs.modal', function() {
               value(false);
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
           $(element).modal("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
}

var stockInformation = function (data) {
  this.title = (data.title);
  this.symbol = (data.symbol);
  this.total = (data.stockPrice * data.quan);
};

var ViewModel = function () {
  var self = this;

  self.currentModalItem = ko.observable(null);

  this.stockList = ko.observableArray([]);

  self.stock = function(){
    var $ul = $('#ul');
    $ul.text("");
    var $ul1 = $('#ul1');
    $ul1.text("");
    document.getElementById("currentinfop").style.display = "none"
    document.getElementById("gainp").style.display = "none"
    document.getElementById("currentinfo").style.display = "none"
    document.getElementById("gain").style.display = "none"
    initialStock.forEach(function (stockItem) {
      self.stockList.push(new stockInformation(stockItem));
    })
  };

  self.openModal = function (stockItem) {
    self.currentModalItem(stockItem);
    document.getElementById("stockdiff").innerHTML = stockdiff
    populate(stockItem)
  };
};

function populate(clickStock){

  var $stockElem = $('#info');
  $stockElem.text("");
  var googleUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ clickStock.symbol + '&apikey=MC0RBZLQPSIREYCD';
  $.ajax({
    url: googleUrl,
    dataType: "json",
    success: function( data ){
      var stockdata = (data["Meta Data"]["2. Symbol"]);
      var stockdata1 = (data["Meta Data"]["3. Last Refreshed"]);
      var currentdate = new Date();
      var date =  currentdate.getFullYear() + "-"
                 + (currentdate.getMonth()+1)  + "-"
                 + ("0"+(currentdate.getDate())).slice(-2)
      var stockdata2 = (data["Time Series (Daily)"][stockdata1]["4. close"]);
      $stockElem.append(stockdata,"<br><br>");
      $stockElem.append(date,"<br><br>");
      $stockElem.append(stockdata2);
  },
  error: function () {
    alert("There was an error.Failed to get Stock Data Try again please!");
  }
});

  return false;
}

var vm = new ViewModel();
ko.applyBindings(vm);

  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },
  {
    title: 'Apple',
    symbol: 'AAPL',
    quan: 2,
    stockPrice: 120,
    total: 0,
  },


];

t = 0;
var $totalport = $('#totalport');
/*for (i=0;i<initialStock.length;i++) {
  t += initialStock[i].quan * initialStock[i].stockPrice;
}
$total.append(t.toFixed(2))*/

t1 = 0
var $currenttotal = $('#currentinfo')
for (j=0;j<initialStock.length;j++) {
  var alphavantageUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ initialStock[j].symbol + '&apikey=xxxxxx';
  currentstock(function(data,data1) {
    for (k=0;k<initialStock.length;k++) {
      if (initialStock[k].symbol == data1){
        t1 += initialStock[k].quan * data
        t += initialStock[k].quan * initialStock[k].stockPrice;
      }
    }
   document.getElementById("totalport").innerHTML = t.toFixed(2)
   document.getElementById("currentinfo").innerHTML = t1.toFixed(2)
   document.getElementById("gain").innerHTML = (t1 - t).toFixed(2)
   if((t1 - t).toFixed(2) < 0){
     document.getElementById("gain").style.backgroundColor = "#ff0000"
     document.getElementById("gain").style.color = "#ffffff"
   }
   else {
     document.getElementById("gain").style.backgroundColor = "#00cc00"
     document.getElementById("gain").style.color = "#ffffff"
   }
  });
}

function currentstock (callback){
  $.ajax({
    url: alphavantageUrl,
    dataType: "json",
    success: function( data ){
      var stockdata = (data["Meta Data"]["2. Symbol"]);
      var stockdata1 = (data["Meta Data"]["3. Last Refreshed"]);
      var currentdate = new Date();
      var date =  currentdate.getFullYear() + "-"
                 + (currentdate.getMonth()+1)  + "-"
                 + ("0"+(currentdate.getDate())).slice(-2)
      var stockdata2 = (data["Time Series (Daily)"][stockdata1]["4. close"]);
      if(typeof callback === "function") callback(stockdata2,stockdata);
    }
  });
}

ko.bindingHandlers.modal = {
    init: function (element, valueAccessor) {
        $(element).modal({
            show: false
        });

        var value = valueAccessor();
        if (ko.isObservable(value)) {
            $(element).on('hide.bs.modal', function() {
               value(false);
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
           $(element).modal("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
}

var stockInformation = function (data) {
  this.title = (data.title);
  this.symbol = (data.symbol);
  this.total = (data.stockPrice * data.quan);
};

var ViewModel = function () {
  var self = this;

  self.currentModalItem = ko.observable(null);

  this.stockList = ko.observableArray([]);

  self.stock = function(){
    var $ul = $('#ul');
    $ul.text("");
    var $ul1 = $('#ul1');
    $ul1.text("");
    document.getElementById("currentinfop").style.display = "none"
    document.getElementById("gainp").style.display = "none"
    document.getElementById("currentinfo").style.display = "none"
    document.getElementById("gain").style.display = "none"
    initialStock.forEach(function (stockItem) {
      self.stockList.push(new stockInformation(stockItem));
    })
  };

  self.openModal = function (stockItem) {
    self.currentModalItem(stockItem);
  };
};

/*function populate(clickStock){

  var $stockElem = $('#info');
  $stockElem.text("");
  var googleUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ clickStock.symbol + '&apikey=xxxxx';
  $.ajax({
    url: googleUrl,
    dataType: "json",
    success: function( data ){
      var stockdata = (data["Meta Data"]["2. Symbol"]);
      var stockdata1 = (data["Meta Data"]["3. Last Refreshed"]);
      var currentdate = new Date();
      var date =  currentdate.getFullYear() + "-"
                 + (currentdate.getMonth()+1)  + "-"
                 + ("0"+(currentdate.getDate())).slice(-2)
      var stockdata2 = (data["Time Series (Daily)"][stockdata1]["4. close"]);
      $stockElem.append(stockdata,"<br><br>");
      $stockElem.append(date,"<br><br>");
      $stockElem.append(stockdata2);
  },
  error: function () {
    alert("There was an error.Failed to get Stock Data Try again please!");
  }
});

  return false;
}*/

var vm = new ViewModel();
ko.applyBindings(vm);
