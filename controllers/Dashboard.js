uneXBMC.register.controller("DashboardCtrl"
, ["$scope", "APIservice", "Locale", "$translate", "MovieFactory", "Transporter"
, function DashboardCtrl($scope, APIservice, Locale, $translate, MovieFactory, Transporter){

    /**
     * Sets the breadcrumb trail for the current page
     */
    $scope.$root.breadcrumb = [{title: "DASHBOARD"}];
}]);