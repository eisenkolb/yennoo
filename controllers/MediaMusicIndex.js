uneXBMC.register.controller("MediaMusicIndexCtrl"
, ["$scope", "MovieFactory"
, function MediaMusicIndexCtrl($scope, MovieFactory){
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
                    done(uneXBMC.const.ALBUM_COVER_FRAME);
                };
            }
        });
    };

    $scope.startPlayback = function(item, callback)
    {
        MovieFactory.BuildRequest(uneXBMC.util.noop, uneXBMC.rpc.methods.Playlist.Clear(0));
        MovieFactory.BuildRequest(uneXBMC.util.noop, uneXBMC.rpc.methods.Playlist.Add(0, item));
        MovieFactory.BuildRequest(uneXBMC.rpc.methods.Player.Open({playlistid: 0}));
        MovieFactory.BuildRequest(function(data, $async){
            if (data && data === "OK") $async.apply($scope, callback);
        }, uneXBMC.rpc.methods.Player.Open({playlistid: 0}));
    };

    $scope.openAlbum = function(album, queue)
    {
        console.log("$scope.openAlbum", album, queue);
        $scope.startPlayback({albumid: album.albumid}, function(){
            $scope.running = {albumid: album.albumid, songid: null};
        });
    };

    $scope.openSong = function(song)
    {
        console.log("$scope.openSong", song);
        $scope.startPlayback({songid: song.songid}, function(){
            $scope.running ={albumid: song.albumid, songid: song.songid};
        });
    };

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

        }, uneXBMC.rpc.methods.AudioLibrary.GetSongs(null, null,null, {albumid: parseInt(album)}));
    };

    MovieFactory.GetAlbums(function(data, $async)
    {
        $scope.albums = data;
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [{title: "MUSIC", href: uneXBMC.route.musicsIndex[0]}];
}]);