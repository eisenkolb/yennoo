/**!
 * @fileOverview XBMC/Kodi HTTP transporter
 *
 * @author  [Ronny Eisenkolb]{@link https://github.com/eisenkolb}
 * @version 0.7.8
 * @license Yennoo : Web Interface for XBMC/Kodi<br>
 *          Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)<br>
 *          License: [MIT License]{@link http://www.opensource.org/licenses/MIT}
 */
(function(window, Yennoo){
    "use strict";

    Yennoo.transporter.register("HTTP", {
        defaults:
        {
            port: document.location.port || 8080,
            host: document.location.hostname
        },
        Send: function(command, callback, APIservice)
        {

        }
    });

})(window, Yennoo);