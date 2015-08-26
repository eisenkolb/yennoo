/*
 * Yennoo : Web Interface for XBMC/Kodi
 * Copyright 2015, Ronny Eisenkolb (@eisenkolb)
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
angular.module("Kodi.Factory", []).factory("MovieFactory", function($rootScope, mediaLibrary, asyncApply, APIservice, Transporter){
    var factory = {
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
                var seperator = Kodi.util.isType(seperator, "undefined") ? ", " : seperator;
                var arrString = "";
                for (var index in array){
                    arrString += array[index];
                    if (Kodi.util.isType(array[(parseInt(index) +1)], "undefined") === false){
                        arrString += seperator;
                    }
                }

                return(arrString);
            },
            MapMediaResponse: function(media)
            {
                if (Kodi.util.isType(media, "object") === false){
                    return(media);
                }

                for(var index in media){
                    if (media[index] === null) continue;
                    var entry = media[index];

                    entry.poster    = (entry.art && entry.art.poster) ? this.GetThumbnailPath(entry.art.poster) : null;
                    entry.fanart    = (entry.art && entry.art.fanart) ? this.GetThumbnailPath(entry.art.fanart) : null;
                    entry.banner    = (entry.art && entry.art.banner) ? this.GetThumbnailPath(entry.art.banner) : null;
                    entry.banner    = (entry.art && entry.banner === null && entry.art["tvshow.banner"]) ? this.GetThumbnailPath(entry.art["tvshow.banner"]) : null;

                    if (Kodi.util.isType(entry.cast, "object") === true){
                        for(var name in entry.cast){
                            if (Kodi.util.isType(entry.cast[name].thumbnail, "undefined")) continue;
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
                          premiered : (entry.premiered  ? this.GetReadableDate(entry.premiered) : null),
                          resume    : (entry.resume     ? this.SecondsToTime(entry.resume.position) : null)};

                    media[index]    = entry;
                }

                return(media);
            }
        },

        GetMovies: function(callback, context)
        {
            return(this.LoadResource(
                   callback, context, "movies", "movieid",
                   Kodi.rpc.methods.VideoLibrary.GetMovies()
            ));
        },
        GetAlbums: function(callback, context)
        {
            return(this.LoadResource(
                   callback, context, "albums", "albumid",
                   Kodi.rpc.methods.AudioLibrary.GetAlbums()
            ));
        },
        GetTvShows: function(callback, context)
        {
            return(this.LoadResource(
                   callback, context, "tvshows", "tvshowid",
                   Kodi.rpc.methods.VideoLibrary.GetTVShows()
            ));
        },
        LoadResource: function(callback, context, resource, identify, method)
        {
            callback = Kodi.util.isType(callback, "function") ? callback : Kodi.util.noop;

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
                    if (Kodi.util.isType(data.result, "undefined") || Kodi.util.isType(data.result[resource], "undefined")) return(false);
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
                if (data === null || Kodi.util.isType(data.result, "undefined")) return(false);
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