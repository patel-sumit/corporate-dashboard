'use strict';

/**
 * @ngdoc function
 * @name corporateDashboardApp.controller:GeospatialCtrl
 * @description
 * # GeospatialCtrl
 * Controller of the corporateDashboardApp
 */
angular.module('corporateDashboardApp')
  .controller('GeospatialCtrl', ['GetData','$interval','$scope',function (objService,$interval,$scope) {
    var vm=this;
    vm.cities=[];
    vm.is_same=false;
    var employeeData=function() {

      objService.getEmployees().then(function (data) {

        vm.is_same = (vm.cities.length == data.length) && vm.cities.every(function(element, index) {
            return element === data[index];
          });
        if(vm.is_same){
          return;
        }

        vm.cities = data;
        var mapOptions = {
          zoom: 4,
          center: new google.maps.LatLng(40.0000, -98.0000),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        vm.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {

          var marker = new google.maps.Marker({
            map: vm.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
          });
          marker.content = '<div class="infoWindowContent">' + info.employees + '  employees' + '</div>';

          google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open(vm.map, marker);
          });

          $scope.$apply(vm.markers.push(marker));

        };

        for (var i = 0; i < vm.cities.length; i++) {
          createMarker(vm.cities[i]);
        }

        vm.openInfoWindow = function (e, selectedMarker) {
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
        };
        $('#map_canvas').height($(window).height());

// Resize stuff...
        google.maps.event.addDomListener(window, "resize", function () {
          var center = vm.map.getCenter();
          google.maps.event.trigger(vm.map, "resize");
          vm.map.setCenter(center);
          $('#map_canvas').height($(".panel-body").height());
        });
      })
    }
    employeeData();
    // Function to replicate setInterval using $timeout service.
    vm.intervalFunction = function(){
     var interval= $interval(function() {
        employeeData();
       /* $scope.$apply;*/
        vm.intervalFunction();
      }, 10000);
      $scope.$on('$destroy', function() {
        $interval.cancel(interval);
      });
    };
    vm.intervalFunction();



  }]);
