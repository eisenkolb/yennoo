Yennoo.register.controller("series.FilterCtrl"
, ["$scope", "$routeParams", "$translate", "MovieFactory"
, function($scope, $routeParams, $translate, MovieFactory){
    $scope.timer     = new Kodi.util.Timer(true);
    $scope.route     = {series: Yennoo.route.seriesIndex[0]};
    $scope.translate = "PROPERTY."+ $routeParams.filter.toUpperCase();

    $translate($scope.translate).then(function (translation){
        if ($scope.translate !== translation)
            $scope.$root.breadcrumb[1].title = translation;
    });

    /**
     * Get all tv shows
     *
     * @todo category into breadcrumb e.g.:
     *      SERIES / MPAA / TV-MA
     *             |      |
     *             |TV-Y7 |
     *             |TV-14 |
     *             |...  -|
     */
    MovieFactory.GetTvShows(function(data, $async)
    {
        var result = [];
        var filter = $routeParams.filter;
        var values = $routeParams.value;
        var custom = {userDefined: ["year"].indexOf(filter) > -1};

        /**
         * Register custom filters for non-media features
         *
         * @todo filter: unwatched/true
         * @todo filter: watched/true (viewed seasons)
         */
        custom.year = function(data, year){
            return((data && data.premiered || "").split("-")[0] === year);
        };

        for(var index in data){
            var regex = new RegExp(values, "i");

            /**
             * Use custom filter
             */
            if (custom.userDefined && custom[filter] && custom[filter].call(null, data[index], values)){
                result.push(data[index]);
            }
            else
            /**
             * Default
             */
            if (Kodi.util.isType(data[index][filter], "undefined") === false){
                if (data[index][filter] == values ||data[index][filter] !== null
                && (regex.test(data[index][filter].toString()))){
                    result.push(data[index]);
                }
            }
        }

        $scope.limit   = result.length;
        $scope.tvshows = result || [];
        $scope.timer.stop();
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [
        {title: "SERIES", href: Yennoo.route.seriesIndex[0]},
        {title: $routeParams.filter},
        {title: $routeParams.value}
    ];
}]);