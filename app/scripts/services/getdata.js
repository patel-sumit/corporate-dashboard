'use strict';

/**
 * @ngdoc service
 * @name corporateDashboardApp.GetData
 * @description
 * # GetData
 * Service in the corporateDashboardApp.
 */
angular.module('corporateDashboardApp')
  .service('GetData', function () {
    this.getEmployees = function() {
      return $.get('./data/employees.json');
    };
    this.getCustomers = function() {
      return $.get('./data/customers.csv');
    };
    this.getIssues = function() {
      return $.get('./data/issues.json');
    };
  });
