var initialStock = [
/*  {
    "PortfolioName": 'Yogesh',
    "Name": 'Google',
    "Symbol": 'GOOGL',
    "Segment": 'Technology',
    "SharesOwned": 2.89,
    "Cost": 124,
    "PricePerShare": 43,
  }*/
];
var accountList = [];
var portfolioDetails = [];

var alphavantageUrl;

// Getting The acccount information

var yurl = "https://sheets.googleapis.com/v4/spreadsheets/xxxx/values/Accounts?key=xxxxxx&alt=json";
console.log(yurl)
$.ajax({
  url: yurl,
  dataType: "json",
  success: function( data ){
    console.log(data.values.length)
    //console.log(data.values[1][0])
    for (let j=1;j<data.values.length;j++) {
      // Get the data from the google spread row and update  the  initialStock list
      // data.values[j][0] -> PortfolioIndex
      // data.values[j][1] -> Name
      accountList.push(
        {
          "PortfolioIndex": data.values[j][0],
          "Name": data.values[j][1],
        });
       console.log('account list length in inner',accountList.length)
       var yurl = 'https://sheets.googleapis.com/v4/spreadsheets/xxxx/values/' + accountList[j-1].PortfolioIndex+'?key=xxxxx&alt=json';
       console.log(yurl)
       $.ajax({
         url: yurl,
         dataType: "json",
         success: function( data ){
           for (let k=1;k<data.values.length;k++) {
             // Get the data from the google spread row and update  the  initialStock list
             // data.values[j][0] -> PortfolioName
             // data.values[j][1] -> Name
             portfolioDetails.push(
               {
                 "PortfolioName": data.values[k][0],
                 "Name": data.values[k][1],
               });

               getAccountDetails(data.values[k][1]);

            }

          }
        });

     }

   }
 });


var stockdiff = [];
t1 = 0
t = 0

function getAccountDetails(name_obj) {
   console.log('called getAccountDetails'+name_obj);
   console.log(portfolioDetails.length+'portfolioDetails.length')

    var yurl = 'https://sheets.googleapis.com/v4/spreadsheets/xxxx/values/'+name_obj+'?key=xxxx&alt=json';
    console.log(yurl)
    $.ajax({
      url: yurl,
      dataType: "json",
      success: function( data ){
        console.log(data.values.length)
        //console.log(data.values[1][0])
        for (let j=1;j<data.values.length;j++) {
          // Get the data from the google spread row and update  the  initialStock list
          // data.values[j][0] -> Portfolio name
          // data.values[j][1] -> Name
          // data.values[j][2] -> Symbol
          // data.values[j][3] -> Segment
          // data.values[j][4] -> Shares Owned
          // data.values[j][5] -> Cost
          // data.values[j][6] -> Price Per share
          initialStock.push(
            {
              "PortfolioName": data.values[j][0],
              "Name": data.values[j][1],
              "Symbol": data.values[j][2],
              "Segment": data.values[j][3],
              "SharesOwned": data.values[j][4],
              "Cost": data.values[j][5],
              "PricePerShare": data.values[j][6],
            });
            console.log(data.values[j][2]);


          alphavantageUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ data.values[j][2] + '&apikey=xxxxx';
          currentstock(function(Cdata,data1) {
            t1 += data.values[j][4] * Cdata;
            t += data.values[j][4] * data.values[j][6];

            stockdiff.push((Cdata - data.values[j][6]).toFixed(2));

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
}
console.log(stockdiff)
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
  this.Name = (data.Name);
  this.Symbol = (data.Symbol);
  this.Cost = (data.Cost);
};

var portfolioInfo = function (data){
  this.PortfolioName = (data.PortfolioName);
  this.Name = (data.Name);
}

var ViewModel = function () {
  var self = this;

  self.currentModalItem = ko.observable(null);

  this.stockList = ko.observableArray([]);

  this.portfolioList = ko.observableArray([]);

  self.portfolio = function(){
    $('#ul1').text("");
    $('#accountname').text("");
    $('#ul').text("");
    $('#ul0').text("");
    portfolioDetails.forEach(function(Item){
      self.portfolioList.push(new portfolioInfo(Item));
    })
  };

  self.stock = function(click){
    $('#ul').text("");
    $('#ul1').text("");
    $("#totalportp").hide("fast");
    $("#totalport").hide("fast");
    $("#currentinfop").hide("fast");
    $("#currentinfo").hide("fast");
    $("#gainp").hide("fast");
    $("#gain").hide("fast");
    document.getElementById("accountname").innerHTML = click.Name + "'s Stock Lists"
    var yurl = 'https://sheets.googleapis.com/v4/spreadsheets/xxxxx/values/'+click.Name+'?key=xxxx&alt=json';
    $.ajax({
      url: yurl,
      dataType: "json",
      success: function( data ){
        initialStock.forEach(function(Item) {
          if(click.PortfolioName == Item.PortfolioName){
            self.stockList.push(new stockInformation(Item));
          }
        })
      }
  })
};

  self.openModal = function (stockItem) {
    self.currentModalItem(stockItem);
    populate(stockItem)
    //document.getElementById("stockdiff").innerHTML = stockdiff
  };
};

function populate(clickStock){

  var $stockElem = $('#info');
  $stockElem.text("");
  var googleUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ clickStock.Symbol + '&apikey=xxxx';
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
