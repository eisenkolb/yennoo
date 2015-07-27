uneXBMC.register.controller("series.PagesCtrl"
, ["$scope", "$routeParams", "$location", "MovieFactory"
, function($scope, $routeParams, $location, MovieFactory){
    $scope.page  = $routeParams.page || null;
    $scope.timer = new uneXBMC.util.Timer(true);
    $scope.route = {series: uneXBMC.route.seriesIndex[0]};

    if (MovieFactory.hasCache(uneXBMC.const.TYPE_TVSHOWS) === false || $routeParams.page === null)
    {
        return($location.path(uneXBMC.route.seriesIndex[0]));
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