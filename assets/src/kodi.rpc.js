/**!
 * @fileOverview XBMC/Kodi JSON-RPC API Methods
 *
 * @author  [Ronny Eisenkolb]{@link https://github.com/eisenkolb}
 * @version 1.1.2
 * @license Yennoo : Web Interface for XBMC/Kodi<br>
 *          Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)<br>
 *          License: [MIT License]{@link http://www.opensource.org/licenses/MIT}
 */
(function(window, Kodi){
    "use strict";

    /**
     * @namespace
     * @extends {Kodi}
     */
    Kodi.rpc = {};

    /**
     * JSON-RPC APIMethods
     *
     * @namespace
     * @extends {Kodi.rpc}
     * @version API Version 6
     */
    Kodi.rpc.methods = {

        /**
         * Methods Addons
         *
         * @namespace
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
                    method: "Addons.ExecuteAddon",
                    params: {addonid: addonid}
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
                    method: "Addons.GetAddonDetails",
                    params: {addonid: addonid}
                });
            },

            /**
             * Gets all available addons
             *
             * @return {object}
             */
            GetAddons: function(){

                return({
                    method: "Addons.GetAddons"
                });
            }
        },

        /**
         * Methods Application [not yet implemented]
         *
         * @namespace
         */
        Application: {

        },

        /**
         * Methods Application Audio
         *
         * @namespace
         */
        Audio: {

            /**
             * @type {{Album: {enums: string[]}, Song: {enums: string[]}}}
             */
            Fields: {

                /**
                 * @type object
                 */
                Album: {
                    enums: ["title", "description", "artist", "genre", "theme", "mood", "style", "type", "albumlabel", "rating", "year", "musicbrainzalbumid", "musicbrainzalbumartistid", "fanart", "thumbnail", "playcount", "genreid", "artistid", "displayartist"]
                },

                /**
                 * @type object
                 */
                Song: {
                    enums: ["title", "artist", "albumartist", "genre", "year", "rating", "album", "track", "duration", "comment", "lyrics", "musicbrainztrackid", "musicbrainzartistid", "musicbrainzalbumid", "musicbrainzalbumartistid", "playcount", "fanart", "thumbnail", "file", "albumid", "lastplayed", "disc", "genreid", "artistid", "displayartist", "albumartistid"]
                }
            }
        },

        /**
         * Methods AudioLibrary [not yet completed]
         *
         * @namespace
         */
        AudioLibrary: {

            /**
             * Retrieve all albums from specified artist or genre
             *
             * @param  {array}  [properties=~Audio.Fields.Album[0]] {@link Kodi.rpc.methods.Audio.Fields.Album}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetAlbums: function(properties, limits, sort ){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Audio.Fields.Album.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "AudioLibrary.GetAlbums",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all songs from specified album, artist or genre
             *
             * @param  {array}  [properties=~Audio.Fields.Song[0]] {@link Kodi.rpc.methods.Audio.Fields.Song}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @param  {object} [filter=null]
             * @return {object}
             */
            GetSongs: function(properties, limits, sort, filter){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Audio.Fields.Song.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;
                this.filter     = Kodi.util.isObject(filter)    ? filter     : {};

                return({
                    method: "AudioLibrary.GetSongs",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits, filter: this.filter}
                });
            }
        },

        /**
         * Global types : Library
         *
         * @namespace
         */
        Library: {

            /**
             * @type {{Genre: {enums: string[]}}}
             */
            Fields: {
                Genre: {
                    enums: ["title", "thumbnail"]
                }
            }
        },

        /**
         * Global types : List
         *
         * @namespace
         */
        List: {
            /** @type object **/
            Limits: {
                end  : 0,
                start: 0
            },
            /** @type object **/
            Sort: {
                order        : "ascending",
                ignorearticle: false,
                method       : "none"
            },
            /** @type object **/
            Fields: {
                /** @type object **/
                All: {
                    enums: ["title", "artist", "albumartist", "genre", "year", "rating", "album", "track", "duration", "comment", "lyrics", "musicbrainztrackid", "musicbrainzartistid", "musicbrainzalbumid", "musicbrainzalbumartistid", "playcount", "fanart", "director", "trailer", "tagline", "plot", "plotoutline", "originaltitle", "lastplayed", "writer", "studio", "mpaa", "cast", "country", "imdbnumber", "premiered", "productioncode", "runtime", "set", "showlink", "streamdetails", "top250", "votes", "firstaired", "season", "episode", "showtitle", "thumbnail", "file", "resume", "artistid", "albumid", "tvshowid", "setid", "watchedepisodes", "disc", "tag", "art", "genreid", "displayartist", "albumartistid", "description", "theme", "mood", "style", "albumlabel", "sorttitle", "episodeguide", "uniqueid", "dateadded", "channel", "channeltype", "hidden", "locked", "channelnumber", "starttime", "endtime"]
                }
            },

            /**
             * @type object
             */
            item: {

                /**
                 * @param {object} properties
                 */
                Base: function(properties){

                    return({
                        method: "List.Item.Base",
                        params: properties
                    });
                }
            }
        },

        /**
         * Methods Files
         *
         * @namespace
         */
        Files: {

            /**
             * Global types : Media
             *
             * @type object
             */
            Media: {
                enums: ["files", "video", "music", "pictures", "programs"]
            },

            /**
             * Downloads the given file
             *
             * Support: Only via HTTP POST/GET
             *
             * @param  {string} path
             * @return {object}
             */
            Download: function(path){

                return({
                    method: "Files.Download",
                    params: {path: path}
                });
            },

            /**
             * Get the sources of the media windows
             *
             * @param  {string} [media=~Files.Media[0]] {@link Kodi.rpc.methods.Files.Media}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetSources: function(media, limits, sort){
                this.media  = Kodi.util.isString(media)  ? media  : Kodi.rpc.methods.Media.enums[1];
                this.limits = Kodi.util.isObject(limits) ? limits : Kodi.rpc.methods.List.Limits;
                this.sort   = Kodi.util.isObject(sort)   ? sort   : Kodi.rpc.methods.List.Sort;

                return({
                    method: "Files.GetSources",
                    params: {media: this.media, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Get the directories and files in the given directory
             *
             * @param  {string} directory
             * @param  {string} [media=~Files.Media[]] {@link Kodi.rpc.methods.Files.Media}
             * @param  {array}  [properties=[]]
             * @return {object}
             */
            GetDirectory: function(directory, media, properties){
                this.media      = Kodi.util.isString(media)     ? media      : Kodi.rpc.methods.Media.enums[0];
                this.properties = Kodi.util.isArray(properties) ? properties : ["title", "year", "set", "setid", "size", "mimetype"];

                return({
                    method: "Files.GetDirectory",
                    params: {directory: directory, media: this.media, properties: this.properties}
                });
            },

            /**
             * Get details for a specific file
             *
             * @param  {string} file
             * @param  {string} [media=~Files.Media[0]] {@link Kodi.rpc.methods.Files.Media}
             * @param  {object} [properties=~Video.Fields.Movie] {@link Kodi.rpc.methods.Video.Fields.Movie}
             * @return {object}
             */
            GetFileDetails: function(file, media, properties ){
                this.media      = Kodi.util.isString(media)     ? media      : Kodi.rpc.methods.Files.Media.enums[0];
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Movie.enums;

                return({
                    method: "Files.GetFileDetails",
                    params: {file: file, media: this.media, properties: this.properties}
                });
            },

            /**
             * Provides a way to download a given file (e.g. providing an URL to the real file location)
             *
             * Support: Only via HTTP POST/GET
             *
             * @param  {string} path
             * @return {object}
             */
            PrepareDownload: function(path){

                return({
                    method: "Files.PrepareDownload",
                    params: {path: path}
                });
            }
        },

        /**
         * Methods GUI [not yet implemented]
         *
         * @namespace
         */
        GUI: {

        },

        /**
         * Methods Input [not yet implemented]
         *
         * @namespace
         */
        Input: {

        },

        /**
         * Methods JSONRPC [not yet implemented]
         *
         * @namespace
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
             * @param  {boolean} [getdescriptions=true]
             * @param  {boolean} [getmetadata=true]
             * @param  {boolean} [filterbytransport=true]
             * @return {object}
             */
            Introspect: function(getdescriptions, getmetadata, filterbytransport){
                this.getdescriptions   = Kodi.util.isBoolean(getdescriptions)   ? getdescriptions   : true;
                this.getmetadata       = Kodi.util.isBoolean(getmetadata)       ? getmetadata       : true;
                this.filterbytransport = Kodi.util.isBoolean(filterbytransport) ? filterbytransport : true;

                return({
                    method: "JSONRPC.Introspect",
                    params: {getdescriptions: this.getdescriptions, getmetadata: this.getmetadata, filterbytransport: this.filterbytransport}
                });
            },

            /**
             * Notify all other connected clients
             *
             * @param  {string} sender
             * @param  {string} message
             * @param  {array|object} [data=[]]
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
                    method: "JSONRPC.Permission"
                });
            },

            /**
             * Ping responder
             *
             * @return {object}
             */
            Ping: function(){

                return({
                    method: "JSONRPC.Ping"
                });
            },

            /**
             * Change the client-specific configuration
             *
             * @param  {object[]}  notifications
             * @param  {?boolean} [notifications[].gui=null]
             * @param  {?boolean} [notifications[].other=null]
             * @param  {?boolean} [notifications[].input=null]
             * @param  {?boolean} [notifications[].videolibrary=null]
             * @param  {?boolean} [notifications[].audiolibrary=null]
             * @param  {?boolean} [notifications[].playlist=null]
             * @param  {?boolean} [notifications[].system=null]
             * @param  {?boolean} [notifications[].player=null]
             * @param  {?boolean} [notifications[].application=null]
             * @return {object}
             */
            SetConfiguration: function(notifications){

                return({
                    method: "JSONRPC.SetConfiguration",
                    notifications: notifications
                });
            },

            /**
             * Retrieve the JSON-RPC protocol version.
             *
             * @return {object}
             */
            Version: function(){

                return({
                    method: "JSONRPC.Version"
                });
            }

        },

        /**
         * Methods PVR [not yet implemented]
         *
         * @namespace
         */
        PVR: {

        },

        /**
         * Methods Player
         *
         * @namespace
         */
        Player: {

            /**
             * Global types : Property
             *
             * @namespace
             * @type {object}
             */
            Property: {

                /**
                 * @enum
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
                    method: "Player.GetActivePlayers"
                });
            },

            /**
             * Retrieves the currently played item
             *
             * @param  {number} playerid
             * @param  {array}  [properties=~Player.Property.Value[]] {@link Kodi.rpc.methods.Player.Property.Value}
             * @return {object}
             */
            GetItem: function(playerid, properties){
                this.param = Kodi.util.isArray(properties) ? properties : Kodi.rpc.fieldsAll.enums;

                return({
                    method: "Player.GetItem",
                    params: {playerid: playerid, properties: this.param}
                });
            },

            /**
             * Retrieves the values of the given properties
             *
             * @param  {number} playerid
             * @param  {array}  [properties=~Player.Property.Value[]] {@link Kodi.rpc.methods.Player.Property.Value}
             * @return {object}
             */
            GetProperties: function(playerid, properties){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Player.Property.Value;

                return({
                    method: "Player.GetProperties",
                    params: {playerid: playerid, properties: this.properties}
                });
            },

            /**
             * Go to previous/next/specific item in the playlist
             *
             * @param  {number} playerid
             * @param  {*} to
             * @return {object}
             */
            GoTo: function(playerid, to){

                return({
                    method: "Player.GoTo",
                    params: {playerid: playerid, to: to}
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
                    method: "Player.Move",
                    params: {playerid: playerid, direction: direction}
                });
            },

            /**
             * Start playback of either the playlist with the given ID, a slideshow with the pictures from the given directory or a single file or an item from the database.
             *
             * @param  {*} item
             * @param  {object} options
             * @return {object}
             */
            Open: function(item, options){

                return({
                    method: "Player.Open",
                    params: {item: item, options: options }
                });
            },

            /**
             * Pauses or unpause playback and returns the new state
             *
             * @param  {number} playerid
             * @param  {string|boolean} [play=toggle]
             * @return {object}
             */
            PlayPause: function(playerid, play){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);
                this.play     = Kodi.util.isUndefined(play)  ? "toggle" : play;

                return({
                    method: "Player.PlayPause",
                    params: {playerid: this.playerid, play: this.play}
                });
            },

            /**
             * Rotates current picture
             *
             * @param  {number} playerid
             * @param  {string} [value=clockwise]
             * @return {object}
             */
            Rotate: function(playerid, value){
                this.value = Kodi.util.isString(value) ? value : "clockwise" ;

                return({
                    method: "Player.Rotate",
                    params: {playerid: playerid, value: this.value}
                });
            },

            /**
             * Seek through the playing item
             *
             * @param  {number} playerid
             * @param  {*} value
             * @return {object}
             */
            Seek: function(playerid, value){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);

                return({
                    method: "Player.Seek",
                    params: {playerid: this.playerid, value: value}
                });
            },

            /**
             * Set the audio stream played by the player
             *
             * @param  {number} playerid
             * @param  {*} stream
             * @return {object}
             */
            SetAudioStream: function(playerid, stream){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);

                return({
                    method: "Player.SetAudioStream",
                    params: {playerid: this.playerid, stream: stream}
                });
            },

            /**
             * Turn partymode on or off
             *
             * @param  {number} playerid
             * @param  {string|boolean} [partymode=toggle]
             * @return {object}
             */
            SetPartymode: function(playerid, partymode){
                this.playerid  = Kodi.util.isNumber(playerid)     ? playerid : parseInt(playerid);
                this.partymode = Kodi.util.isUndefined(partymode) ? "toggle" : partymode;

                return({
                    method: "Player.SetPartymode",
                    params: {playerid: this.playerid, partymode: this.partymode}
                });
            },

            /**
             * Set the repeat mode of the player
             *
             * @param  {number} playerid
             * @param  {*} repeat
             * @return {object}
             */
            SetRepeat: function(playerid, repeat){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);

                return({
                    method: "Player.SetRepeat",
                    params: {playerid: this.playerid, repeat: repeat}
                });
            },

            /**
             * Shuffle/Unshuffle items in the player
             *
             * @param  {number} playerid
             * @param  {string|boolean} [shuffle=toggle]
             * @return {object}
             */
            SetShuffle: function(playerid, shuffle){
                this.playerid = Kodi.util.isNumber(playerid)   ? playerid : parseInt(playerid);
                this.shuffle  = Kodi.util.isUndefined(shuffle) ? "toggle" : shuffle;

                return({
                    method: "Player.SetShuffle",
                    params: {playerid: this.playerid, shuffle: this.shuffle}
                });
            },

            /**
             * Set the speed of the current playback
             *
             * @param  {number} playerid
             * @param  {*} speed
             * @return {object}
             */
            SetSpeed: function(playerid, speed){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);

                return({
                    method: "Player.SetSpeed",
                    params: {playerid: this.playerid, speed: speed}
                });
            },

            /**
             * Set the subtitle displayed by the player
             *
             * @param  {number} playerid
             * @param  {*} subtitle
             * @param  {boolean} [enable=true]
             * @return {object}
             */
            SetSubtitle: function(playerid, subtitle, enable){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);
                this.enable   = Kodi.util.isBoolean(enable)  ? enable   : true;

                return({
                    method: "Player.SetSubtitle",
                    params: {playerid: this.playerid, subtitle: subtitle, enable: this.enable}
                });
            },

            /**
             * Stops playback
             *
             * @param  {number} playerid
             * @return {object}
             */
            Stop: function(playerid){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);

                return({
                    method: "Player.Stop",
                    params: {playerid: this.playerid}
                });
            },

            /**
             * Zoom current picture
             *
             * @param  {number} playerid
             * @param  {*} zoom
             * @return {object}
             */
            Zoom: function(playerid, zoom){
                this.playerid = Kodi.util.isNumber(playerid) ? playerid : parseInt(playerid);

                return({
                    method: "Player.Zoom",
                    params: {playerid: this.playerid, zoom: zoom}
                });
            }
        },

        /**
         * Methods Playlist
         *
         * @namespace
         */
        Playlist: {

            /**
             * Global types : Property
             *
             * @type {{Name: {enums: string[]}}}
             */
            Property: {

                /**
                 * @enum
                 */
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
                this.playlistid = Kodi.util.isNumber(playlistid) ? playlistid : parseInt(playlistid);

                return({
                    method: "Playlist.Add",
                    params: {playlistid: this.playlistid, item: item}
                });
            },

            /**
             * Clear playlist
             *
             * @param  {number} playlistid
             * @return {object}
             */
            Clear: function(playlistid){
                this.playlistid = Kodi.util.isNumber(playlistid) ? playlistid : parseInt(playlistid);

                return({
                    method: "Playlist.Clear",
                    params: {playlistid: this.playlistid}
                });
            },

            /**
             * Get all items from playlist
             *
             * @param  {number} playlistid
             * @param  {array}  [properties=~List.Fields.All[]] {@link Kodi.rpc.methods.List.Fields.All}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetItems: function(playlistid, properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.List.Fields.All.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "Playlist.GetItems",
                    params: {playlistid: playlistid, properties: this.properties, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Returns all existing playlists
             *
             * @return {object}
             */
            GetPlaylists: function(){

                return({method: "Playlist.GetPlaylists"});
            },

            /**
             * Retrieves the values of the given properties
             *
             * @param  {number} playlistid
             * @param  {array}  [properties=~Playlist.Property.Name[]] {@link Kodi.rpc.methods.Playlist.Property.Name}
             * @return {object}
             */
            GetProperties: function(playlistid, properties){
                this.playlistid = Kodi.util.isNumber(playlistid) ? playlistid : parseInt(playlistid);
                this.properties = Kodi.util.isArray(properties)  ? properties : Kodi.rpc.methods.Playlist.Property.Name.enums[0];

                return({
                    method: "Playlist.GetProperties",
                    params: {playlistid: this.playlistid, properties: this.properties}
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
                    method: "Playlist.Insert",
                    params: {playlistid: playlistid, position: position, item: item}
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
                    method: "Playlist.Remove",
                    params: {playlistid: playlistid, position: position}
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
                    method: "Playlist.Swap",
                    params: {playlistid: playlistid, position1: position1, position2: position2}
                });
            }
        },

        /**
         * Methods System [not yet implemented]
         *
         * @namespace
         */
        System: {

        },

        /**
         * Global types : Video
         *
         * @namespace
         */
        Video: {
            Fields: {
                /** @type object **/
                Movie: {
                    enums: ["title", "genre", "year", "rating", "director", "trailer", "tagline", "plot", "plotoutline", "originaltitle", "lastplayed", "playcount", "writer", "studio", "mpaa", "cast", "country", "imdbnumber", "runtime", "set", "showlink", "streamdetails", "top250", "votes", "fanart", "thumbnail", "file", "sorttitle", "resume", "setid", "dateadded", "tag", "art"]
                },
                /** @type object **/
                MovieSet: {
                    enums: ["title", "playcount", "fanart", "thumbnail", "art"]
                },
                /** @type object **/
                Episode: {
                    enums: ["title", "plot", "votes", "rating", "writer", "firstaired", "playcount", "runtime", "director", "productioncode", "season", "episode", "originaltitle", "showtitle", "cast", "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "tvshowid", "dateadded", "uniqueid", "art"]
                },
                /** @type object **/
                TVShow: {
                    enums: ["title", "genre", "year", "rating", "plot", "studio", "mpaa", "cast", "playcount", "episode", "imdbnumber", "premiered", "votes", "lastplayed", "fanart", "thumbnail", "file", "originaltitle", "sorttitle", "episodeguide", "season", "watchedepisodes", "dateadded", "tag", "art"]
                },
                /** @type object **/
                Season: {
                    enums: ["season", "showtitle", "playcount", "episode", "fanart", "thumbnail", "tvshowid", "watchedepisodes", "art"]
                },
                /** @type object **/
                MusicVideo: {
                    enums: ["title", "playcount", "runtime", "director", "studio", "year", "plot", "album", "artist", "genre", "track", "streamdetails", "lastplayed", "fanart", "thumbnail", "file", "resume", "dateadded", "tag", "art"]
                }
            }
        },

        /**
         * Methods VideoLibrary
         *
         * @namespace
         */
        VideoLibrary: {

            /**
             * Cleans the video library from non-existent items
             *
             * @return {object}
             */
            Clean: function(){

                return({
                    method: "VideoLibrary.Clean"
                });
            },

            /**
             * Retrieve details about a specific tv show episode
             *
             * @param  {number} episodeid
             * @param  {array} [properties=~Video.Fields.Episode[]] {@link Kodi.rpc.methods.Video.Fields.Episode}
             * @return {object}
             */
            GetEpisodeDetails: function(episodeid, properties){
                this.episodeid  = Kodi.util.isNumber(episodeid) ? episodeid  : parseInt(episodeid);
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Episode.enums;

                return({
                    method: "VideoLibrary.GetEpisodeDetails",
                    params: {episodeid: this.episodeid, properties: this.properties}
                });
            },

            /**
             * Retrieve all tv show episodes
             *
             * @param  {number} [tvshowid=-1]
             * @param  {number} [season=-1]
             * @param  {array}  [properties=~Video.Fields.Episode[]] {@link Kodi.rpc.methods.Video.Fields.Episode}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetEpisodes: function(tvshowid, season, properties, limits, sort){
                this.tvshowid   = Kodi.util.isNumber(tvshowid)  ? tvshowid   : -1;
                this.season     = Kodi.util.isNumber(season)    ? season     : 0;
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Episode.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetEpisodes",
                    params: {tvshowid: this.tvshowid, season: this.season, properties: this.properties, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Retrieve all genres
             *
             * @param  {string} type
             * @param  {array}  [properties=~Library.Fields.Genre[]] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetGenres: function(type, properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Library.Fields.Genre.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetGenres",
                    params: {type: this.type, properties: this.properties, limits: this.limits}
                });
            },

            /**
             * Retrieve details about a specific movie
             *
             * @param  {number} movieid
             * @param  {array}  [properties=~Video.Fields.Movie[]] {@link Kodi.rpc.methods.Video.Fields.Movie}
             * @return {object}
             */
            GetMovieDetails: function(movieid, properties){
                this.movieid    = Kodi.util.isNumber(movieid)   ? movieid    : parseInt(movieid);
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Movie.enums;

                return({
                    method: "VideoLibrary.GetMovieDetails",
                    params: {movieid: this.movieid, properties: this.properties}
                });
            },

            /**
             * Retrieve details about a specific movie set
             *
             * @param  {number} setid
             * @param  {array}  [properties=~Video.Fields.MovieSet[]] {@link Kodi.rpc.methods.Video.Fields.MovieSet}
             * @return {object}
             */
            GetMovieSetDetails: function(setid, properties){
                this.setid      = Kodi.util.isNumber(setid)     ? setid      : parseInt(setid);
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.MovieSet.enums;

                return({
                    method: "VideoLibrary.GetMovieSetDetails",
                    params: {setid: this.setid, properties: this.properties}
                });
            },

            /**
             * Retrieve all movie sets
             *
             * @param  {array}  [properties=~Video.Fields.MovieSet[]] {@link Kodi.rpc.methods.Video.Fields.MovieSet}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetMovieSets: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.MovieSet.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetMovieSets",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all movies
             *
             * @param  {array}  [properties=~Video.Fields.Movie[]] {@link Kodi.rpc.methods.Video.Fields.Movie}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetMovies: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Movie.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetMovies",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve details about a specific music video
             *
             * @param  {number} musicvideoid
             * @param  {array}  [properties=~Video.Fields.MusicVideo[]] {@link Kodi.rpc.methods.Video.Fields.MusicVideo}
             * @return {object}
             */
            GetMusicVideoDetails: function(musicvideoid, properties){
                this.musicvideoid = Kodi.util.isNumber(musicvideoid) ? musicvideoid : parseInt(musicvideoid);
                this.properties   = Kodi.util.isArray(properties)    ? properties   : Kodi.rpc.methods.Video.Fields.MusicVideo.enums;

                return({
                    method: "VideoLibrary.GetMusicVideoDetails",
                    params: {musicvideoid: this.musicvideoid, properties: this.properties}
                });
            },

            /**
             * Retrieve all music videos
             *
             * @param  {array}  [properties=~Video.Fields.MusicVideo[]] {@link Kodi.rpc.methods.Video.Fields.MusicVideo}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetMusicVideos: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.MusicVideo.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetMusicVideos",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all recently added tv episodes
             *
             * @param  {array}  [properties=~Video.Fields.Episode[]] {@link Kodi.rpc.methods.Video.Fields.Episode}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetRecentlyAddedEpisodes: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Episode.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetRecentlyAddedEpisodes",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all recently added movies
             *
             * @param  {array}  [properties=~Video.Fields.Movie[]] {@link Kodi.rpc.methods.Video.Fields.Movie}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetRecentlyAddedMovies: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Movie.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetRecentlyAddedMovies",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all recently added music videos
             *
             * @param  {array}  [properties=~Video.Fields.MusicVideo[]] {@link Kodi.rpc.methods.Video.Fields.MusicVideo}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetRecentlyAddedMusicVideos: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.MusicVideo.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetRecentlyAddedMusicVideos",
                    params: {properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve all tv seasons
             *
             * @param  {number} tvshowid
             * @param  {array}  [properties=~Video.Fields.Season[]] {@link Kodi.rpc.methods.Video.Fields.Season}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetSeasons: function(tvshowid, properties, limits, sort){
                this.tvshowid   = Kodi.util.isNumber(tvshowid)  ? tvshowid   : parseInt(tvshowid);
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.Season.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetSeasons",
                    params: {tvshowid: this.tvshowid, properties: this.properties, sort: this.sort, limits: this.limits}
                });
            },

            /**
             * Retrieve details about a specific tv show
             *
             * @param  {number} tvshowid
             * @param  {array}  [properties=~Video.Fields.TVShow[]] {@link Kodi.rpc.methods.Video.Fields.TVShow}
             * @return {object}
             */
            GetTVShowDetails: function(tvshowid, properties){
                this.tvshowid   = Kodi.util.isNumber(tvshowid)  ? tvshowid   : parseInt(tvshowid);
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.TVShow.enums;

                return({
                    method: "VideoLibrary.GetTVShowDetails",
                    params: {tvshowid: this.tvshowid, properties: this.properties}
                });
            },

            /**
             * Retrieve all tv shows
             *
             * @param  {array}  [properties=~Video.Fields.TVShow[]] {@link Kodi.rpc.methods.Video.Fields.TVShow}
             * @param  {object} [limits=~List.Limits] {@link Kodi.rpc.methods.List.Limits}
             * @param  {object} [sort=~List.Sort] {@link Kodi.rpc.methods.List.Sort}
             * @return {object}
             */
            GetTVShows: function(properties, limits, sort){
                this.properties = Kodi.util.isArray(properties) ? properties : Kodi.rpc.methods.Video.Fields.TVShow.enums;
                this.limits     = Kodi.util.isObject(limits)    ? limits     : Kodi.rpc.methods.List.Limits;
                this.sort       = Kodi.util.isObject(sort)      ? sort       : Kodi.rpc.methods.List.Sort;

                return({
                    method: "VideoLibrary.GetTVShows",
                    params: {properties: this.properties, limits: this.limits, sort: this.sort}
                });
            },

            /**
             * Scans the video sources for new library items
             *
             * @param  {string} [directory=""]
             * @return {object}
             */
            Scan: function(directory){
                this.directory = Kodi.util.isString(directory) ? directory : "";

                return({
                    method: "VideoLibrary.Scan",
                    params: {directory: this.directory}
                });
            }
        },

        /**
         * Methods XBMC [not yet implemented]
         *
         * @namespace
         */
        XBMC: {

        }
    };

})(window, (window.Kodi || {}));