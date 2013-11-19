contactManager.controller('EditController', ['$scope','$routeParams', '$location', 'Contacts', function($scope, $routeParams, $location, Contacts) {
    $scope.action = 'Edit';
    $scope.showDelete = true;
    
    $scope.contact = Contacts.get($routeParams.id);
    $scope.save = function() {
        Contacts.update($scope.contact, function(){
            $location.path('/');
        });
    }

    $scope.delete = function() {
        Contacts.delete($scope.contact, function(){
            $location.path('/');    
        });
    };

    $scope.cancel = function() {
        $location.path('/');
    };
}]);