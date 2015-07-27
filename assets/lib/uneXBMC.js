/**!
 * uneXBMC.js | XBMC Core JavaScript
 */
(function(window){
    "use strict";

    angular.module("XBMC.Transport", ["XBMC.APIservice", "XBMC.Transporter", "XBMC.Factory"])
           .value("mediaLibrary", {limits: {}});
    angular.module("XBMC.UI",["XBMC.Transporter", "XBMC.Pager", "XBMC.subnav", "XBMC.onready"]);
    angular.module("XBMC.Dependencies",["ngRoute"]);
    angular.module("XBMC.Core",["XBMC.Locale", "XBMC.Navigation", "XBMC.Directive", "XBMC.Dependencies"]);

    window.uneXBMC = angular.module("XBMC", ["XBMC.Core", "XBMC.Transport", "XBMC.UI"]);
    window.uneXBMC.config(function($controllerProvider, $provide, $compileProvider, $filterProvider){

                /**
                 * Since the "shorthand" methods for component
                 * definitions are no longer valid, we can just
                 * override them to use the providers for post-
                 * bootstrap loading.
                 */

                window.uneXBMC.register =
                {
                    controller : $controllerProvider.register,
                    directive  : $compileProvider.directive,
                    filter     : $filterProvider.register,
                    factory    : $provide.factory,
                    value      : $provide.value,
                    service    : $provide.service
                };

                for (var name in (window.uneXBMCextend || {})){
                    window.uneXBMC[name] = window.uneXBMCextend[name];
                }

                uneXBMC.setting = angular.extend(uneXBMC.setting, uneXBMC.cookie.load());

                delete(window.uneXBMCextend);
            }
    );

    window.uneXBMC.config(function(APIserviceProvider, TransporterProvider, LocaleProvider, $routeProvider){
        if (TransporterProvider.Initialize() === true){
            APIserviceProvider.SetTransport(TransporterProvider.Current());
            APIserviceProvider.SetHttpPort(TransporterProvider.GetPort());
        }

        var register = function(route, name, template){
            var pattern    = "/controllers/%controller%.js";
            var controller = pattern.replace("%controller%", name.replace("Ctrl", ""));

            $routeProvider.when(route.slice(1), {controller: name, templateUrl: template});
            jQuery.getScript(controller, uneXBMC.util.noop);
        };

        for(var index in uneXBMC.route){
            register.apply(null, uneXBMC.route[index]);
        }

        LocaleProvider.SetLanguage(uneXBMC.setting.language || null);
        $routeProvider.otherwise({
            redirectTo: "/"
        });
    });

    window.uneXBMC.value("asyncApply",{
        apply: function($scope, fn){
            if ($scope.$root && $scope.$root.$$phase == "$apply" || $scope.$root && $scope.$root.$$phase == "$digest"){
               ((fn && uneXBMC.util.isType(fn, "function")) ? fn : uneXBMC.util.noop)();
            } else $scope.$apply(fn);
        }
    });

    /**
     * Constants
     */
    window.uneXBMC.const = {
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
     * Directive:Subheader
     */
    angular.module("XBMC.subnav", []).directive("subheader", ["Navigation", "$location", "$filter", "$compile", function subheader(Navigation, $location, $filter, $compile){
        return {
            restrict: "A",
            controller: function($scope, $compile){
                $scope.$compile = $compile;
                $scope.$watchCollection("represent", function(represent)
                {
                    if (represent === undefined || represent === null){
                        return(false);
                    }

                    for(var origin in represent){
                        if (uneXBMC.setting.represent[origin] === undefined){
                            uneXBMC.setting.represent[origin] = {};
                        }

                        uneXBMC.setting.represent[origin] = represent[origin];
                        uneXBMC.cookie.save(JSON.stringify(uneXBMC.setting));
                    }
                });

                $scope.$root.represent = uneXBMC.setting.represent || {};
            },

            link: function($scope, $element, $attrs)
            {
                if ($scope.$parent.pagelength === undefined && $scope.pagination){
                    $scope.$parent.pagelength =  angular.copy($scope.pagination.pages.length)
                }

                var source = $element.clone(true);
                var attrib = $attrs.subheader.split("/");
                var target = angular.element("#container #header .top > .group."+ attrib[0] || {}).eq(0);

                if (attrib[1] === null){
                    attrib[1] = "replace"
                }

                if (attrib[1] && attrib[1] === "replace"){
                    target.html($scope.$compile(source[0].innerHTML)($scope.$parent));
                } else if (attrib[1] && attrib[1] === "append" || attrib[1] && attrib[1] === "after"){

                target.append($scope.$compile(source[0].innerHTML)($scope.$parent));

                } else if (attrib[1] && attrib[1] === "before"){
                    target.html($scope.$compile(source[0].innerHTML + target[0].innerHTML)($scope.$parent));
                }

                $element.remove();
            }
        };
    }]);

    /**
     * Directive:OnReady
     */
    angular.module("XBMC.onready", []).directive("onready", function(){
        return {
            restrict: "A",
            link: function(scope, element, attrs){
                scope[attrs.onready].apply(element, [scope, element]);
            }
        };
    });

    /**
     * Directive:Pager
     */
    angular.module("XBMC.Pager", []).directive("pager", ["Navigation", "$location", "$filter", function Pager(Navigation, $location, $filter){
        return {
            restrict: "EAC",
            transclude: true,
            scope: {
                "customerInfo": "=info",
                "in":  "=",
                "out": "@"
            },
            templateUrl: "/pager.html",
            controller: function($scope)
            {
            },
            link: function(scope, element, attrs){
                var current = parseInt(scope.$parent.page || 1);
                var limit   = scope.$parent.limit || 8;
                var offset  = current === 1 ? 0 : limit *(current -1);

                scope.buildPagination  = function(current, total, limit){
                    var buttons        = 5;
                    this.pager         = {pages: []};
                    this.pager.total   = Number((total / limit).toFixed());
                    this.pager.current = this.pager.lower = this.pager.upper = Math.min(current, this.pager.total);

                    for (var index = 1; index < buttons && index < this.pager.total;){
                        if (this.pager.lower > 1 ) { this.pager.lower--; index++;}
                        if (index < buttons && this.pager.upper < this.pager.total) {this.pager.upper++; index++; }
                    }

                    for(var i = this.pager.lower; i <= this.pager.upper; i++){
                        this.pager.pages.push(i);
                    }

                    this.pager.path = scope.$root.pagerPath || null;
                    if (this.pager.path === null || this.pager.path && location.href.indexOf(this.pager.path) < 0) {
                        this.pager.path = scope.$root.pagerPath = location.hash;
                    }

                    return(this.pager);
                };

                scope.limit = scope.$root.limit = limit;
                scope.incrementLimit = function(){
                    scope.$root.limit += scope.$root.limit;
                };

                if (uneXBMC.util.isType(scope["in"], "undefined") === true || uneXBMC.util.isType(scope.out, "undefined") === true){
                    return(false);
                }

                /**
                 * The 'pager' attributes is present and enabled
                 */
                if (attrs.pager && attrs.pager === "true"){
                    scope.$root[scope.out] = Array.prototype.slice.call(scope["in"], offset, offset +limit);
                    scope.$root.pagination = scope.pagination = scope.buildPagination(current, scope["in"].length, limit);
                }
            }
        };
    }]);

    /**
     * Directive:Imageonload
     */
    angular.module("XBMC.Directive", []).directive("imageonload", function(){return{
        restrict: "A",
        scope: {
            media: "@"
        },
        link: function(scope, element, attrs)
        {
            var image = new Image();
            var media = attrs[scope.media] || null;
            if (media && scope.media === "poster"){
                image.failed = uneXBMC.const.VIDEO_COVER_CRACK;
                image.loaded = uneXBMC.const.VIDEO_COVER_EDGES;
            } else if (scope.media === "music"){
                image.loaded = uneXBMC.const.ALBUM_COVER_EDGES;
                image.failed = uneXBMC.const.ALBUM_COVER_FRAME;
            } else if (scope.media === "people"){
                image.loaded = uneXBMC.const.VIDEO_COVER_BLANK;
                image.failed = uneXBMC.const.UNKNOWN_THUMBNAIL;
            }

            if (attrs.src === undefined && scope.media && scope.media === "poster"){
                element[0].src = uneXBMC.const.VIDEO_COVER_FRAME;
            }

            scope.$parent.$watch(media, function(watch){
                if (watch){
                    image.src = watch;
                    image.onload = function(){
                        element[0].style.backgroundImage = "url("+ watch +")";
                        element[0].src = image.loaded ? image.loaded : element[0].src;
                    };
                    image.onerror = function(){
                        element[0].src = image.failed;
                    };
                }
            });
        }
    }});

    /**
     * Provider:APIservice
     */
    angular.module("XBMC.APIservice", []).provider("APIservice", function APIservice(){
        var instance = this;
            instance.$get = ["$injector", "Transporter", function($injector, Transporter){
            return({
                Send: function(command, callback)
                {
                    for (var callbacks in {success: 1, error: 1, then: 1, beforeSend: 1, errorForm: 1, successForm: 1})
                    {
                        if (callback[callbacks] && uneXBMC.util.isType(callback[callbacks], "function") === true){
                        }else callback[callbacks] = function(){};
                    }

                    if (this.GetTransport()){
                        this.GetTransport().Send(command, callback, this);
                    }

                    return(callback);
                },
                GetHost: function()
                {
                    var transporter = Transporter.GetName();
                    var hostname    = uneXBMC.setting.transport
                                   && uneXBMC.setting.transport[transporter]
                                   && uneXBMC.setting.transport[transporter].host
                                   || null;

                    if (hostname === null){
                        hostname = instance.transporter.defaults.host;
                    }

                    return(hostname);
                },
                GetPort : function()
                {
                    return(Transporter.GetPort());
                },
                GetTransport : function()
                {
                    if (instance.transporter === undefined && Transporter.Initialize() === true){
                        instance.SetTransport(Transporter.Current());
                    }

                    return(instance.transporter || null);
                },
                GetSocket : function()
                {
                    var socket = this.GetHost();

                    if (this.GetPort() || instance.transporter && instance.transporter.defaults){
                        socket += ":"+ (this.GetPort() || instance.transporter.defaults.port);
                    }

                    return(socket);
                },
                GetHttPort : function()
                {
                    return(uneXBMC.setting.transport && uneXBMC.setting.transport.HTTP && uneXBMC.setting.transport.HTTP.port
                       || (Transporter.Transporter("HTTP").defaults.port));
                },
                GetHttpSocket : function()
                {
                    var socket = socket || null;
                    if (socket === null){
                        socket = location.protocol +"//"+ this.GetHost() +":"+ this.GetHttPort();
                    }

                    return(socket);
                },
                DispatchEvent: function(name, data)
                {
                    var scope = scope || null;
                    if (scope === null){
                        scope = $injector.get("$rootScope");
                    }

                    scope.$broadcast.apply(scope, arguments);

                    return(this);
                }
            });
        }];
        instance.SetHttpPort = function(port)
        {
            instance.httpPort = port;

            return(this);
        };
        instance.SetTransport = function(transporter)
        {
            if (transporter && uneXBMC.util.isType(transporter, "object") === true){
                instance.transporter = transporter;
            }

            console.log("APIservice::SetTransport([%h : %o])", uneXBMC.setting.method | null, transporter);

            return(this);
        };
    });

    /**
     * Provider:Transporter
     */
    angular.module("XBMC.Transporter", []).provider("Transporter", function Transporter(APIserviceProvider){
        var self = this;
        self.$get = [function(){
            return ({
                Availables : self.Availables,
                Transporter: self.Get,
                Current: self.Current,
                GetName: self.GetName,
                GetPort: self.GetPort
            })
        }];

        var transporters =
        {
            WebSocket: {
                defaults: {
                    port: 9090,
                    host: document.location.hostname
                },
                BuildRequest: function(command)
                {
                    this.command = JSON.stringify(command || {});
                    this.request = (command || {});
                    this.request.jsonrpc = "2.0";
                    this.request.id      = Date.now()+ this.command.length;
                    this.toString        = function(){
                        return(JSON.stringify(this.request));
                    };

                    return(this);
                },

                Send: function(command, callback, APIservice)
                {
                    var self   = this;
                    var socket = self.socket = self.socket && uneXBMC.util.isType(self.socket.readyState, "number")
                               ? self.socket
                               : new WebSocket("ws://"+ APIservice.GetSocket() +"/jsonrpc");

                    console.log("Transporter::%s::Connection(%o)", uneXBMC.setting.method, {url: socket.url, state: socket.readyState, socket: socket});

                    /**
                     * Build a new Request object for the incoming command
                     *
                     * Increase: if request id already exists
                     */
                    socket.api = new self.BuildRequest(command);
                    if (self.queue && self.queue[socket.api.request.id]){
                        socket.api.request.id += socket.api.request.id.length;
                    }

                    /**
                     * Submit the command when connection is stable, otherwise push into the queue
                     */
                    self.queue = self.queue || {};
                    self.queue[socket.api.request.id] = {callback: callback, command: socket.api};

                    if (socket && socket.commit && socket.readyState === WebSocket.OPEN){
                        socket.commit(socket.api, callback);
                    }

                    /**
                     * Called, when connected to host
                     */
                    socket.onopen = function()
                    {
                        /**
                         * Register the new 'commit' method when connection established
                         */
                        socket.commit = function(command, callback)
                        {
                            console.log("Transporter::%s::Send(%o)", uneXBMC.setting.method, {url: socket.url, state: socket.readyState, id: command.request.id, command: command});
                            socket.send(command.toString(), callback);

                            if (Object.keys(self.queue).length <= 1){
                                APIservice.DispatchEvent("loading:resources:start");
                            }
                        };

                        /**
                         * Move the current command in into the queue
                         */
                        self.queue = self.queue || {};
                        self.queue[socket.api.request.id] = {callback: callback, command: socket.api};

                        /**
                         * Queue: Start batch processing
                         */
                        for (var index in self.queue){
                            socket.commit(self.queue[index].command, self.queue[index].callback);
                        }
                    };

                    socket.onerror = function(error)
                    {
                        console.log("Transporter::%s::onError(%o)", uneXBMC.setting.method, {url: socket.url, state: socket.readyState, error: error, socket: socket});
                        callback.error.call(this, [error]);
                    };
                    socket.onclose = function(error)
                    {
                        console.log("Transporter::%s::onClose(%o)", uneXBMC.setting.method, {url: socket.url, state: socket.readyState, error: error, socket: socket});
                        callback.then.call(self, arguments);

                        var eventData = {};
                        if (error && error.code && error.code <= 1006){
                            eventData.errors = ["Error: The endpoint has terminated the connection"];
                        }

                        APIservice.DispatchEvent("modal:transporter:open", eventData);
                    };

                    socket.onmessage = function (event)
                    {
                        console.log("Transporter::%s::onMessage(%o)", uneXBMC.setting.method, {url: socket.url, state: socket.readyState, data: JSON.parse(event.data), socket: socket});

                        if (event && uneXBMC.util.isType(event, "object") === true && event.data){
                            event = JSON.parse(event.data);

                            /**
                             * When request id exists, then call the user callback
                             */
                            if (self.queue && event.id && self.queue[event.id]){
                                self.queue[event.id].callback.success.call(this, [event][0]);
                                delete(self.queue[event.id]);

                                if (Object.keys(self.queue).length === 0){
                                    APIservice.DispatchEvent("loading:resources:complete");
                                }
                            }

                            self.Notifications(event);
                        }
                    };
                },
                Notifications: function(data)
                {
                    if (data === null || uneXBMC.util.isType(data, "object") === false){
                        return(false);
                    }
                    if (data.error && uneXBMC.util.isType(data.error, "object") === true){
                        return(uneXBMC.util.communicationError(data));
                    }
                    if (uneXBMC.util.isType(data.params, "object") === true && data.params.sender === "xbmc"){
                        return(uneXBMC.util.communicationMessage(data));
                    }
                }
            },
            HTTP:
            {
                defaults:
                {
                    port: document.location.port || 8080,
                    host: document.location.hostname
                },
                Send: function(command, callback, APIservice)
                {

                }
            }
        };
        self.Get = function(name)
        {
            if (uneXBMC.util.isType(name, "string") === true && self.Has(name) === true){
                return(transporters[name]);
            }

            return(null);
        };
        self.Current = function()
        {
            return(self.current || null);
        };
        self.GetName = function()
        {
            return(uneXBMC.setting.method || null);
        };
        self.Initialize = function()
        {
            var method = ("WebSocket" in window) ? "WebSocket" : "HTTP";
            if (self.Has(method)){
                self.current = this.Get(method);
                uneXBMC.setting.method = method;
            }

            console.log("Transporter::Initialize() -> new Transport: %h", method);

            return(self.current && method === uneXBMC.setting.method ? true : false);
        };
        self.Has = function(name)
        {
            return(name && self.Availables().indexOf(name) !== -1);
        };
        self.GetPort = function()
        {
            if (uneXBMC.setting.transport && uneXBMC.setting.transport[self.GetName()]
            && (uneXBMC.setting.transport[self.GetName()].port)){
                return(uneXBMC.setting.transport[self.GetName()].port)
            }

            return(self.Current().defaults.port)
        };
        self.Availables = function()
        {
            return(Object.keys(transporters) || []);
        };

        return(self);
    });

    /**
     * Provider:Locale
     */
    angular.module("XBMC.Locale", ["pascalprecht.translate"]).provider("Locale", function Locale($translateProvider){
        this.$get = ["$translate", function($translate){
            this.GetService = function GetService(){
                return($translate);
            };

            return(this);
        }];

        $translateProvider.useSanitizeValueStrategy("escaped");

        /**
         * Register a loader for the static files
         *
         * Configure: staticFilesLoader
         */
        $translateProvider.useStaticFilesLoader({
            prefix: "resources/i18n/",
            suffix: ".json"
        });

        /**
         * Register fallback keys if none of the other language are available
         */
        $translateProvider.fallbackLanguage(["en_US", "de_DE"]);

        /**
         * Build and register the language negotiation
         */
        this.languageKeys  = {};
        this.languageNames = {};
        var availablesLang = uneXBMC.languages || uneXBMCextend.languages;
        for(var name in availablesLang || []){
            var language = availablesLang[name];
            if (language.name === null || !language.keys || !language.keys.length){
                continue;
            }

            /**
             * Build the language negotiation
             */
            this.languageNames[name] = language.name;
            for (var lang in language.keys){
                this.languageKeys[language.keys[lang]] = name;
            }
        }

        this.GetLanguageName = function(key){
            if (key === null){
                return(this.languageNames);
            }
        };

        this.GetLanguageKey = function(language)
        {
            var lang = Object.keys(this.languageKeys);
            var name = lang.indexOf((language || navigator.browserLanguage || navigator.language));
            if (name === -1 || uneXBMC.util.isType(lang[name], "undefined") === true){
                return(language);
            }

            return(this.languageKeys[lang[name]]);
        };

        this.SetLanguage = function(language)
        {
            this.language = this.GetLanguageKey(language);
            $translateProvider.use(this.GetLanguageKey(language));

            return(this);
        };

        this.GetLanguage = function()
        {
            return(this.language);
        };

        return(this);
    });

    /**
     * Provider:Navigation
     */
    angular.module("XBMC.Navigation", []).factory("Navigation", function Navigation($rootScope){
        var scope   = $rootScope.$root;
        var entries = uneXBMC.navigation;

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

    /**
     * Provider:MovieFactory
     */
    angular.module("XBMC.Factory", []).factory("MovieFactory", function MovieFactory($rootScope, mediaLibrary, asyncApply, APIservice, Transporter){
        var factory = {
            api     : APIservice,
            library : mediaLibrary,
            helper  : {
                GetThumbnailPath: function(thumbnail)
                {
                    return(APIservice.GetHttpSocket()+ "/"+ (thumbnail ? ("image/"+ encodeURI(thumbnail)) : thumbnail));
                },
                GetFilename: function(path)
                {
                    if (path.indexOf("\\")){
                        path = path.replace(/\\/ig, "/");
                    }
                    path = path.split("/");

                    return path[path.length -1];
                },
                GetRatingScore: function(rating)
                {
                    var rating_round = Math.round(rating / 2) -1;
                    var rating_array = [0];
                    for (var index = 1;index <= rating_round; index++) rating_array.push(index);
                    return({
                        score: rating,
                        array: rating_array,
                        index: (Math.round(Math.round(rating / 2 *2).toPrecision(2.5)) / 2).toString().replace(".", "")
                    });
                },
                GetReadableDate: function(date){
                    if (date !== "") return new Date(date.replace(" ", "T"));
                },
                SecondToMinutes: function(second)
                {
                    return(Math.floor(second / 60));
                },
                SecondsToTime: function(second)
                {
                    this.time = [Math.floor(second / (60 * 60)), Math.floor(second % (60 * 60) / 60), Math.ceil(second  % (60 * 60) % 60)];
                    this.unit = (this.time[0] === 0 && this.time[1] === 0) ? "seconds" : (this.time[0] === 0 ? "minutes" : "hours");
                    this.real = this.time.concat();
                    if (this.real[0] === 0) {delete(this.real[0]);}
                    if (this.real[2] && this.real[2].toString().length === 1 || this.real[2] === 0) {this.real[2] = "0"+ this.real[2];}

                    return({
                        unit : this.unit,
                        real : this.ArrayToString(this.real, ":"),
                        full : this.ArrayToString(this.time, ":"),
                        time : {
                            h: this.real[0],
                            m: this.real[1],
                            s: this.real[2]
                        },
                        input: second,
                        short: this.ArrayToString(this.real.splice(this.unit === "seconds" ? 2 : (this.unit === "minutes" ? 1 : 0)), ":")
                    });
                },
                ArrayToString: function (array, seperator)
                {
                    var seperator = uneXBMC.util.isType(seperator, "undefined") ? ", " : seperator;
                    var arrString = "";
                    for (var index in array){
                        arrString += array[index];
                        if (uneXBMC.util.isType(array[(parseInt(index) +1)], "undefined") === false){
                            arrString += seperator;
                        }
                    }

                    return(arrString);
                },
                MapMediaResponse: function(media)
                {
                    if (uneXBMC.util.isType(media, "object") === false){
                        return(media);
                    }

                    for(var index in media){
                        if (media[index] === null) continue;
                        var entry  = media[index];

                        entry.poster    = (entry.art && entry.art.poster) ? this.GetThumbnailPath(entry.art.poster) : null;
                        entry.fanart    = (entry.art && entry.art.fanart) ? this.GetThumbnailPath(entry.art.fanart) : null;
                        entry.banner    = (entry.art && entry.art.banner) ? this.GetThumbnailPath(entry.art.banner) : null;

                        if (uneXBMC.util.isType(entry.cast, "object") === true){
                            for(var name in entry.cast){
                                if (uneXBMC.util.isType(entry.cast[name].thumbnail, "undefined")) continue;
                                entry.cast[name].image = this.GetThumbnailPath(entry.cast[name].thumbnail);
                            }
                        }

                        entry.thumbnail = entry.thumbnail? this.GetThumbnailPath(entry.thumbnail) : null;
                        entry.ratings   = entry.rating   ? this.GetRatingScore(entry.rating) : null;
                        entry.filename  = entry.file     ? this.GetFilename(entry.file) : null;
                        entry.duration  = entry.runtime  ? this.SecondsToTime(entry.runtime) : null;
                        entry.minutes   = entry.runtime  ? this.SecondToMinutes(entry.runtime) : null;
                        entry.youtube   = entry.trailer  ? entry.trailer.split("youtube/?action=play_video&videoid=")[1] : null;
                        entry.time      = {
                              dateadded : (entry.dateadded  ? this.GetReadableDate(entry.dateadded) : null),
                              lastplayed: (entry.lastplayed ? this.GetReadableDate(entry.lastplayed) : null),
                              premiered : (entry.premiered  ? this.GetReadableDate(entry.premiered) : null)};

                        media[index]    = entry;
                    }

                    return(media);
                }
            },

            GetMovies: function(callback, context)
            {
                return(this.LoadResource(
                       callback, context, "movies", "movieid",
                       uneXBMC.rpc.methods.VideoLibrary.GetMovies()
                ));
            },
            GetAlbums: function(callback, context)
            {
                return(this.LoadResource(
                       callback, context, "albums", "albumid",
                       uneXBMC.rpc.methods.AudioLibrary.GetAlbums()
                ));
            },
            GetTvShows: function(callback, context)
            {
                return(this.LoadResource(
                       callback, context, "tvshows", "tvshowid",
                       uneXBMC.rpc.methods.VideoLibrary.GetTVShows()
                ));
            },
            LoadResource: function(callback, context, resource, identify, method)
            {
                callback = uneXBMC.util.isType(callback, "function") ? callback : uneXBMC.util.noop;

                if (this.hasCache(resource) === false){
                    this.LoadData(resource, identify, {
                        success: function (data){
                            callback.apply(context, [data[0] || data, asyncApply, callback]);
                        }
                    }, method);
                } else callback.apply(context, [this.getCache(resource), asyncApply]);

                return(this);
            },
            LoadData: function (resource, identify, userCallback, caller)
            {
                var instance = this;
                var callback = {
                    success: function(data){
                        if (uneXBMC.util.isType(data.result, "undefined") || uneXBMC.util.isType(data.result[resource], "undefined")) return(false);
                        var created = Date.now();
                        var mapping = instance.helper.MapMediaResponse(data.result[resource]);
                        var storage = {length: mapping.length, timestamp: created};
                        for(var num in mapping){
                            var idx = identify || num;
                            storage[mapping[num][idx]] = mapping[num];
                        }

                        mediaLibrary[resource] = storage;
                        userCallback.success.call(instance, [mediaLibrary[resource]]);
                    }
                };

                return APIservice.Send(caller, callback);
            },
            _buildCallback: function(userCallback, callback)
            {
                var instance = this;
                var success  = function(data){
                    if (data === null || uneXBMC.util.isType(data.result, "undefined")) return(false);
                    callback.call(instance, userCallback, data);
                };

                return({success: success});
            },
            BuildRequest: function(userCallback, api)
            {
                var callback = this._buildCallback(userCallback, function(callback, data){
                    callback = callback.success === undefined ? callback : callback.success;
                    callback.apply(this, [this.helper.MapMediaResponse(data.result), asyncApply]);
                });

                return APIservice.Send(api, callback, userCallback);
            },
            hasCache: function(name)
            {
                return(mediaLibrary[name] !== undefined);
            },
            getCache: function(name)
            {
                return(mediaLibrary[name]);
            }
        };

        return(factory);
    });

    /**
     * Controller:Navigation
     */
    window.uneXBMC.controller("NavigationCtrl", ["$scope", "Navigation", function NavigationCtrl($scope, Navigation){
        $scope.entries  = Navigation.GetEntries();

        $scope.$on("loading:resources:complete", function(event, data){
            angular.element("#loading-mask .bar.progress").addClass("done");
        });

        $scope.$on("loading:resources:start", function(event, data){
            angular.element("#loading-mask .bar.progress").removeClass("done");
        });
    }]);

    /**
     * Controller:Content
     */
    window.uneXBMC.controller("ContentCtrl", ["$scope", "$location", "Navigation", function ContentCtrl($scope, $location, Navigation){
        //....
    }]);

    /**
     * XBMC:Cookie
     */
    window.uneXBMC.cookie = {
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

            if (uneXBMC.util.isType(arguments[arguments.length-1], "function")){
                arguments[arguments.length-1].call(null)
            }

            return(this);
        }
    };

}(window));