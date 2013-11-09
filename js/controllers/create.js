contactManager.controller('CreateController', ['$scope', '$location', 'Contacts', function($scope, $location,  Contacts) {
   $scope.action = 'Create';  
   $scope.showDelete = false;
   $scope.cancel = function() {
       $location.path('/');
   }
   $scope.save = function(){
       Contacts.create($scope.contact, function(){
           $location.path('/');
       });
   }
}]);