contactManager.controller('ListController', ['$scope', 'Contacts',
    function($scope, Contacts) {
        
    $scope.contacts = Contacts.getAll(); 
    $scope.getFullName = function(contact) {
        var first = sanitize(contact.name.first), 
            last = sanitize(contact.name.last);
        return [first, last].join('_');
    }
    
    function sanitize(name) {
        return name.replace(/[^\w\d']/g,'');
    }

    $scope.delete = function(contact) {
        Contacts.delete(contact);
    }
}]);