Yennoo.register.controller("movies.DetailCtrl"
, ["$scope", "$sce", "$sceDelegate", "$routeParams", "$http", "MovieFactory", "PlaybackService"
, function($scope, $sce, $sceDelegate, $routeParams, $http, MovieFactory, PlaybackService){
    $scope.unknown = Yennoo.const.UNKNOWN_THUMBNAIL;
    $scope.route   = {movies: Yennoo.route.moviesIndex[0]};

    /**
     * Open trailer by using SCE service context
     *
     * @param {string} type
     * @param {string|integer} id
     */
    $scope.trustVideoSrc = function(type, id)
    {
        if (type === "youtube"){
            $scope.trailer = $sceDelegate.trustAs($sce.RESOURCE_URL, "//www.youtube.com/embed/"+ id);
        }
    };

    /**
     * Apply or Replace image when successfully loaded
     *
     * @param {object} scope
     * @param {object|HTMLElement} element
     */
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
     * Playback handler
     */
    $scope.action = {
        queue    : PlaybackService.queueMovie,
        start    : PlaybackService.openMovie,
        resume   : PlaybackService.resumeMovie,
        download : PlaybackService.downloadFile
    };

    /**
     * Load all movies and apply the target movie
     */
    MovieFactory.GetMovies(function(data, $async)
    {
        $scope.media = MovieFactory.getCache(Yennoo.const.TYPE_MOVIES)[$routeParams.movieid];
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "MOVIES", href: Yennoo.route.moviesIndex[0]},
        {title: $routeParams.title}
    ];
}]);