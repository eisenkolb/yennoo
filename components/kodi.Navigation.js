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
        viewScript: "resources/view/",
        GetEntries: function ()
        {
            return(entries);
        },
        SetActive: function(entry, name, event)
        {
            if (entry.extern == true || entry.view == undefined){
                return(true);
            }

            factory.active = entry;
            event.preventDefault();
            scope.$broadcast("navigation.changed", factory.GetActive());

            return(this);
        },
        GetActive: function()
        {
            if (this.active === undefined || this.active === null){
                return(null);
            }

            this.active.url = factory.viewScript + this.active.view;

            return(this.active);
        }
    };

    return(factory);
});