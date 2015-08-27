Yennoo.register.controller("index.DashboardCtrl", ["$scope", "MovieFactory", function($scope, MovieFactory) {
    $scope.recently = {banners: {}, episodes: {}, movies: {}};
    $scope.library  = {update: {}, clean: {}};
    $scope.route    = {
        movies: Yennoo.route.moviesIndex[0],
        series: Yennoo.route.seriesIndex[0],
        music : Yennoo.route.musicsIndex[0]
    };

    /**
     * Scans the video sources for new library items
     */
    $scope.library.update.video = function()
    {
        MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.VideoLibrary.Scan());
    };

    /**
     * Scans the audio sources for new library items
     */
    $scope.library.update.music = function()
    {
        MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.AudioLibrary.Scan());
    };

    /**
     * Cleans the video library from non-existent items
     */
    $scope.library.clean.video = function()
    {
        MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.VideoLibrary.Clean());
    };

    /**
     * Cleans the audio library from non-existent items
     */
    $scope.library.clean.music = function()
    {
        MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.AudioLibrary.Clean());
    };

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