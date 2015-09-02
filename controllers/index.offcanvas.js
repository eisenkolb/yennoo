Yennoo.controller("index.OffCanvasCtrl", ["$scope", "MovieFactory", function($scope, MovieFactory){
    $scope.library = {update: {}, clean: {}};
    $scope.route   = {
        movies: Yennoo.route.moviesIndex[0],
        series: Yennoo.route.seriesIndex[0],
        music : Yennoo.route.musicsIndex[0],
        sets  : Yennoo.route.collections[0],
        lately: Yennoo.route.latelyAdded[0]
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
}]);