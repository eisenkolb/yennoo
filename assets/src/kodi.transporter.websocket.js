/**!
 * @fileOverview XBMC/Kodi WebSocket transporter
 *
 * @author  [Ronny Eisenkolb]{@link https://github.com/eisenkolb}
 * @version 0.7.8
 * @license Yennoo : Web Interface for XBMC/Kodi<br>
 *          Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)<br>
 *          License: [MIT License]{@link http://www.opensource.org/licenses/MIT}
 */
(function(window, Yennoo){
    "use strict";

    Yennoo.transporter.register("WebSocket", {
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
            var socket = self.socket = self.socket && Kodi.util.isType(self.socket.readyState, "number")
                       ? self.socket
                       : new WebSocket("ws://"+ APIservice.GetSocket() +"/jsonrpc");

            console.log("Transporter::%s::Connection(%o)", Yennoo.setting.method, {url: socket.url, state: socket.readyState, socket: socket});

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
                    console.log("Transporter::%s::Send(%o)", Yennoo.setting.method, {url: socket.url, state: socket.readyState, id: command.request.id, command: command});
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
                console.log("Transporter::%s::onError(%o)", Yennoo.setting.method, {url: socket.url, state: socket.readyState, error: error, socket: socket});
                callback.error.call(this, [error]);
            };
            socket.onclose = function(error)
            {
                console.log("Transporter::%s::onClose(%o)", Yennoo.setting.method, {url: socket.url, state: socket.readyState, error: error, socket: socket});
                callback.then.call(self, arguments);

                var eventData = {};
                if (error && error.code && error.code <= 1006){
                    eventData.errors  = ["Error: The endpoint has terminated the connection"];
                    eventData.tabName = "prefs-transporter";
                }

                APIservice.DispatchEvent("overlay:settings:open", eventData);
            };

            socket.onmessage = function (event)
            {
                console.log("Transporter::%s::onMessage(%o)", Yennoo.setting.method, {url: socket.url, state: socket.readyState, data: JSON.parse(event.data), socket: socket});

                if (event && Kodi.util.isType(event, "object") === true && event.data){
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
            if (data === null || Kodi.util.isType(data, "object") === false){
                return(false);
            }
            if (data.error && Kodi.util.isType(data.error, "object") === true){
                return(Kodi.util.communicationError(data));
            }
            if (Kodi.util.isType(data.params, "object") === true && data.params.sender === "xbmc"){
                return(Kodi.util.communicationMessage(data));
            }
        }
    });

})(window, Yennoo);