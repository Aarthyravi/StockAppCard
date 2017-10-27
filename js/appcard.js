var initialStock = [
  {
    title: 'Google',
    symbol: 'GOOGL',
    quan: 4,
    stockPrice: 850,
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
  var alphavantageUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ initialStock[j].symbol + '&apikey=MC0RBZLQPSIREYCD';
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
      var currentdate = new Date();
      var date =  currentdate.getFullYear() + "-"
                 + (currentdate.getMonth()+1)  + "-"
                 + ("0"+(currentdate.getDate())).slice(-2)
      var stockdata2 = (data["Time Series (Daily)"][date]["4. close"]);
      if(typeof callback === "function") callback(stockdata2,stockdata);
    }
  });
}


var stockInformation = function (data) {
  this.title = (data.title);
  this.symbol = (data.symbol);
  this.total = (data.stockPrice * data.quan);
};

var ViewModel = function () {
  var self = this;

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

  this.changeStock = function (clickStock) {
    populate(clickStock);
  };
}

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
      var stockdata2 = (data["Time Series (Daily)"][date]["4. close"]);
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
