var contactManager = angular.module('ContactManager', ['ngResource']);

contactManager.config(['$routeProvider', function($routeProvider){
   $routeProvider
    .when('/', { controller: 'ListController', templateUrl: '/js/views/list.html' })
    .when('/create', { controller: 'CreateController', templateUrl: '/js/views/edit.html' })
    .when('/edit/:username/:id', { controller: 'EditController', templateUrl: '/js/views/edit.html' })
    .otherwise('/'); 
}]);
