/*
 * Yennoo : Web Interface for XBMC/Kodi
 * Copyright 2015, Ronny Eisenkolb (@eisenkolb)
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
angular.module("Kodi.Navigation", []).factory("Navigation", function($rootScope){
    var scope   = $rootScope.$root;
    var entries = Yennoo.navigation;
    var factory = {

        /**
         * Returns the registered navigation entries
         *
         * @return {Yennoo.config.navigation|object}
         */
        GetEntries: function()
        {
            return(entries || {});
        },

        /**
         * Saves the active navigation object
         *
         * @param  {!object} entry
         * @param  {!string} entry[].name
         * @param  {!string} entry[].label
         * @return {object|Navigation}
         */
        SetActive: function(entry)
        {
            if (entry.extern == true || entry.view == undefined){
                return(true);
            }

            this.active = entry;
            scope.$broadcast("navigation.changed", factory.GetActive());

            return(this);
        },

        /**
         * Returns the active (top-level) entry
         *
         * @return {string}
         */
        GetActive: function()
        {
            if (Kodi.util.isUndefined(this.active && this.active.name) === true){
                return(location.hash.substr(2));
            }

            return(this.active);
        }
    };

    return(factory);
});