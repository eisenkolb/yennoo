Yennoo.register.controller("source.FilesCtrl"
, ["$scope", "$routeParams", "MovieFactory", "PlaybackService"
, function($scope, $routeParams, MovieFactory, PlaybackService){
    $scope.$root.breadcrumb = [{title: "SOURCES", href: "#/sources/list/enums"}];
    $scope.sourceEnums      = ["video", "music", "pictures", "files", "programs"];

    /**
     * Enumerate the types of sources
     */
    if ($routeParams.method === "list" && $routeParams.source === "enums") {
        $scope.enums = $scope.sourceEnums;

        return(false);
    }
    /**
     * List the entries of selected 'source'
     */
    else if ($routeParams.method === "list" && $scope.sourceEnums.indexOf($routeParams.source) >= 0)
    {
        $scope.$root.breadcrumb.push({title: $routeParams.source.toUpperCase()});
        $scope.timer = new Kodi.util.Timer(true);
        $scope.route = $routeParams;
        MovieFactory.BuildRequest(function(data, $async)
        {
            $scope.lists = data.sources || "empty";
            $scope.timer.stop();
            $async.apply($scope);
        }, Kodi.rpc.methods.Files.GetSources($routeParams.source));
    }
    else if ($scope.sourceEnums.indexOf($routeParams.method) >= 0)
    {
        $scope.$root.breadcrumb.push({title: $routeParams.method.toUpperCase(), href: "#/sources/list/"+ $routeParams.method});
        $scope.$root.breadcrumb.push({title: $routeParams.source});
        $scope.timer = new Kodi.util.Timer(true);
        $scope.route = $routeParams;

        MovieFactory.BuildRequest(function(data, $async)
        {
            $scope.timer.stop();
            for (var index in data.files){
                if (data.files[index] && data.files[index].mimetype)
                    data.files[index].type = data.files[index].mimetype.split(/\//)[0];
            }

            $scope.sources = data.files || "empty";
            $async.apply($scope);
        },  Kodi.rpc.methods.Files.GetDirectory($routeParams.source, $routeParams.method));
    }

    /**
     * Playback handler
     */
    $scope.action = {
        download : PlaybackService.downloadFile,
        playback : function(source){
            switch(source && source.filetype){
                case "directory":
                    PlaybackService.openFolder(source.file);
                default:
                    PlaybackService.openFile(source.file);
            }
        }
    };
}]);