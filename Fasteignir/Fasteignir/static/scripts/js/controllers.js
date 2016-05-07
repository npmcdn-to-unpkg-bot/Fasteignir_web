var FasteignListi = angular.module('FasteignApp', ['ui.grid']);

FasteignListi.controller('FasteignListCtrl', function ($scope, $http) {
    $http.get("/get")
    .then(function (response) {
        $scope.houses = response.data.houses;
    }, function (response) {
        $scope.errorMsg = "Something went wrong";
    });
});