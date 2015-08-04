Yennoo.register.controller("series.DetailCtrl"
, ["$scope", "$routeParams", "mediaLibrary", "MovieFactory"
, function($scope, $routeParams, mediaLibrary, MovieFactory){
    $scope.tvshowid = parseInt($routeParams.tvshowid);
    $scope.unknown  = Yennoo.const.UNKNOWN_THUMBNAIL;
    $scope.route    = {series: Yennoo.route.seriesIndex[0]};
    $scope.timer    = new Kodi.util.Timer(true);

    $scope.play = Kodi.util.noop;

    $scope.startSeasons = Kodi.util.noop;

    $scope.queueSeasons = Kodi.util.noop;

    $scope.startEpisode = Kodi.util.noop;

    $scope.queueEpisode = Kodi.util.noop;

    $scope.relpaceimage = function(scope, element)
    {
        scope.cover = element[0].getAttribute("data-image");
        scope.$watch(scope.cover, function(watch){
            if (scope.cover && watch){
                scope.image        = new Image;
                scope.image.src    = watch;
                scope.image.onload = function(){
                    element[0].style.backgroundImage = "url('image')".replace("image", this.src);
                };
            }
        });
    };

    /**
     * Fetch details about the tv show
     */
    MovieFactory.BuildRequest(function(data, $async)
    {
        $scope.episodes = {};
        $scope.seasons  = {};
        $scope.media    = MovieFactory.helper.MapMediaResponse(data).tvshowdetails;
        $async.apply($scope);

        /**
         * Fetch tv seasons
         */
        MovieFactory.BuildRequest(function(data, $async)
        {
            var seasons   = MovieFactory.helper.MapMediaResponse(data.seasons || {});
            for(var index = 0; index < seasons.length; index++){
                $scope.seasons[seasons[index].season] = seasons[index];
                $async.apply($scope);

                /**
                 * Fetch episodes by season
                 */
                MovieFactory.BuildRequest(function(data, $async)
                {
                    this.episodes = MovieFactory.helper.MapMediaResponse(data.episodes || {});
                    $scope.episodes[this.episodes[0].season] = this.episodes;
                    $async.apply($scope);
                }, Kodi.rpc.methods.VideoLibrary.GetEpisodes($scope.tvshowid, seasons[index].season));
            }
        }, Kodi.rpc.methods.VideoLibrary.GetSeasons($scope.tvshowid));

    }, Kodi.rpc.methods.VideoLibrary.GetTVShowDetails(parseInt($routeParams.tvshowid)));

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "SERIES", href: Yennoo.route.seriesIndex[0]},
        {title: $routeParams.label}
    ];
}]);