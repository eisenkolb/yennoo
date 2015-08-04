Yennoo.controller("index.NavigationCtrl", ["$scope", "Navigation", function($scope, Navigation){
    $scope.entries = Navigation.GetEntries();

    $scope.$on("loading:resources:complete", function(event, data){
        angular.element("#loading-mask .bar.progress").addClass("done");
    });

    $scope.$on("loading:resources:start", function(event, data){
        angular.element("#loading-mask .bar.progress").removeClass("done");
    });
}]);