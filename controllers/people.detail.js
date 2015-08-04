Yennoo.register.controller("people.DetailCtrl"
, ["$scope", "$routeParams", "MovieFactory"
, function($scope, $routeParams, MovieFactory){
    $scope.people = null;
    $scope.role   = {};
    $scope.actor  = $routeParams.people;
    $scope.route  = {series: Yennoo.route.seriesIndex[0], movies: Yennoo.route.moviesIndex[0]};

    /**
     * @todo list tv role of the artist
     */

    $scope.loadMatchedEntries = function(type, data, id, callback)
    {
        $scope.role[type] = {};

        var actor = $scope.actor.toLowerCase();
        for(var index in data || []){
            var entry = data && data[index] || null;

            for(var name in entry.cast || []){
                var cast =  entry.cast[name];
                if (cast.name.toLowerCase() == actor){
                    entry.actor = cast;
                    $scope.role[type][entry[id]] = entry;

                    if ($scope.people === null){
                        $scope.people = cast;
                        $scope.people.fanart = entry.fanart;
                    }
                }
            }
        }

        callback.call(null);
    };

    MovieFactory.GetMovies(function(data, $async)
    {
        $scope.loadMatchedEntries(Yennoo.const.TYPE_MOVIES, data, "movieid", function(){
            $async.apply($scope);
        });
    });

    MovieFactory.GetTvShows(function(data, $async)
    {
        $scope.loadMatchedEntries(Yennoo.const.TYPE_TVSHOWS, data, "tvshowid", function(){
            $async.apply($scope);
        });
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "MOVIE.CAST"},
        {title: $routeParams.people}
    ];
}]);