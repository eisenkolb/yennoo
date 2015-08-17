Yennoo.controller("index.NavigationCtrl", ["$scope", "Navigation", function($scope, Navigation){
    $scope.entries = Navigation.GetEntries();
    $scope.filters = {
            title    : "Title",
            year     : "Year",
            genre    : "Genre",
            dateadded: "Date Added",
            runtime  : "Runtime",
            rating   : "Rating",
            studio   : "Studio"
    };

    /**
     * Global filter object
     *
     * @type {{limit: number, reverse: boolean, property: string}}
     */
    $scope.$root.filter = {
        limit   : 8,
        reverse : false,
        property: ""
    };

    /**
     * Actions to set global filter properties
     *
     * @type {{limit: function, prop: function}}
     */
    $scope.filter = {
        limit: function(limit){
            $scope.$root.filter.limit = limit;
        },
        prop: function(prop){
            $scope.$root.filter.property = prop;

        }
    };

    $scope.$on("loading:resources:complete", function(event, data){
        angular.element("#loading-mask .bar.progress").addClass("done");
    });

    $scope.$on("loading:resources:start", function(event, data){
        angular.element("#loading-mask .bar.progress").removeClass("done");
    });
}]);