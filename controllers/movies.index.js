Yennoo.register.controller("movies.IndexCtrl"
, ["$scope", "$routeParams", "MovieFactory"
, function($scope, $routeParams,MovieFactory){
    $scope.timer = new Kodi.util.Timer(true);
    $scope.page  = $routeParams.page || null;
    $scope.route = {movies: Yennoo.route.moviesIndex[0]};

    MovieFactory.GetMovies(function(data, $async)
    {
        $scope.timer.stop();
        $scope.movies = data;
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [{title: "MOVIES", href: Yennoo.route.moviesIndex[0]}];
}]);
