Yennoo.register.controller("movies.CollectionCtrl"
, ["$scope", "$routeParams", "MovieFactory"
, function($scope, $routeParams, MovieFactory){
    $scope.route = {movies: Yennoo.route.moviesIndex[0]};

    MovieFactory.GetMovies(function(data, $async)
    {
        $scope.movielist = data;
        $async.apply($scope);
    });

    MovieFactory.BuildRequest(function(data, $async)
    {
        $scope.setdetails = MovieFactory.helper.MapMediaResponse(data.sets);
        $async.apply($scope);
    }, Kodi.rpc.methods.VideoLibrary.GetMovieSets());

    $scope.$watchCollection("setdetails + movielist", function()
    {
        if (Kodi.util.isType($scope.setdetails, "object") === false
        || (Kodi.util.isType($scope.movielist,  "object")  === false)){
            return(false);
        }

        var list = {};
        var sets = [];

        for(var index in $scope.setdetails){
            if ($scope.setdetails[index] === null
            || ($scope.setdetails[index] && $routeParams.id
            && ($scope.setdetails[index].setid != $routeParams.id))){
                continue;
            }

            $scope.setdetails[index].movies      = [];
            list[$scope.setdetails[index].setid] = $scope.setdetails[index];
        }

        for(var index in $scope.movielist){
            var movie =  $scope.movielist[index];
            if (movie.setid && movie.setid > 0 && list[movie.setid]){
                list[movie.setid].movies.push(movie);
            }
        }

        $scope.collection = list;
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "MOVIES", href: Yennoo.route.moviesIndex[0]},
        {title: "COLLECTION", href: Yennoo.route.collections[0]}
    ];
    if ($routeParams.title) $scope.$root.breadcrumb.push({title: $routeParams.title});
}]);