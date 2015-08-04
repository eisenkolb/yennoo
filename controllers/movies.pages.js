Yennoo.register.controller("movies.PagesCtrl"
, ["$scope", "$routeParams", "$location", "MovieFactory"
, function($scope, $routeParams, $location, MovieFactory){
    $scope.page  = $routeParams.page || null;
    $scope.timer = new Kodi.util.Timer(true);
    $scope.route = {movies: Yennoo.route.moviesIndex[0]};

    if (MovieFactory.hasCache("movies") === false || $routeParams.page === null){
        return($location.path(Yennoo.route.moviesIndex[0]));
    }

    MovieFactory.GetMovies(function(data)
    {
        $scope.timer.stop();
        $scope.movies = data;
    });

    /**
     * Cleanup the breadcrumb
     */
    $scope.$root.breadcrumb = null;
}]);