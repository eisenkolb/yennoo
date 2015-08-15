Yennoo.register.controller("musics.IndexCtrl"
, ["$scope", "MovieFactory", "PlaybackService"
, function($scope, MovieFactory, PlaybackService){
    $scope.artistsSongs = {};
    $scope.loadingIndex = 1;

    $scope.relpaceimage = function(scope, element)
    {
        var media = element[0].getAttribute("data-image");
        var done  = function(image){
            setTimeout(function(){
                element[0].style.backgroundImage = "url('image')".replace("image", image);
                element[0].style.opacity = 1;
                element[0].className = element[0].className + " animated flipInX";
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
     * Playback handler
     */
    $scope.action = {
        start    : PlaybackService.openAlbum,
        queue    : PlaybackService.queueAlbum,
        openSong : PlaybackService.openSong
    };

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

        if ($scope.artistsSongs[album] && $scope.artistsSongs[album].length > 0){
            return(false);
        }

        MovieFactory.BuildRequest(function(data, $async)
        {
            var songs = data.songs || [];
            for(var index in songs){
                var entry = songs[index] || [];
                entry.runtime = entry.duration ? MovieFactory.helper.SecondsToTime(entry.duration) : null;
            }

            $scope.artistsSongs[album] = songs;
            $async.apply($scope);

        }, Kodi.rpc.methods.AudioLibrary.GetSongs(null, null,null, {albumid: parseInt(album)}));
    };

    /**
     * Loads all albums and assign it to the view
     */
    MovieFactory.GetAlbums(function(data, $async)
    {
        $scope.albums = data;
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [{title: "MUSIC", href: Yennoo.route.musicsIndex[0]}];
}]);