/**!
 * uneXBMC.rpc.js | XBMC JSON-RPC API
 */
(function(window){
    "use strict";

    window.uneXBMC     = window.uneXBMC || {};
    window.uneXBMC.rpc = {};

    /**
     * JSON-RPC API Version 6
     * 
     * @description {API Methods}
     * @memberof    {uneXBMC.rpc}
     * @type        {object}
     */
    window.uneXBMC.rpc.methods = {

        /**
         * Methods Addons
         * 
         * @namespace {uneXBMC.rpc.methods.Addons}
         * @type      {object}
         */
        Addons: {

            /**
             * Executes the given addon with the given parameters (if possible)
             * 
             * @param  {string} addonid
             * @return {object}
             */
            ExecuteAddon: function(addonid){

                return({
                    method : "Addons.ExecuteAddon",
                    params : {addonid: addonid}
                });
            },

            /**
             * Gets the details of a specific addon
             * 
             * @param  {string} addonid
             * @return {object}
             */
            GetAddonDetails: function(addonid){

                return({
                    method : "Addons.GetAddonDetails",
                    params : {addonid: addonid}
                });
            },

            /**
             * Gets all available addons
             * 
             * @return {object}
             */
            GetAddons: function(){

                return({
                    method : "Addons.GetAddons"
                });
            }
        },

        /**
         * Methods Application [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.Application}
         * @type      {object}
         */
        Application: {

        },

        /**
         * Global types : Audio
         * 
         * @namespace {uneXBMC.rpc.methods.Audio}
         * @type      {object}
         */
        Audio: {
            Fields: {
                Album: {
                    enums: ["title", "description", "artist", "genre", "theme", "mood", "style", "type", "albumlabel", "rating", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart", "thumbnail", "playcount", "genreid", "artistid", "displayartist"]
                },
                Song: {
                    enums: ["title", "artist", "albumartist", "genre", "year", "rating", "album", "track", "duration", "comment", "lyrics", "musicbrainztrackid", "musicbrainzartistid", "musicbrainzalbumid", "musicbrainzalbumartistid", "playcount", "fanart", "thumbnail", "file", "albumid", "lastplayed", "disc", "genreid", "artistid", "displayartist", "albumartistid"]
                }
        }
        },

        /**
         * Methods AudioLibrary [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.AudioLibrary}
         * @type      {object}
         */
        AudioLibrary: {

            /**
             * Retrieve all albums from specified artist or genre
             *
             * @param  {array}  properties [~Audio.Fields.Album.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetAlbums: function(properties, limits, sort ){
                this.properties = !uneXBMC.util.isType(properties, "array") ? uneXBMC.rpc.methods.Audio.Fields.Album.enums : properties;
                this.limits     = !uneXBMC.util.isType(limits, "object") ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = !uneXBMC.util.isType(sort, "object") ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "AudioLibrary.GetAlbums",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all songs from specified album, artist or genre
             *
             * @param  {array}  properties [~Audio.Fields.Song.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @param  {object} filter [null]
             * @return {object}
             */
            GetSongs: function(properties, limits, sort, filter){
                this.properties = une.property.isArray(properties) === false ? uneXBMC.rpc.methods.Audio.Fields.Song.enums : properties;
                this.limits     = une.property.isObject(limits) === false ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = une.property.isObject(sort) === false ? uneXBMC.rpc.methods.List.Sort : sort;
                this.filter     = une.property.isObject(filter) === false ? {} : filter;

                return({
                    method : "AudioLibrary.GetSongs",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits, filter: this.filter}
                });
            }
        },

        /**
         * Global types : Library
         * 
         * @namespace {uneXBMC.rpc.methods.Library}
         * @type      {object}
         */
        Library: {
            Fields: {
                Genre: {
                    enums: ["title", "thumbnail"]
                }
            }
        },

        /**
         * Global types : List
         * 
         * @namespace {uneXBMC.rpc.methods.List}
         * @type      {object}
         */
        List: {
            Limits: {
                end  : 0,
                start: 0
            },
            Sort: {
                order        : "ascending",
                ignorearticle: false,
                method       : "none"
            },
            Fields: {
                All: {
                    enums: ["title", "artist", "albumartist", "genre", "year", "rating", "album", "track", "duration", "comment", "lyrics", "musicbrainztrackid", "musicbrainzartistid", "musicbrainzalbumid", "musicbrainzalbumartistid", "playcount", "fanart", "director", "trailer", "tagline", "plot", "plotoutline", "originaltitle", "lastplayed", "writer", "studio", "mpaa", "cast", "country", "imdbnumber", "premiered", "productioncode", "runtime", "set", "showlink", "streamdetails", "top250", "votes", "firstaired", "season", "episode", "showtitle", "thumbnail", "file", "resume", "artistid", "albumid", "tvshowid", "setid", "watchedepisodes", "disc", "tag", "art", "genreid", "displayartist", "albumartistid", "description", "theme", "mood", "style", "albumlabel", "sorttitle", "episodeguide", "uniqueid", "dateadded", "channel", "channeltype", "hidden", "locked", "channelnumber", "starttime", "endtime"] 
                }
            },
            item: {

                /**
                 * @param  {object} properties
                 */
                Base: function(properties){

                    return({
                        method : "List.Item.Base",
                        params : properties
                    });
                }
            }
        },

        /**
         * Methods Files [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.Files}
         * @type      {object}
         */
        Files: {

            /**
             * Global types : Media
             * 
             * @namespace {uneXBMC.rpc.methods.Files.Media}
             * @type      {object}
             */
            Media: {
                enums: ["files", "video", "music", "pictures", "programs"]
            },

            /**
             * Get the sources of the media windows
             * 
             * @param  {string} media [enum:~Files.Media]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetSources: function(media, limits, sort){
                this.media  = !uneXBMC.util.isType(media, "string") ? this.Media.enums[1] : media;
                this.limits = !uneXBMC.util.isType(limits, "object") ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort   = !uneXBMC.util.isType(sort, "object") ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "Files.GetSources",
                    params : {media: this.media, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Get the directories and files in the given directory
             *
             * @param  {string} directory
             * @param  {string} media [enum:~Files.Media]
             * @param  {array}  properties [[]]
             * @return {object}
             */
            GetDirectory: function(directory, media, properties){
                this.media  = (typeof media !== "string" ? this.Media.enums[0] : media);
                this.properties = typeof properties !== "Array" ? ["title", "year", "set", "setid", "size", "mimetype"] : properties;

                return({
                    method : "Files.GetDirectory",
                    params : {directory: directory, media: this.media, properties: this.properties}
                });
            }
        },

        /**
         * Methods GUI [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.GUI}
         * @type      {object}
         */
        GUI: {

        },

        /**
         * Methods Input [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.Input}
         * @type      {object}
         */
        Input: {

        },

        /**
         * Methods JSONRPC [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.JSONRPC}
         * @type      {object}
         */
        JSONRPC: {

            /**
             * Get client-specific configurations
             * 
             * @deprecated HTTP doesn't Support JSONRPC.GetConfiguration
             * @return {object}
             */
            GetConfiguration: function(){
                return({
                    method : "JSONRPC.GetConfiguration",
                    jsonrpc: "1.0"
                });
            },
  
            /**
             * Enumerates all actions and descriptions
             * 
             * @param  {boolean} getdescriptions [true]
             * @param  {boolean} getmetadatab [true]
             * @param  {boolean} filterbytransport [true]
             * @return {object}
             */
            Introspect: function(getdescriptions, getmetadata, filterbytransport){
                this.getdescriptions   = (typeof getdescriptions !== "boolean" ? true : getdescriptions);
                this.getmetadata       = (typeof getmetadata !== "boolean" ? true : getmetadata);
                this.filterbytransport = (typeof filterbytransport !== "boolean" ? true : filterbytransport);

                return({
                    method : "JSONRPC.Introspect",
                    params: {getdescriptions: this.getdescriptions, getmetadata: this.getmetadata, filterbytransport: this.filterbytransport}
                });
            },

            /**
             * Notify all other connected clients
             * 
             * @param  {string} sender
             * @param  {string} message
             * @param  {array|object} data [null]
             * @return {object}
             */
            NotifyAll: function(sender, message, data){

                return({
                    method : "JSONRPC.NotifyAll",
                    sender : sender,
                    message: message,
                    data   : data
                });
            },

            /**
             * Retrieve the clients permissions
             * 
             * @return {object}
             */
            Permission: function(){

                return({
                    method : "JSONRPC.Permission"
                });
            },

            /**
             * Ping responder
             * 
             * @return {object}
             */
            Ping: function(){

                return({
                    method : "JSONRPC.Ping"
                });
            },

            /**
             * Change the client-specific configuration
             * 
             * @param  {object}  notifications
             * @param  {boolean} notifications.gui [null]
             * @param  {boolean} notifications.other [null]
             * @param  {boolean} notifications.input [null]
             * @param  {boolean} notifications.videolibrary [null]
             * @param  {boolean} notifications.audiolibrary  [null]
             * @param  {boolean} notifications.playlist [null]
             * @param  {boolean} notifications.system [null]
             * @param  {boolean} notifications.player [null]
             * @param  {boolean} notifications.application [null]
             * @return {object}
             */
            SetConfiguration: function(notifications){

                return({
                    method : "JSONRPC.SetConfiguration",
                    notifications : notifications
                });
            },

            /**
             * Retrieve the JSON-RPC protocol version.
             * 
             * @return {object}
             */
            Version: function(){

                return({
                    method : "JSONRPC.Version"
                });
            }
            
        },

        /**
         * Methods PVR [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.PVR}
         * @type      {object}
         */
        PVR: {

        },

        /**
         * Methods Player
         * 
         * @namespace {uneXBMC.rpc.methods.Player}
         * @type      {object}
         */
        Player: {

            /**
             * Global types : Property
             *
             * @type {object}
             */
            Property: {

                /**
                 * @type {array}
                 */
                Value: ["canrepeat", "canmove","canshuffle","speed","percentage","playlistid","audiostreams","position","repeat", "currentsubtitle","canrotate","canzoom","canchangespeed","type","partymode","subtitles","canseek", "time","totaltime","shuffled","currentaudiostream","live","subtitleenabled"]
            },

            /**
             * Returns all active players
             * 
             * @return {object}
             */
            GetActivePlayers: function(){

                return({
                    method : "Player.GetActivePlayers"
                });
            },

            /**
             * Retrieves the currently played item
             * 
             * @param  {number} playerid
             * @param  {array}  properties [Player.Property.Value]
             * @return {object}
             */
            GetItem: function(playerid, properties){
                this.param = (typeof properties === "undefined" || typeof properties !== "array")
                           ? uneXBMC.rpc.fieldsAll.enums : properties;

                return({
                    method : "Player.GetItem",
                    params : {playerid: playerid, properties: this.param}
                });
            },

            /**
             * Retrieves the values of the given properties
             * 
             * @param  {number} playerid
             * @param  {array}  properties [Player.Property.Value[]]
             * @return {object}
             */
            GetProperties: function(playerid, properties){
                this.properties = une.property.isArray(properties) ? properties : uneXBMC.rpc.methods.Player.Property.Value;

                return({
                    method : "Player.GetProperties",
                    params : {playerid: playerid, properties: this.properties}
                });
            },

            /**
             * Go to previous/next/specific item in the playlist
             * 
             * @param  {number} playerid
             * @param  {string} to
             * @return {object}
             */
            GoTo: function(playerid, to){

                return({
                    method : "Player.GoTo",
                    params : {playerid: playerid, to: to}
                });
            },

            /**
             * If picture is zoomed move viewport left/right/up/down otherwise skip previous/next
             * 
             * @param  {number} playerid
             * @param  {string} direction
             * @return {object}
             */
            Move: function(playerid, direction){

                return({
                    method : "Player.Move",
                    params : {playerid: playerid, direction: direction}
                });
            },

            /**
             * Start playback of either the playlist with the given ID, a slideshow with the pictures from the given directory or a single file or an item from the database.
             * 
             * @param  {Object} item
             * @param  {object} options 
             * @return {object}
             */
            Open: function(item, options){

                return({
                    method : "Player.Open",
                    params : {item: item, options: options }
                });
            },

            /**
             * Pauses or unpause playback and returns the new state
             * 
             * @param  {number} playerid
             * @param  {string|boolean} play [toggle]
             * @return {object}
             */
            PlayPause: function(playerid, play){
                this.play = (typeof play === "undefined" ? "toggle" : play);

                return({
                    method : "Player.PlayPause",
                    params : {playerid: playerid, play: this.play}
                });
            },

            /**
             * Rotates current picture
             * 
             * @param  {number} playerid
             * @param  {string} value [clockwise]
             * @return {object}
             */
            Rotate: function(playerid, value){
                this.value = (typeof value === "undefined" ? "clockwise" : value);

                return({
                    method : "Player.Rotate",
                    params : {playerid: playerid, value: this.value}
                });
            },

            /**
             * Seek through the playing item
             * 
             * @param  {number} playerid
             * @param  {string} value [clockwise]
             * @return {object}
             */
            Seek: function(playerid, value){
                this.value = (typeof value === "undefined" ? "clockwise" : value);

                return({
                    method : "Player.Seek",
                    params : {playerid: playerid, value: this.value}
                });
            },

            /**
             * Set the audio stream played by the player
             * 
             * @param  {number} playerid
             * @param  {string} stream
             * @return {object}
             */
            SetAudioStream: function(playerid, stream){

                return({
                    method : "Player.SetAudioStream",
                    params : {playerid: playerid, stream: stream}
                });
            },

            /**
             * Turn partymode on or off
             * 
             * @param  {number} playerid
             * @param  {string|boolean} partymode [toggle]
             * @return {object}
             */
            SetPartymode: function(playerid, partymode){
                this.partymode = (typeof partymode === "undefined" ? "toggle" : partymode);

                return({
                    method : "Player.SetPartymode",
                    params : {playerid: playerid, partymode: this.partymode}
                });
            },

            /**
             * Set the repeat mode of the player
             * 
             * @param  {number}  playerid
             * @param  {boolean} repeat
             * @return {object}
             */
            SetRepeat: function(playerid, repeat){
                this.repeat = (typeof repeat === "undefined" ? true : repeat);

                return({
                    method : "Player.SetRepeat",
                    params : {playerid: playerid, repeat: this.repeat}
                });
            },

            /**
             * Shuffle/Unshuffle items in the player
             * 
             * @param  {number} playerid
             * @param  {string|boolean} shuffle [toggle]
             * @return {object}
             */
            SetShuffle: function(playerid, shuffle){
                this.shuffle = (typeof shuffle === "undefined" ? true : shuffle);

                return({
                    method : "Player.SetShuffle",
                    params : {playerid: playerid, shuffle: this.shuffle}
                });
            },

            /**
             * Set the speed of the current playback
             * 
             * @param  {numberd} playerid
             * @param  {number|float} speed
             * @return {object}
             */
            SetSpeed: function(playerid, speed){
                this.speed = (typeof speed !== "number" ? parseInt(speed) : speed);

                return({
                    method : "Player.SetSpeed",
                    params : {playerid: playerid, speed: this.speed}
                });
            },

            /**
             * Set the subtitle displayed by the player
             * 
             * @param  {number}  playerid
             * @param  {string}  subtitle
             * @param  {boolean} enable shuffle [true]
             * @return {object}
             */
            SetSubtitle: function(playerid, subtitle, enable){
                this.enable = (typeof enable === "undefined" ? true : enable);

                return({
                    method : "Player.SetSubtitle",
                    params : {playerid: playerid, subtitle: subtitle, enable: this.enable}
                });
            },

            /**
             * Stops playback
             * 
             * @param  {number} playerid
             * @return {object}
             */
            Stop: function(playerid){

                return({
                    method : "Player.Stop",
                    params : {playerid: playerid}
                });
            },

            /**
             * Zoom current picture
             * 
             * @param  {number} playerid
             * @param  {number} zoom
             * @return {object}
             */
            Zoom: function(playerid, zoom){

                return({
                    method : "Player.Zoom",
                    params : {playerid: playerid, zoom: zoom}
                });
            }
        },

        /**
         * Methods Playlist
         * 
         * @namespace {uneXBMC.rpc.methods.Playlist}
         * @type      {object}
         */
        Playlist: {

            /**
             * Global types : Property
             *
             * @type {object}
             */
            Property: {
                Name: {
                    enums: ["type", "size"]
                }
            },

            /**
             * Add item(s) to playlist
             *
             * @param  {number} playlistid
             * @param  {object} item
             * @return {object}
             */
            Add: function(playlistid, item){

                return({
                    method : "Playlist.Add",
                    params : {playlistid: playlistid, item: item}
                });
            },

            /**
             * Clear playlist
             *
             * @param  {number} playlistid
             * @return {object}
             */
            Clear: function(playlistid){

                return({
                    method : "Playlist.Clear",
                    params : {playlistid: playlistid}
                });
            },

            /**
             * Get all items from playlist
             *
             * @param  {number} playlistid
             * @param  {array}  properties [~List.Fields.All.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetItems: function(playlistid, properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.List.Fields.All.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "Playlist.GetItems",
                    params : {playlistid: playlistid, properties: this.properties, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Returns all existing playlists
             *
             * @return {object}
             */
            GetPlaylists: function(){

                return({method : "Playlist.GetPlaylists"});
            },

            /**
             * Retrieves the values of the given properties
             *
             * @param  {number} playlistid
             * @param  {array}  properties [~Playlist.Property.Name.enums]
             * @return {object}
             */
            GetProperties: function(playlistid, properties, limits, sort){
                this.properties = typeof properties !== "string" ? uneXBMC.rpc.methods.Playlist.Property.Name.enums[0] : properties;

                return({
                    method : "Playlist.GetProperties",
                    params : {playlistid: playlistid, properties: this.properties}
                });
            },

            /**
             * Insert item(s) into playlist. Does not work for picture playlists (aka slideshows).
             *
             * @param  {number} playlistid
             * @param  {number} position
             * @param  {object} item
             * @return {object}
             */
            Insert: function(playlistid, position, item){

                return({
                    method : "Playlist.Insert",
                    params : {playlistid: playlistid, position: position, item: item}
                });
            },

            /**
             * Remove item from playlist. Does not work for picture playlists (aka slideshows).
             *
             * @param  {number} playlistid
             * @param  {number} position
             * @return {object}
             */
            Remove: function(playlistid, position){

                return({
                    method : "Playlist.Remove",
                    params : {playlistid: playlistid, position: position}
                });
            },

            /**
             * Swap items in the playlist. Does not work for picture playlists (aka slideshows).
             *
             * @param  {number} playlistid
             * @param  {number} position1
             * @param  {number} position2
             * @return {object}
             */
            Swap: function(playlistid, position1, position2){

                return({
                    method : "Playlist.Swap",
                    params : {playlistid: playlistid, position1: position1, position2: position2}
                });
            }
        },

        /**
         * Methods System [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.System}
         * @type      {object}
         */
        System: {

        },

        /**
         * Global types : Video
         * 
         * @namespace {uneXBMC.rpc.methods.Video}
         * @type      {object}
         */
        Video: {

            /**
             * @type {object}
             */
            Fields: {
                Movie: {
                    enums: ["title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline", "originaltitle", "lastplayed", "playcount", "writer", "studio", "mpaa", "cast", "country", "imdbnumber", "runtime", "set", "showlink", "streamdetails", "top250", "votes", "fanart", "thumbnail", "file", "sorttitle", "resume", "setid", "dateadded", "tag", "art"]
                },
                MovieSet: {
                    enums: ["title", "playcount", "fanart", "thumbnail", "art"]
                },
                Episode: {
                    enums: ["title", "plot", "votes", "rating", "writer", "firstaired", "playcount", "runtime", "director", "productioncode", "season", "episode", "originaltitle", "showtitle", "cast", "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "tvshowid", "dateadded", "uniqueid", "art"]
                },
                TVShow: {
                    enums: ["title", "genre", "year", "rating", "plot", "studio", "mpaa", "cast", "playcount", "episode", "imdbnumber", "premiered", "votes", "lastplayed", "fanart", "thumbnail", "file", "originaltitle", "sorttitle", "episodeguide", "season", "watchedepisodes", "dateadded", "tag", "art"]
                },
                Season: {
                    enums: ["season", "showtitle", "playcount", "episode", "fanart", "thumbnail", "tvshowid", "watchedepisodes", "art"]
                },
                MusicVideo: {
                    enums: ["title", "playcount", "runtime", "director", "studio", "year", "plot", "album", "artist", "genre", "track", "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "dateadded", "tag", "art"]
                }
            }
        },

        /**
         * Methods VideoLibrary
         * 
         * @namespace {uneXBMC.rpc.methods.VideoLibrary}
         * @type      {object}
         */
        VideoLibrary: {

            /**
             * Cleans the video library from non-existent items
             * 
             * @return {object}
             */
            Clean: function(){

                return({
                    method : "VideoLibrary.Clean"
                });
            },

            /**
             * Retrieve details about a specific tv show episode
             * 
             * @param  {number} episodeid
             * @param  {array} properties [~Video.Fields.Episode.enums]
             * @return {object}
             */
            GetEpisodeDetails: function(episodeid, properties){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Episode.enums : properties;

                return({
                    method : "VideoLibrary.GetEpisodeDetails",
                    params : {episodeid: episodeid, properties: this.properties}
                });
            },

            /**
             * Retrieve all tv show episodes
             * 
             * @param  {number} tvshowid [-1]
             * @param  {number} season [-1]
             * @param  {array}  properties [~Video.Fields.Episode.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetEpisodes: function(tvshowid, season, properties, limits, sort){
                this.tvshowid   = typeof tvshowid !== "number" ? -1 : tvshowid;
                this.season     = typeof season !== "number" ? 0 : season;
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Episode.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetEpisodes",
                    params : {tvshowid: this.tvshowid, season: this.season, properties: this.properties, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Retrieve all genres
             * 
             * @param  {string} type
             * @param  {array}  properties [~Library.Fields.Genre.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetGenres: function(type, properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Library.Fields.Genre.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetGenres",
                    params : {type: this.type, properties: this.properties, limits: this.limits}
                });
            },

            /**
             * Retrieve details about a specific movie
             * 
             * @param  {number} movieid
             * @param  {array}  properties [~Video.Fields.Movie.enums]
             * @return {object}
             */
            GetMovieDetails: function(movieid, properties){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Movie.enums : properties;

                return({
                    method : "VideoLibrary.GetMovieDetails",
                    params : {movieid: parseInt(movieid), properties: this.properties}
                });
            },

            /**
             * Retrieve details about a specific movie set
             * 
             * @param  {number} setid
             * @param  {array}  properties [~Video.Fields.MovieSet.enums]
             * @return {object}
             */
            GetMovieSetDetails: function(setid, properties){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.MovieSet.enums : properties;

                return({
                    method : "VideoLibrary.GetMovieSetDetails",
                    params : {setid: parseInt(setid), properties: this.properties}
                });
            },

            /**
             * Retrieve all movie sets
             * 
             * @param  {array}  properties [~Video.Fields.MovieSet.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetMovieSets: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.MovieSet.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetMovieSets",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all movies
             * 
             * @param  {array}  properties [~Video.Fields.Movie.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetMovies: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Movie.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetMovies",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve details about a specific music video
             * 
             * @param  {number} musicvideoid
             * @param  {array}  properties [~Video.Fields.MusicVideo.enums]
             * @return {object}
             */
            GetMusicVideoDetails: function(musicvideoid, properties){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.MusicVideo.enums : properties;

                return({
                    method : "VideoLibrary.GetMusicVideoDetails",
                    params : {musicvideoid: musicvideoid, properties: this.properties}
                });
            },

            /**
             * Retrieve all music videos
             * 
             * @param  {array}  properties [~Video.Fields.MusicVideo.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetMusicVideos: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.MusicVideo.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetMusicVideos",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all recently added tv episodes
             * 
             * @param  {array}  properties [~Video.Fields.Episode.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetRecentlyAddedEpisodes: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Episode.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetRecentlyAddedEpisodes",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all recently added movies
             * 
             * @param  {array}  properties [~Video.Fields.Movie.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetRecentlyAddedMovies: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Movie.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetRecentlyAddedMovies",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all recently added music videos
             * 
             * @param  {array}  properties [~Video.Fields.MusicVideo.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetRecentlyAddedMusicVideos: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.MusicVideo.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetRecentlyAddedMusicVideos",
                    params : {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all tv seasons
             * 
             * @param  {number} tvshowid
             * @param  {array}  properties [~Video.Fields.Season.enums]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetSeasons: function(tvshowid, properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.Season.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetSeasons",
                    params : {tvshowid: tvshowid, properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve details about a specific tv show
             * 
             * @param  {number} tvshowid
             * @param  {array}  properties [~Video.Fields.TVShow.enums]
             * @return {object}
             */
            GetTVShowDetails: function(tvshowid, properties){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.TVShow.enums : properties;

                return({
                    method : "VideoLibrary.GetTVShowDetails",
                    params : {tvshowid: tvshowid, properties: this.properties}
                });
            },

            /**
             * Retrieve all tv shows
             * 
             * @param  {array}  properties [~Video.Fields.TVShow]
             * @param  {object} limits [~List.Limits]
             * @param  {object} sort [~List.Sort]
             * @return {object}
             */
            GetTVShows: function(properties, limits, sort){
                this.properties = typeof properties !== "array" ? uneXBMC.rpc.methods.Video.Fields.TVShow.enums : properties;
                this.limits     = typeof limits !== "object" ? uneXBMC.rpc.methods.List.Limits : limits;
                this.sort       = typeof sort !== "object" ? uneXBMC.rpc.methods.List.Sort : sort;

                return({
                    method : "VideoLibrary.GetTVShows",
                    params : {properties: this.properties, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Scans the video sources for new library items
             * 
             * @param  {string} directory  ["" ]
             * @return {object}
             */
            Scan: function(directory){
                this.directory = typeof directory === "undefined" ? "" : directory;

                return({
                    method : "VideoLibrary.Scan",
                    params : {directory: this.directory}
                });
            }
        },

        /**
         * Methods XBMC [not yet implemented]
         * 
         * @namespace {uneXBMC.rpc.methods.XBMC}
         * @type      {object}
         */
        XBMC: {

        }
    };

    window.uneXBMC = uneXBMC;

}(window));