uneXBMC.register.controller("movies.IndexCtrl"
, ["$scope", "$routeParams", "MovieFactory"
, function($scope, $routeParams,MovieFactory){
    $scope.timer = new uneXBMC.util.Timer(true);
    $scope.page  = $routeParams.page || null;
    $scope.route = {movies: uneXBMC.route.moviesIndex[0]};

    MovieFactory.GetMovies(function(data, $async)
    {
        $scope.timer.stop();
        $scope.movies = data;
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [{title: "MOVIES", href: uneXBMC.route.moviesIndex[0]}];
}]);
