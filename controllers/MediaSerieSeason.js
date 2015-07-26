uneXBMC.register.controller("MediaSerieSeasonCtrl"
, ["$scope", "$routeParams", "mediaLibrary", "MovieFactory"
, function MediaSerieSeasonCtrl($scope, $routeParams, mediaLibrary, MovieFactory){
    $scope.tvshowid = parseInt($routeParams.tvshowid);
    $scope.seasonid = parseInt($routeParams.seasonid);
    $scope.headline = $routeParams.label;
    $scope.media    = null;
    $scope.route    = {
        series: uneXBMC.route.seriesIndex[0],
        season: uneXBMC.route.serieSeason[0].replace(":tvshowid", $scope.tvshowid)
                                            .replace(":label", $scope.headline)
                                            .replace("/:seasonid", ""),
        tvshow: uneXBMC.route.serieDetail[0].replace(":tvshowid", $scope.tvshowid)
                                            .replace(":label", $scope.headline)
    };

     /**
     * Retrieve tv seasons
     */
    MovieFactory.BuildRequest(function(data, $async)
    {
        for(var index = 0; index < (data.seasons || []).length; index++){
            if (data.seasons[index].season === $scope.seasonid){
                $scope.media = data.seasons[index];
                $scope.media.fanart = MovieFactory.helper.GetThumbnailPath($scope.media.fanart);
                $scope.media.poster = MovieFactory.helper.GetThumbnailPath($scope.media.thumbnail);
                $scope.media.banner = MovieFactory.helper.GetThumbnailPath($scope.media.art.banner);
                break;
            }
        }

        $scope.seasons = (data.seasons || []);
        $async.apply($scope);

    }, uneXBMC.rpc.methods.VideoLibrary.GetSeasons($scope.tvshowid));

    MovieFactory.BuildRequest(function(data, $async)
    {
        $scope.episodes = MovieFactory.helper.MapMediaResponse(data.episodes || {});
        $async.apply($scope);

    }, uneXBMC.rpc.methods.VideoLibrary.GetEpisodes($scope.tvshowid, $scope.seasonid));

    $scope.relpaceimage = function(scope, element)
    {
        scope.cover = element[0].getAttribute("data-image");
        scope.$watch(scope.cover, function(watch){
            if (scope.cover && watch){
                scope.image        = new Image;
                scope.image.src    = scope.$eval(scope.cover);
                scope.image.onload = function(){
                    element[0].style.backgroundImage = "url('image')".replace("image", scope.image.src);
                };
            }
        });
    };

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "SERIES", href: uneXBMC.route.seriesIndex[0]},
        {title: $scope.headline, href: $scope.route.tvshow},
        {title: "TVSHOW.SEASON"},
        {title: $scope.seasonid}
    ];
}]);