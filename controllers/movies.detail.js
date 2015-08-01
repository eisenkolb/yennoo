uneXBMC.register.controller("movies.DetailCtrl"
, ["$scope", "$sce", "$sceDelegate", "$routeParams", "MovieFactory"
, function($scope, $sce, $sceDelegate, $routeParams, MovieFactory){
    $scope.unknown = uneXBMC.const.UNKNOWN_THUMBNAIL;
    $scope.route   = {movies: uneXBMC.route.moviesIndex[0]};

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
     * @todo Implement movie action
     */
    $scope.action = {
        queue    : uneXBMC.util.noop,
        start    : uneXBMC.util.noop,
        resume   : uneXBMC.util.noop,
        download : uneXBMC.util.noop
    };

    /**
     * Load all movies and apply the target movie
     */
    MovieFactory.GetMovies(function(data, $async)
    {
        $scope.media = MovieFactory.getCache(uneXBMC.const.TYPE_MOVIES)[$routeParams.movieid];
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "MOVIES", href: uneXBMC.route.moviesIndex[0]},
        {title: $routeParams.title}
    ];
}]);