Yennoo.register.controller("recently.AddedCtrl"
, ["$scope", "$routeParams", "MovieFactory", "PlaybackService"
, function($scope, $routeParams, MovieFactory, PlaybackService){
    $scope.recently = {type: "items"};
    $scope.artists  = {};
    $scope.route    = {
        movies: Yennoo.route.moviesIndex[0],
        series: Yennoo.route.seriesIndex[0]};
    $scope.$root.breadcrumb = [{title: "RECENTLY_ADDED.RECENTLY_ADDED"}];

    switch($routeParams.media){
        case "episodes":
            $scope.recently.call = Kodi.rpc.methods.VideoLibrary.GetRecentlyAddedEpisodes;
            $scope.recently.type = $routeParams.media;
            $scope.$root.breadcrumb.push({title: "PROPERTY.EPISODE"});
            break;

        case "music":
            $scope.recently.call = Kodi.rpc.methods.AudioLibrary.GetRecentlyAddedAlbums;
            $scope.recently.view = Yennoo.route.musicsIndex[2];
            $scope.recently.type = "albums";
            $scope.$root.breadcrumb.push({title: "MUSIC"});
            break;

        case "musicvideos":
            $scope.recently.call = Kodi.rpc.methods.VideoLibrary.GetRecentlyAddedMusicVideos;
            $scope.recently.type = $routeParams.media;
            $scope.$root.breadcrumb.push({title: "GLOBAL.MUSIC_VIDEOS"});
            break;

        case "movies":
        default:
            $scope.recently.call = Kodi.rpc.methods.VideoLibrary.GetRecentlyAddedMovies;
            $scope.recently.view = Yennoo.route.moviesIndex[2];
            $scope.recently.type = $routeParams.media;
            $scope.$root.breadcrumb.push({title: $routeParams.media.toUpperCase()});
    }

    /**
     * Load a specific album songlist
     *
     * Trigger: Click on HTMLElement
     *
     * @param  {event|object} event
     * @return {boolean}
     */
    $scope.loadSonglist = function(event)
    {
        var target = event.target.getAttribute("data-dropdown");
        var album  = target.split("-")[1];

        if ($scope.artists[album] && $scope.artists[album].length > 0){
            return(false);
        }

        MovieFactory.BuildRequest(function(data, $async)
        {
            var songs = data.songs || [];
            for(var index in songs){
                var entry = songs[index] || [];
                entry.runtime = entry.duration ? MovieFactory.helper.SecondsToTime(entry.duration) : null;
            }

            $scope.artists[album] = songs;
            $async.apply($scope);

        }, Kodi.rpc.methods.AudioLibrary.GetSongs(null, null,null, {albumid: parseInt(album)}));
    };

    $scope.relpaceimage = function(scope, element)
    {
        var media = element[0].getAttribute("data-image");
        var done  = function(image){
            setTimeout(function(){
                element[0].style.backgroundImage = "url('image')".replace("image", image);
                element[0].style.opacity         = 1;
                element[0].parentNode.style.background = null;
            }, 30 *$scope.loadingIndex++);
        };

        scope.$parent.$watch(media, function(watch){
            var image = new Image;
            if (watch){
                image.src = watch;
                image.onload = function(){
                    done(image.src);
                };
                image.onerror = function(){
                    done(Yennoo.const.ALBUM_COVER_FRAME);
                };
            }
        });
    };

    /**
     * Fetch the recently added items by the given media type
     */
    MovieFactory.BuildRequest(function(data, $async)
    {
        $scope[$scope.recently.type] = MovieFactory.helper.MapMediaResponse(data && data[$scope.recently.type] || []);
        $async.apply($scope);

    }, $scope.recently.call());

    /**
     * Playback handler
     */
    $scope.action = {
        playback  : PlaybackService.openFile,
        start     : PlaybackService.openAlbum,
        queue     : PlaybackService.queueAlbum,
        openSong  : PlaybackService.openSong
    };
}]);