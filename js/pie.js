
var pieData = [
   {
     "PortfolioName": 'Yogesh',
     "Name": 'Google',
     "Symbol": 'GOOGL',
      value: "17.8",
      label: 'Java',
      color: '#811BD6'
   },
   {
     "PortfolioName": 'Yogesh',
     "Name": 'Google',
     "Symbol": 'GOOGL',
      value: "10",
      label: 'Scala',
      color: 'Yellow'
   }

];


pieData.forEach(function (e, i) {
e.color = "hsl(" + (i / pieData.length * 360) + ", 50%, 50%)";
e.highlight = "hsl(" + (i / pieData.length * 360) + ", 50%, 70%)";
// + any other code you need to make your element into a chart.js pie element
})
var context = document.getElementById('skills').getContext('2d');
var skillsChart = new Chart(context).Pie(pieData);
console.log(skillsChart)
