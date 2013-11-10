contactManager.controller('EditController', ['$scope','$routeParams', '$location', 'Contacts', 
    function($scope, $routeParams, $location, Contacts) {
    $scope.action = 'Edit';
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