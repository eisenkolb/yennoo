Yennoo.register.controller("musics.ArtistCtrl", ["$scope", "MovieFactory", function($scope, MovieFactory){
    $scope.tracks   = {};
    $scope.artists  = {};
    $scope.alphabet = {};

    /**
     * @todo List albums in a overlay by clicking on the artist
     */

    /**
     * Load all songs from the given album
     *
     * @param {object} album
     */
    $scope.loadAlbumTracks = function(album){
        if (!album || !album.albumid){
            return(false);
        }

        /**
         * Fetch all album songs
         */
        MovieFactory.BuildRequest(function(data, $async)
        {
            var songs = data.songs || [];
            for(var index in songs){
                var entry = songs[index] || [];
                entry.runtime = entry.duration ? MovieFactory.helper.SecondsToTime(entry.duration) : null;
            }

            $scope.tracks[album.albumid] = songs;
            $async.apply($scope);

        }, Kodi.rpc.methods.AudioLibrary.GetSongs(null, null,null, {albumid: Number(album.albumid)}));

    };

    $scope.openAlbumTracks = function(album){
        if (album && album.albumid && $scope.tracks[album.albumid]){
            return(true);
        }

        $scope.loadAlbumTracks(album);
    };

    MovieFactory.GetAlbums(function(data, $async)
    {
        var alphabet = {};
        var artists  = {};

        for(var index in data){
            var artistid = data[index].artist || [null];
            if (artistid[0] === null){
                continue;
            }

            var character = (artistid[0][0] || "?").toLowerCase();
            if (alphabet[character] === undefined){
                alphabet[character] = {};
            }

            /**
             * Create an object, that collect the albums of the artist
             */

            if (artists[artistid[0]] === undefined){
                artists[artistid[0]] = {};
            }

            artists[artistid[0]].length = (artists[artistid[0]].length || 0) +1;
            artists[artistid[0]][(artists[artistid[0]].length -1)] = data[index];
            alphabet[character][data[index].artist[0]] = data[index].albumid;
        }

        $scope.artists  = artists;
        $scope.alphabet = alphabet;
        $async.apply($scope);
    });

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

        scope.$watch(media, function(watch){
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
}]);