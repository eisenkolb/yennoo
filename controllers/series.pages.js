Yennoo.register.controller("series.PagesCtrl"
, ["$scope", "$routeParams", "$location", "MovieFactory"
, function($scope, $routeParams, $location, MovieFactory){
    $scope.page  = $routeParams.page || null;
    $scope.timer = new Kodi.util.Timer(true);
    $scope.route = {series: Yennoo.route.seriesIndex[0]};

    if (MovieFactory.hasCache(Yennoo.const.TYPE_TVSHOWS) === false || $routeParams.page === null){
        return($location.path(Yennoo.route.seriesIndex[0]));
    }

    MovieFactory.GetTvShows(function(data)
    {
        $scope.timer.stop();
        $scope.tvshows = data;
    });

    /**
     * Cleanup the breadcrumb
     */
    $scope.$root.breadcrumb = null;
}]);