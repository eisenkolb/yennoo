Yennoo.register.controller("index.DashboardCtrl"
, ["$scope", "APIservice", "Locale", "$translate", "MovieFactory", "Transporter"
, function($scope, APIservice, Locale, $translate, MovieFactory, Transporter){

    $scope.route    = {movies: Yennoo.route.moviesIndex[0], series: Yennoo.route.seriesIndex[0]};
    $scope.recently = {banners: {}, episodes: {}, movies: {}};

    /**
     * Fetch the recently added movies
     */
    MovieFactory.BuildRequest(function(data, $async)
    {
        $scope.recently.movies = MovieFactory.helper.MapMediaResponse(data.movies || []);
        $async.apply($scope);

    }, Kodi.rpc.methods.VideoLibrary.GetRecentlyAddedMovies());

    /**
     * Fetch the recently added TV Episodes
     */
    MovieFactory.BuildRequest(function(data, $async)
    {
        $scope.recently.episodes = MovieFactory.helper.MapMediaResponse(data.episodes || []);

        for(var index = 0; index < ($scope.recently.episodes || []).length; index++){
            var tvshow = $scope.recently.episodes[index] && $scope.recently.episodes[index] || null;
            if (tvshow && !$scope.recently.banners[tvshow.tvshowid]){
                $scope.recently.banners[tvshow.tvshowid] = {
                    banner: tvshow.banner,
                    label : tvshow.showtitle
                };
            }
        }

        $async.apply($scope);

    }, Kodi.rpc.methods.VideoLibrary.GetRecentlyAddedEpisodes());

    /**
     * Cleanup the breadcrumb
     */
    $scope.$root.breadcrumb = [];
}]);