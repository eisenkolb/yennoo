uneXBMC.register.controller("index.DashboardCtrl"
, ["$scope", "APIservice", "Locale", "$translate", "MovieFactory", "Transporter"
, function($scope, APIservice, Locale, $translate, MovieFactory, Transporter){

    /**
     * Cleanup the breadcrumb
     */
    $scope.$root.breadcrumb = [];
}]);