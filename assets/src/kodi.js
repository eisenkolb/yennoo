/**!
 * @fileOverview XBMC/Kodi Core JavaScript
 *
 * @author  [Ronny Eisenkolb]{@link https://github.com/eisenkolb}
 * @version 0.5.5
 * @license Yennoo : Web Interface for XBMC/Kodi<br>
 *          Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)<br>
 *          License: [MIT License]{@link http://www.opensource.org/licenses/MIT}
 */
(function(window, Yennoo){
    "use strict";

    angular.module("Kodi.Directive", []);
    angular.module("Kodi.Transport", ["Kodi.APIservice", "Kodi.Transporter", "Kodi.Factory"])
           .value("mediaLibrary", {limits: {}});
    angular.module("Kodi.UI", ["Kodi.Navigation"]);
    angular.module("Kodi.Dependencies", ["ngRoute", "Kodi.Directive"]);
    angular.module("Kodi.Core",["Kodi.Locale", "Kodi.Directive", "Kodi.Dependencies"]);

    Yennoo = angular.module("Yennoo", ["Kodi.Core", "Kodi.Transport", "Kodi.UI", "Kodi.Playback"]);
    Yennoo.config(function($controllerProvider, $provide, $compileProvider, $filterProvider){

        /**
         * Since the "shorthand" methods for component
         * definitions are no longer valid, we can just
         * override them to use the providers for post-
         * bootstrap loading.
         */

        Yennoo.register =
        {
            controller : $controllerProvider.register,
            directive  : $compileProvider.directive,
            filter     : $filterProvider.register,
            factory    : $provide.factory,
            value      : $provide.value,
            service    : $provide.service
        };

        if (Yennoo.config === null){
            throw Error("configuration is required");
        }

        for(var name in (Yennoo.config || {})){
            Yennoo[name] = Yennoo.config[name];
        }

        Yennoo.setting = angular.extend(Yennoo.setting, Yennoo.cookie.load());

        delete(Yennoo.config);
    });

    /**
     * Configure the registered transporters and their functionalities
     */
    Yennoo.config(function(TransporterProvider){
        for(var name in Yennoo.transporter.transporters){
            TransporterProvider.Register(name, Yennoo.transporter.transporters[name]);
        }

        delete(Yennoo.transporter);
    });

    /**
     * Configure routes and initialize the interface for communicating with Kodi
     */
    Yennoo.config(function(APIserviceProvider, TransporterProvider, LocaleProvider, $routeProvider){
        if (TransporterProvider.Initialize() === true){
            APIserviceProvider.SetTransport(TransporterProvider.Current());
            APIserviceProvider.SetHttpPort(TransporterProvider.GetPort());
        }

        var register = function(route, name, template){
            var pattern    = "/controllers/%controller%.js";
            var controller = pattern.replace("%controller%", name.replace("Ctrl", ""));

            $routeProvider.when(route.slice(1), {controller: name, templateUrl: template});
            jQuery.getScript(controller, Kodi.util.noop);
        };

        for(var index in Yennoo.route){
            register.apply(null, Yennoo.route[index]);
        }

        LocaleProvider.SetLanguage(Yennoo.setting.language || null);
        $routeProvider.otherwise({
            redirectTo: "/"
        });
    });

    Yennoo.value("asyncApply",{
        apply: function($scope, fn){
            if ($scope.$root && $scope.$root.$$phase == "$apply" || $scope.$root && $scope.$root.$$phase == "$digest"){
                ((fn && Kodi.util.isType(fn, "function")) ? fn : Kodi.util.noop)();
            } else $scope.$apply(fn);
        }
    });

    /**
     * Manually start up the angular application
     *
     * @param  {?function} [callback=null]
     * @return {Yennoo}
     */
    Yennoo.bootstrap = function(callback){
        angular.element(document).ready(function(){
            angular.bootstrap(angular.element(document), ["Yennoo"]);
            if (callback && typeof callback === "function"){
                callback.apply(null, []);
            }
        });

        return(this);
    };

    /**
     * Export transporter model to register methods
     *
     * @type {{transporters: {}, register: function}}
     */
    Yennoo.transporter = {
        transporters: {},

        /**
         * Register a transporter method
         *
         * @param {string} name
         * @param {object} transporter
         */
        register: function(name, transporter){
            this.transporters[name] = transporter;
        }
    };

    /**
     * Constants
     */
    Yennoo.const = {
        TYPE_TVSHOWS: "tvshows",
        TYPE_MOVIES:  "movies",
        TYPE_ALBUMS:  "albums",
        TYPE_ARTISTS: "artists",

        ALBUM_COVER_EDGES: "/assets/img/media.music.edges.png",
        ALBUM_COVER_FRAME: "/assets/img/media.music.frame.png",
        VIDEO_COVER_EDGES: "/assets/img/media.cover.edges.png",
        VIDEO_COVER_CRACK: "/assets/img/media.cover.crack.png",
        VIDEO_COVER_FRAME: "/assets/img/media.cover.frame.png",
        VIDEO_COVER_BLANK: "/assets/img/media.cover.blank.gif",
        UNKNOWN_THUMBNAIL: "/assets/img/thumbnail.unknown.png"
    };

    /**
     * Register cookie method to save user settings
     */
    Yennoo.cookie = {
        name: "storage.yennoo",
        load: function()
        {
            this.regex = new RegExp(name + "=([^;]+)");
            this.value = this.regex.exec(document.cookie);

            return((this.value === null) ? {} : JSON.parse(this.value[1]));
        },
        save: function(value)
        {
            this.date = new Date();
            this.date.setTime(this.date.getTime() + (100* 86400000));

            document.cookie = this.name + "=" + (value || null) + "; expires="+ this.date.toUTCString();

            if (Kodi.util.isFunction(arguments[arguments.length-1])){
                arguments[arguments.length-1].call(null)
            }

            return(this);
        }
    };

    window.Yennoo = Yennoo;

}(window, /** @namespace Kodi **/ window.Yennoo || {}));