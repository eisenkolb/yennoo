Yennoo.register.controller("series.IndexCtrl"
, ["$scope", "$routeParams", "mediaLibrary", "MovieFactory"
, function($scope, $routeParams, mediaLibrary, MovieFactory){
    $scope.timer = new Kodi.util.Timer(true);
    $scope.page  = $routeParams.page || null;
    $scope.route = {series: Yennoo.route.seriesIndex[0]};

    MovieFactory.GetTvShows(function(data, $async)
    {
        $scope.tvshows = Kodi.util.objectToArray(data);
        $scope.timer.stop();
        $async.apply($scope);
    });

    /**
     * Sets the breadcrumb trail for the current page and pager path
     */
    $scope.$root.breadcrumb = [{title: "SERIES", href: Yennoo.route.seriesIndex[0]}];
    $scope.$root.pagerPath  = $scope.route.series;
}]);