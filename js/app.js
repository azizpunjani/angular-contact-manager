
var contactManager = angular.module('ContactManager', ['ngResource']);
var globalContact; 
contactManager.controller('ListController', ['$scope','Contacts' , function($scope, Contacts) {
    globalContacts = Contacts;
    $scope.contacts = Contacts.getAll(); 
    $scope.getFullName = function(contact) {
        return [contact.name.first, contact.name.last].join('_');
    }

    $scope.delete = function(contact) {
        contact.$delete(function(){
        });
    }

    deleteContact = function(contact) {
        if (contact._id in $scope.contacts) {
            delete $scope.contacts[contact._id];
        }
    }
}]);

contactManager.controller('CreateController', ['$scope', 'Contacts', function($scope, Contacts) {
    
}]);

contactManager.controller('EditController', ['$scope','$routeParams', '$location', 'Contacts', function($scope, $routeParams, $location, Contacts) {
    $scope.contact = Contacts.get($routeParams.id);
    $scope.save = function() {
        Contacts.update($scope.contact, function(){
            $location.path('/');  
        });
    }
}]);

contactManager.config(['$routeProvider', function($routeProvider){
   $routeProvider
    .when('/', { controller: 'ListController', templateUrl: 'app/js/views/list.html' })
    .when('/create', { controller: 'CreateController', templateUrl: 'app/js/views/create.html' })
    .when('/edit/:username/:id', { controller: 'EditController', templateUrl: 'app/js/views/edit.html' })
    .otherwise('/'); 
}]);

contactManager.factory('Contacts', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
   var cachedContacts = {},
       Contacts; 

    Contacts = $resource('/contacts/:id',{ id: '@_id' }, {
        query: { method: 'GET', params: { id: '' }, isArray: true },
        update: { method: 'PUT', params: { id: '@id' } }
    });
    
    populateCache = function(contacts) {
        contacts.forEach(function(contact) {
           cachedContacts[contact._id] = contact; 
        });
    }

    isNotEmpty = function(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return true; 
            }
        }
        return false;
    }

    return {
        getAll: function(useCache) {                
            var contacts,
            useCache = useCache || true;

            if (isNotEmpty(cachedContacts) && useCache) {
                return cachedContacts;      
            } else {
                contacts = Contacts.query(function(){
                    populateCache(contacts);
                });
                return contacts;
            }
        },
        get: function(id) {
            var contact, 
                cachedContact;

            if (isNotEmpty(cachedContacts) && id in cachedContacts) {
                return cachedContacts[id]; 
            } else {
                contact = Contacts.get({ id: id });
            }
        }, 
        create: function(contact, success, failure) {
           var newContact = new Contacts(contact);

           newContact.$save(function(createdContact){
              cachedContacts[createdContact._id] = createdContact;
              if (typeof success === 'function') {
                  success.apply(null, arguments); 
              }
           }, function(){
              if (typeof failure === 'function') {
                  failure.apply(null, arguments); 
              }
           });
        },
        update: function(contact, success) {
            contact.$update(function(){
               success();
            });  
        },
        getCache: function() { return cachedContacts; } 
    }
}]);
