
var contactManager = angular.module('ContactManager', ['ngResource']);
contactManager.controller('ListController', ['$scope','Contacts' , function($scope, Contacts) {
    globalContacts = Contacts;
    $scope.contacts = Contacts.getAll(); 
    $scope.getFullName = function(contact) {
        return [contact.name.first, contact.name.last].join('_');
    }

    $scope.delete = function(contact) {
        Contacts.delete(contact, function(){

        });
    }
}]);

contactManager.controller('CreateController', ['$scope', 'Contacts', function($scope, Contacts) {
    
}]);

contactManager.controller('EditController', ['$scope','$routeParams', '$location', 'Contacts', function($scope, $routeParams, $location, Contacts) {
    $scope.contact = Contacts.get($routeParams.id);
    $scope.save = function() {
        $scope.contact.$update(function(){
            $location.path('/');
        });
    }

    $scope.delete = function() {
        Contacts.delete($scope.contact, function(){
            $location.path('/');    
        });
    }

    $scope.cancel = function() {
        $location.path('/');
    }
}]);

contactManager.config(['$routeProvider', function($routeProvider){
   $routeProvider
    .when('/', { controller: 'ListController', templateUrl: '/js/views/list.html' })
    .when('/create', { controller: 'CreateController', templateUrl: '/js/views/create.html' })
    .when('/edit/:username/:id', { controller: 'EditController', templateUrl: '/js/views/edit.html' })
    .otherwise('/'); 
}]);

contactManager.factory('Contacts', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
   var cache,
       Contacts; 

    Contacts = $resource('/contacts/:id',{ id: '@_id' }, {
        query: { method: 'GET', params: { id: '' }, isArray: true },
        update: { method: 'PUT', params: { id: '@id' } }
    });

    cache = (function(){
        var contacts = [];
        return {
            hasContacts: function() {
                return contacts.length > 0;
            }, 

            getContacts: function() {
                return contacts;
            }, 

            putContacts: function(newContacts) {
                contacts = newContacts;
            }, 

            addContact: function(contact) {
                contacts.push(contact);
            },

            indexOf: function(id) {
                var arrayIndex; 
                contacts.forEach(function(contact, index){
                    if (id === contact._id) {
                        arrayIndex = index;
                    }
                });
                return arrayIndex;
            },

            removeContact: function(id) {
                contacts.forEach(function(contact, index){
                    if (id === contact._id) {
                        contacts.splice(index, 1);
                        return true;
                    }
                });
            },

            removeContactByIndex: function(index) {
                contacts.splice(index, 1);
            },

            getContact: function(id) {
                var cachedContact; 
                contacts.forEach(function(contact, index) {
                    if (id === contact._id) {
                        cachedContact = contact;
                        return true;
                    } 
                });
                return cachedContact;
            }

        }
    })();


    return {
        getAll: function(useCache) {                
            var contacts,
            useCache = useCache || true;

            if (cache.hasContacts() && useCache) {
                return cache.getContacts();      
            } else {
                contacts = Contacts.query(function(){
                    cache.putContacts(contacts);
                });
                return contacts;
            }
        },

        get: function(id) {    
            return cache.getContact(id) || Contacts.get({ id: id });
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

        delete: function(contact, success) {
            var contactIndex = cache.indexOf(contact._id);

            contact.$delete(function(){
                if (typeof success === 'function') {
                    cache.removeContactByIndex(contactIndex);
                    success.apply(null, arguments);
                }
            }, function() {
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
        getCache: function() { return cache.getContacts(); } 
    }
}]);
