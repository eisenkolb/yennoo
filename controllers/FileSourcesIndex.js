uneXBMC.register.controller("FileSourcesIndexCtrl"
, ["$scope", "$routeParams", "MovieFactory"
, function FileSourcesIndexCtrl($scope, $routeParams, MovieFactory){
    $scope.$root.breadcrumb = [{title: "SOURCES", href: uneXBMC.route.sourceIndex[0]}];
    $scope.sourceEnums      = ["video", "music", "pictures", "files", "programs"];

    if (uneXBMC.util.isType($routeParams.source, "undefined") === true)
    {
        $scope.enums = $scope.sourceEnums;

        return;
    }
    else if ($scope.sourceEnums.indexOf($routeParams.source) >= 0 && !$routeParams.directory)
    {
        $scope.$root.breadcrumb.push({title: $routeParams.source.toUpperCase()});
        $scope.timer = new uneXBMC.util.Timer(true);
        $scope.route = $routeParams;
        MovieFactory.BuildRequest(function(data, $async)
        {
            $scope.sources = data.sources || "empty";
            $scope.timer.stop();
            $async.apply($scope);
        }, uneXBMC.rpc.methods.Files.GetSources($routeParams.source));
    }
    else
    {
        $scope.$root.breadcrumb.push({title: $routeParams.source, href: uneXBMC.route.sourceIndex[0]+ $routeParams.source});
        $scope.$root.breadcrumb.push({title: $routeParams.directory});
        $scope.timer = new uneXBMC.util.Timer(true);
        $scope.route = $routeParams;

        MovieFactory.BuildRequest(function(data, $async)
        {
            $scope.timer.stop();
            for (var index in data.files){
                if (data.files[index] && data.files[index].mimetype)
                    data.files[index].type = data.files[index].mimetype.split(/\//)[0];
            }

            $scope.directories = data.files || "empty";
            $async.apply($scope);
        },  uneXBMC.rpc.methods.Files.GetDirectory($routeParams.directory));
    }
}]);