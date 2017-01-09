'use strict';

/**
 * @ngdoc overview
 * @name corporateDashboardApp
 * @description
 * # corporateDashboardApp
 *
 * Main module of the application.
 */
angular
  .module('corporateDashboardApp', ['ui.router','ui.grid','chart.js'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('geospatial', {
      url: '/',
      templateUrl: 'views/geospatial.html',
      controller: 'GeospatialCtrl as dashboard'
    })
    .state('keyMetrics', {
      url: '/keymetrics',
      templateUrl: 'views/keymetrics.html',
      controller: 'KeymetricsCtrl as dashboard'
    })
    .state('data', {
      url: '/data',
      templateUrl: 'views/data.html',
      controller: 'DataCtrl as dashboard'
    });
}]);
