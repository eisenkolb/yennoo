Yennoo.register.controller("movies.FilterCtrl"
, ["$scope", "$routeParams", "$translate", "MovieFactory"
, function($scope, $routeParams, $translate, MovieFactory){
    $scope.timer     = new Kodi.util.Timer(true);
    $scope.translate = "PROPERTY."+ $routeParams.filter.toUpperCase();
    $scope.route     = {movies: Yennoo.route.moviesIndex[0]};

    $translate($scope.translate).then(function (translation){
        if ($scope.translate === translation) return false;
        $scope.$root.breadcrumb[1].title = translation;
    });

    /**
     * Retrieve all movies
     */
    MovieFactory.GetMovies(function(data, $async)
    {
        var result = [];
        var filter = $routeParams.filter;
        var values = $routeParams.value;

        for(var index in data){
            var regex = new RegExp(values, "i");

            /**
             * Default
             */
            if (Kodi.util.isDefined(data[index][filter]) === true){
                if (data[index][filter] == values || data[index][filter] !== null
                && (regex.test(data[index][filter].toString()))){
                    result.push(data[index]);
                }
            }
        }

        $scope.limit  = result.length;
        $scope.movies = result;
        $scope.timer.stop();
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "MOVIES", href: Yennoo.route.moviesIndex[0]},
        {title: $routeParams.filter},
        {title: $routeParams.value}
    ];
}]);