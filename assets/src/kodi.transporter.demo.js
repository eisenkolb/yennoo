/**!
 * @fileOverview XBMC/Kodi Demo transporter
 *
 * @author  [Ronny Eisenkolb]{@link https://github.com/eisenkolb}
 * @version 0.7.8
 * @license Yennoo : Web Interface for XBMC/Kodi<br>
 *          Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)<br>
 *          License: [MIT License]{@link http://www.opensource.org/licenses/MIT}
 */
(function(window, Yennoo){
    "use strict";

    Yennoo.transporter.register("Demo",{
		defaults:
		{
			port: document.location.port || 8080,
			host: document.location.hostname
		},
        BuildRequest: function(jsonrpc)
        {
            var api = jsonrpc();
            var opt = {
                url   : "./jsonrpc/",
                method: "GET",
                cache : true
            };

            if (api.dataurl == undefined || api.dataurl == null)
                opt = {};

            opt.dataType   = "json";
            opt.dataFilter = api.filter  || null;
            opt.url       += api.dataurl || "";

            return($.ajax(opt));
        },
		Send: function(command, callback, APIservice)
		{
            var request = this.BuildRequest(function(){

                /**
                 * TVShows
                 * --------------------------------------------------------------------------------
                 */

                if (command.method == "VideoLibrary.GetTVShows"
                || (command.method == "VideoLibrary.GetTVShowDetails")
                || (command.method == "VideoLibrary.GetSeasons")
                || (command.method == "VideoLibrary.GetEpisodes")){
                    command.dataurl = "VideoLibrary.GetTVShowDetails&id=%id%.json".replace(/%id%/g, command.params.tvshowid);

                    if (command.method == "VideoLibrary.GetTVShowDetails"){
                        command.process = function(data){
                            return({tvshowdetails: data.tvshowdetails});
                        };
                    }

                    if (command.method == "VideoLibrary.GetSeasons"){
                        command.process = function(data){
                            return({seasons: data.seasons});
                        };
                    }

                    if (command.method == "VideoLibrary.GetEpisodes"){
                        command.process = function(data){
                            return({episodes: data.episodes[command.params.season]});
                        };
                    }

                    if (command.method == "VideoLibrary.GetTVShows"){
                        command.dataurl = "VideoLibrary.GetTVShows.json";
                        command.process = function(data){
                            return({tvshows: data});
                        };
                    }
                }

                /**
                 * Albums
                 * --------------------------------------------------------------------------------
                 */

                if (command.method == "AudioLibrary.GetSongs"
                || (command.method == "AudioLibrary.GetAlbums")){
                    command.dataurl = "AudioLibrary.GetAlbums.json";

                    if (command.method == "AudioLibrary.GetAlbums"){
                        command.process = function(data){
                            return({albums: data});
                        };
                    }

                    if (command.method == "AudioLibrary.GetSongs"){
                        command.dataurl = "AudioLibrary.GetSongs&id=%id%.json".replace(/%id%/g, command.params.filter.albumid);
                        command.process = function (data) {
                            return({songs: data});
                        };
                    }
                }

                /**
                 * Sources
                 * --------------------------------------------------------------------------------
                 */
                if (command.method == "Files.GetDirectory"
                || (command.method == "Files.GetSources")){
                    command.dataurl = "Files.GetSources.json";
                    command.process = function (data) {
                        return({sources: data.sources[command.params.media]});
                    };

                    if (command.method == "Files.GetDirectory"){
                        command.process = function(data){
                            return({files: data.files[command.params.directory]});
                        };
                    }
                }

                /**
                 * Genres
                 * --------------------------------------------------------------------------------
                 */
                if (command.method == "VideoLibrary.GetGenres"){
                    command.dataurl = "VideoLibrary.GetGenres.json";
                    command.process = function(data) {
                        return({genres: data[command.params.type]});
                    };
                }

                /**
                 * Movies
                 * --------------------------------------------------------------------------------
                 */

                if (command.method == "VideoLibrary.GetMovies"){
                    command.dataurl = "VideoLibrary.GetMovies.json";
                    command.process = function(data){
                        return({movies: data});
                    };
                }

                return(command);
            });

            request.done(function(data){
                callback.success.call(this, {result: command.process.call(null, data)});
            });

            request.always(function(){
                APIservice.DispatchEvent("loading:resources:start");
            });

            request.complete(function(){
                APIservice.DispatchEvent("loading:resources:complete");
            });

            request.fail(function(error){
                callback.error.call(this, [error]);
                APIservice.DispatchEvent("overlay:settings:open", {
                    errors : ["Demo Error - Not yet implemented (API::%command%)".replace("%command%", command.method)],
                    tabName: "prefs-transporter"
                });
            });
		}
	});

    /**
     * Update providers from outside of angular
     */
    Yennoo.bootstrap(function(){

        var instance, injector, provider;

        instance = angular.element(document);
        injector = instance.injector();
        provider = injector.get("MovieFactory");
        provider.helper.GetThumbnailPath = function(image){return(image)};
        instance.scope().$apply();
    });

})(window, Yennoo);