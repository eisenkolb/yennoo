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
     * Adds item to the playlist
     *
     * @todo implement functionality
     * @type {Kodi.util.noop|function}
     */
    var queueItem = Kodi.util.noop;

    /**
     * Start playback of a certain item
     *
     * @param {object|CreateItem} item
     */
    var startItem = function(item)
    {
        /**
         * Clear the current playlist and add the new item
         */
        if (Kodi.util.isDefined((item[TYPE.ALBUM] || item[TYPE.MOVIE] || item[TYPE.SONG])) === true){
            MovieFactory.BuildRequest(Kodi.util.noop, Kodi.rpc.methods.Playlist.Clear(0));
            MovieFactory.BuildRequest(function(){

                /**
                 * Assign the created playlist id for playback
                 *
                 * @type {{playlistid: number}}
                 */

                MovieFactory.BuildRequest(function(data){
                    console.info(data);
                }, Kodi.rpc.methods.Player.Open({playlistid: 0}, {}));
            }, Kodi.rpc.methods.Playlist.Add(0, item));

            return(true);
        }

        MovieFactory.BuildRequest(function(data){
            console.info(data);
        }, Kodi.rpc.methods.Player.Open(item, {}));
    };

    /**
     * Prepare the playback item of entry
     *
     * @param  {string} type
     * @param  {object} item
     */
    var openEntry = function(type, item)
    {
        return(startItem(new CreateItem(type, item)));
    };

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