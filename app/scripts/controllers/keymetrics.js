'use strict';

/**
 * @ngdoc function
 * @name corporateDashboardApp.controller:KeymetricsCtrl
 * @description
 * # KeymetricsCtrl
 * Controller of the corporateDashboardApp
 */
angular.module('corporateDashboardApp')
  .controller('KeymetricsCtrl',['GetData','$scope','$interval',function (objService,$scope,$interval) {
    var vm=this;
    vm.cntOpenIssues=0;
    vm.cntClosedIssues=0;
    vm.Customers=[];
    vm.Issues=[];
   /* vm.lineChart = {};*/
    var  customerData=function () {
      objService.getCustomers().then(function (csv) {
        var lines=csv.split("\n");

        vm.is_sameCust = (vm.Customers.length == lines.length) && vm.Customers.every(function(element, index) {
            return element === lines[index];
          });
        if(vm.is_sameCust){
          return;
        }
        vm.Customers=lines;
        var labels = [];
        var data = [];
        for(var i=1;i<lines.length;i++){
          var currentline=lines[i].split(",");
          labels.push(currentline[0]);
          data.push(currentline[1]);
        }

        $scope.$apply(
          vm.lineChart = {
            labels : labels,
            data :[ data],
            datasets : [
              {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",

              }
            ]
          }
        );

      });
    }
    customerData();

    var  IssuesData=function () {
      objService.getIssues().then(function (data) {

        vm.is_sameIssue = (vm.Issues.length == data.length) && vm.Issues.every(function(element, index) {
            return element === data[index];
          });
        if(vm.is_sameIssue){
          return;
        }

        vm.Issues=data;

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        var Issues = [0, 0, 0, 0, 0, 0, 0];
        $.map(data, function (item) {
          if (item.status === "open") {
            $scope.$apply(vm.cntOpenIssues++);
          }
          if (item.status === "closed") {
            vm.cntClosedIssues++;
          }
          var month = parseInt(item.created.split('-')[1]) - 1;
          Issues[month]++;
        });
        $scope.$apply(
          vm.barChart = {
            labels: months,
            data: Issues,
            datasets: [
              {
                label: "My First dataset",
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
              }
            ]
          }
        );
      });
    }
    IssuesData();
    vm.intervalFunction = function(){
     var interval= $interval(function() {
        customerData();
        IssuesData();
        vm.intervalFunction();
      }, 10000)
      $scope.$on('$destroy', function() {
        $interval.cancel(interval);
      });
    };
    vm.intervalFunction();


  }]);



