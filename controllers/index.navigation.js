Yennoo.controller("index.NavigationCtrl", ["$scope", "Navigation", function($scope, Navigation){
    $scope.limits  = [24, 48, 96];
    $scope.entries = Navigation.GetEntries();
    $scope.filters = {
            title    : "Title",
            year     : "Year",
            genre    : "Genre",
            dateadded: "DateAdded",
            runtime  : "Runtime",
            rating   : "Rating",
            studio   : "Studio"
    };
    $scope.available = {};

    /**
     * Global filter object
     *
     * @type {{limit: number, reverse: boolean, property: string}}
     */
    $scope.$root.filter = {
        limit   : Yennoo.setting.filter.limit    || $scope.limits[0],
        reverse : Yennoo.setting.filter.reverse  || false,
        property: Yennoo.setting.filter.property || ""
    };

    /**
     * Actions to set global filter properties
     *
     * @type {{limit: function, property: function, reverse: function}}
     */
    $scope.filter = {

        /**
         * Sets the limit of the pager result
         *
         * @param {?number} limit
         */
        limit: function(limit)
        {
            $scope.$root.filter.limit = limit;
        },

        /**
         * Sets the property for sorting the pager result
         *
         * @param {string} property
         */
        property: function(property)
        {
            $scope.$root.filter.property = property;
        },

        /**
         * Reverse the order of the pager result
         */
        reverse: function()
        {
            /**
             * @type {boolean}
             */
            $scope.$root.filter.reverse = !$scope.$root.filter.reverse;
        }
    };

    /**
     * Saves the current navigation entry
     *
     * @param  {!object} entry
     * @param  {!string} entry[].name
     */
    $scope.switch = function(entry)
    {
        entry.name = name;
        Navigation.SetActive(entry);
    };

    /**
     * Modify/Overwrite the entries of the dropdown filter menu
     */
    $scope.$on("$routeChangeSuccess", function(){
        switch(Navigation.GetActive()) {

            /**
             * Set filter entries for series
             */

            case "series":
                angular.copy($scope.filters, $scope.available);
                $scope.available["episode"] = "episode";
                $scope.available["premiered"] = "premiered";
                delete($scope.available["year"]);
                delete($scope.available["runtime"]);
            break;

            /**
             * Set filter entries for music
             */

            case "music":
                angular.copy($scope.filters, $scope.available);
                $scope.available["displayartist"] = "artist";
                delete($scope.available["runtime"]);
                delete($scope.available["rating"]);
                delete($scope.available["studio"]);
                delete($scope.available["dateadded"]);
            break;

            /**
             * Set filter entries for movies (or default)
             */

            default:
                angular.copy($scope.filters, $scope.available);
            break;
        }
    });

    /**
     * Element of the loading mask
     *
     * @type {object|HTMLElement}
     */
    $scope.loadingMask = angular.element("#loading-mask .bar.progress");

    /**
     * Removes the displaying loading status
     */
    $scope.$on("loading:resources:complete", function(){
        $scope.loadingMask.addClass("done");
    });

    /**
     * Adds the loading status on top of the page
     */
    $scope.$on("loading:resources:start", function(){
        $scope.loadingMask.removeClass("done");
    });
}]);