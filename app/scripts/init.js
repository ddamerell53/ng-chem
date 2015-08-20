'use strict';

//http://bahmutov.calepin.co/inject-valid-constants-into-angular.html


var lightApp = angular.module('lightApp', [
        'angular-underscore/filters', 
    'schemaForm', 
    'pascalprecht.translate', 
    'ui.select', 
    'ui.sortable'
  ]);

var chembiohubAssayApp =  angular.module('chembiohubAssayApp', [
    'lightApp',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngGrid',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'ui.ace',
    'dndLists',
    'flow',
    'ngClipboard',
    'ngRaven',
    'angular-underscore/filters', 
    'schemaForm', 
    'pascalprecht.translate', 
    'ui.select', 
    'ui.sortable',
    'angularUtils.directives.dirPagination',
    'angular-info-box',
    'elasticui',
  ]);
