/*
 * Yennoo : Web Interface for XBMC/Kodi
 * Copyright 2015, Ronny Eisenkolb (@eisenkolb)
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
angular.module("Kodi.Playback", []).service("PlaybackService", function($http, MovieFactory){

    /**
     * Enum for playback types
     *
     * @enum {string}
     */
    var TYPE = {
        ALBUM  : "albumid",
        MOVIE  : "movieid",
        SONG   : "songid",
        FILE   : "file",
        FOLDER : "directory"
    };

    /**
     * Creates an item for the Kodi playlist
     *
     * @struct
     * @constructor
     * @param {string} type
     * @param {object|string} item
     */
    var CreateItem = function(type, item){
        this[type] = item[type] || item;
    };

    /**
     * Fetch the playlist id and returns the id by the given item type
     *
     * @param {object} item
     * @param {function(number, object): void} callback
     */
    var fetchMatchingPlaybackId = function(item, callback){

        /**
         * Fetch all playlist entries
         */

        MovieFactory.BuildRequest(function(playlists){
            var playlist = 0;
            var itemType = (item[TYPE.ALBUM] || item[TYPE.SONG]) ? "audio" : item[TYPE.MOVIE] ? "video" : "picture";

            /**
             * Get playlist id by the given item type
             */

            for(var index = 0; index < (playlists || []).length; index++){
                if (playlists[index].type === itemType){
                    playlist = playlists[index].playlistid;
                    break;
                }
            }

            if (callback && Kodi.util.isFunction(callback) === true){
                callback.apply(null, [playlist, item]);
            }

        }, Kodi.rpc.methods.Playlist.GetPlaylists());

    };

    /**
     * Adds item to the playlist
     *
     * @param {object|CreateItem} item
     */
    var queueItem = function(item){

        /**
         * Get playlist id by the given item type
         */

        fetchMatchingPlaybackId(item, function(playlist){

            /**
             * Add item to the specific playlist type
             */

            MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.Playlist.Add(playlist, item));
        });
    };

    /**
     * Start playback of a certain item
     *
     * @param {object|CreateItem} item
     * @param {boolean} [resume=false]
     */
    var startItem = function(item, resume)
    {
        if (Kodi.util.isDefined((item[TYPE.ALBUM] || item[TYPE.SONG])) === true){
            fetchMatchingPlaybackId(item, function(playlist){

                /**
                 * Clear the current playlist and add the new item
                 */

                MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.Playlist.Clear(playlist));
                MovieFactory.BuildRequest(function(){

                    /**
                     * Assign the created playlist id and open it
                     *
                     * @type {{playlistid: number}}
                     */

                   MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.Player.Open({playlistid: playlist}));
                }, Kodi.rpc.methods.Playlist.Add(playlist, item));
            });

            return(true);
        }

        MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.Player.Open(item, {resume: !!resume}));
    };

    /**
     * Prepare playback of entry
     *
     * @param {string} type
     * @param {object} item
     * @param {boolean} [queue=false]
     * @param {boolean} [resume=false]
     */
    var openEntry = function(type, item, queue, resume)
    {
        item = new CreateItem(type, item);

        /**
         * Put the item to the playlist queue
         */
        if (Kodi.util.isBoolean(queue) === true && queue === true){
            return(queueItem(item));
        }

        /**
         * Start the given item
         */
        startItem(item, resume);
    };

    /**
     * Public PlaybackService API
     * --------------------------
     */

    /**
     * Open a certain album
     *
     * @param {object} album
     */
    this.openAlbum = function(album)
    {
        openEntry(TYPE.ALBUM, album);
    };

    /**
     * Open a certain movie entry
     *
     * @param {object} movie
     */
    this.openMovie = function(movie)
    {
        openEntry(TYPE.MOVIE, movie);
    };

    /**
     * Open a certain song entry
     *
     * @param {object} song
     */
    this.openSong = function(song)
    {
        openEntry(TYPE.SONG, song);
    };

    /**
     * Open a single file
     *
     * @param {string} file
     */
    this.openFile = function(file)
    {
        openEntry(TYPE.FILE, file);
    };

    /**
     * Open a specific folder
     *
     * @param {string} folder
     */
    this.openFolder = function(folder)
    {
        openEntry(TYPE.FOLDER, folder);
    };

    /**
     * Adds a certain movie into the queue
     *
     * @param {object} movie
     */
    this.queueMovie = function(movie)
    {
        openEntry(TYPE.MOVIE, movie, true);
    };

    /**
     * Adds a certain album into the queue
     *
     * @param {object} album
     */
    this.queueAlbum = function(album)
    {
        openEntry(TYPE.ALBUM, album, true);
    };

    /**
     * Resuming of a certain movie
     *
     * @param {object} movie
     */
    this.resumeMovie = function(movie)
    {
        openEntry(TYPE.MOVIE, movie, false, true);
    };

    /**
     * Open/Download a specific file
     *
     * @todo better implementation
     * @param {string} file
     */
    this.downloadFile = function(file)
    {
        var origin = "//" +location.host + "/jsonrpc";
        var method = angular.extend({
                jsonrpc: "2.0",
                id     : Date.now()
            }
            , Kodi.rpc.methods.Files.PrepareDownload(file)
        );

        $http.post(origin ,method, {headers: {
            "Accept"      : "application/json",
            "Content-Type": "application/json"
        }}).then(function(response){
            if (window.open && Kodi.util.isDefined(response.data.result) === true){
                window.open(response.data.result.details.path);
            }
        });
    };
});