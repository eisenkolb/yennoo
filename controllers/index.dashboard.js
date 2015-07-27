uneXBMC.register.controller("index.DashboardCtrl"
, ["$scope", "APIservice", "Locale", "$translate", "MovieFactory", "Transporter"
, function($scope, APIservice, Locale, $translate, MovieFactory, Transporter){

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [{title: "DASHBOARD"}];
}]);