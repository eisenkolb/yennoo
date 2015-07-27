uneXBMC.register.controller("movies.FilterCtrl"
, ["$scope", "$routeParams", "$translate", "MovieFactory"
, function($scope, $routeParams, $translate, MovieFactory){
    $scope.timer      = new uneXBMC.util.Timer(true);
    $scope.translate  = "PROPERTY."+ $routeParams.filter.toUpperCase();
    $scope.route      = {movies: uneXBMC.route.moviesIndex[0]};

    $translate($scope.translate).then(function (translation){
        if ($scope.translate === translation) return false;
        $scope.$root.breadcrumb[1].title = translation;
    });

    MovieFactory.GetMovies(function(data, $async)
    {
        var movies = [];
        var filter = $routeParams.filter;
        var values = $routeParams.value;

        for(var index in data){
            var regex = new RegExp(values, "i");
            if (uneXBMC.util.isType(data[index][filter], "undefined") === false) {
                if (!uneXBMC.util.isType(data[index][filter], "object")
                && (data[index][filter] == values ||data[index][filter] !== null)
                && (regex.test(data[index][filter].toString()))) {
                    movies.push(data[index]);
                }
            }
        }

        $scope.limit  = movies.length;
        $scope.movies = movies;
        $scope.timer.stop();
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "MOVIES", href: uneXBMC.route.moviesIndex[0]},
        {title: $routeParams.filter},
        {title: $routeParams.value}
    ];
}]);