'use strict';

/**
 * @ngdoc function
 * @name corporateDashboardApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the corporateDashboardApp
 */
angular.module('corporateDashboardApp')
 .controller('DataCtrl', ['GetData','$interval','$scope','$filter',function (objService,$interval,$scope,$filter) {
  var vm=this;
   vm.Issues=[];
// Initialize gridOptions with all the properties, except for data
   vm.filterOptions = {
     filterText: ''
   };
   vm.gridOptions={};
   vm.gridOptions.data = [];
   var IssuesData=function () {
     objService.getIssues().then(function(data) {
       vm.is_same = (vm.Issues.length == data.length) && vm.Issues.every(function(element, index) {
           return element === data[index];
         });
       if(vm.is_same){
         return;
       }
       vm.Issues=data;
         vm.gridOptions = {
             data: [],
             enableFiltering: true,
             resizable: true,
             columnDefs: [
                 { field: 'created', name:"Created",type: 'date',resizable: true,
                     cellFilter : 'date:"dd-MMM-yy"',
                     filterCellFiltered : 'true',
                     cellTemplate : '<div title="{{COL_FIELD | date:\'dd MMM,yyyy\' }}">{{COL_FIELD | date:"dd MMM,yyyy"  }}</div>',
                     headerTooltip : true,
                     width:150
                 },
                 { field: 'closed',  name:"Closed",resizable: true,
                     cellTemplate : '<div title="{{COL_FIELD | date:\'dd MMM,yyyy\' }}">{{COL_FIELD | date:"dd MMM,yyyy"  }}</div>',
                     headerTooltip : true,width:150},
                 { field: 'employee_name', name:'Employee', headerTooltip : true,width:150},
                 { field: 'customer_email',name:'Email',width:150},
                 { field: 'customer_name', name:'Customer', headerTooltip : true,width:150},
                 { field: 'status', name:'status', headerTooltip : true,
                     width:100,
                     cellClass: function(grid, row, col, rowIndex, colIndex) {
                         var val = grid.getCellValue(row, col);
                         if (val === 'open') {
                             return 'red';
                         }
                         else if (val === 'closed') {
                             return 'green';
                         }
                     }},
                 {
                     name: 'description',
                     field: 'description',
                     enableFiltering: false,
                     resizable: true,
                     cellTemplate : '<div  title="{{COL_FIELD}}" class="ui-grid-cell-contents" >{{COL_FIELD}}</div>' ,
                     headerTooltip : true,width:800
                 },

             ]
         },

       $scope.$apply(
           vm.gridOptions.data = data
        );
     });
   };
   IssuesData();

     vm.intervalFunction = function(){
    var interval= $interval(function() {
       IssuesData();
       vm.intervalFunction();
     }, 40000);
     $scope.$on('$destroy', function() {
       $interval.cancel(interval);
     })
   };
   vm.intervalFunction();
     $scope.refreshData = function() {
         $scope.$apply(
             vm.gridOptions.data = $filter('filter')(vm.Issues, $scope.searchText, undefined)
          );

     };
}]);
