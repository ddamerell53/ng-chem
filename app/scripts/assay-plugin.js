'use strict';

/**
 * @ngdoc overview
 * @name chembiohubAssayApp
 * @description
 * # chembiohubAssayApp
 *
 * Assay plugin module of the application.
 */
angular.module('chembiohubAssayApp')


.config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {


        $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================

        .state('cbh.assay', {
            url: '/assay',
            template: '<div ui-view ></div>',
            
        })
        .state('cbh.assay.add', {
            url: '/add',
            templateUrl: 'views/assay-add.html',
        })
        .state('cbh.assay.clone', {
            url: '/clone',
            templateUrl: 'views/assay-clone.html',
        })
        .state('cbh.assay.edit', {
            url: '/edit',
            templateUrl: 'views/assay-edit.html',
        })
        .state('cbh.assay.view', {
            url: '/view',
            templateUrl: 'views/assay-view.html',
        })



    });