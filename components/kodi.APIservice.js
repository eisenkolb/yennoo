/*
 * Yennoo : Web Interface for XBMC/Kodi
 * Copyright 2015, Ronny Eisenkolb (@eisenkolb)
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
angular.module("Kodi.APIservice", []).provider("APIservice", function(){
    var instance = this;
    instance.$get = ["$injector", "Transporter", function($injector, Transporter){return({
        Send: function(command, callback)
        {
            for (var callbacks in {success: 1, error: 1, then: 1, beforeSend: 1, errorForm: 1, successForm: 1})
            {
                if (callback[callbacks] && Kodi.util.isType(callback[callbacks], "function") === true){
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
            var hostname    = Yennoo.setting.transport
                           && Yennoo.setting.transport[transporter]
                           && Yennoo.setting.transport[transporter].host
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
            return(Yennoo.setting.transport && Yennoo.setting.transport.HTTP && Yennoo.setting.transport.HTTP.port
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
    })}];

    instance.SetHttpPort = function(port)
    {
        instance.httpPort = port;

        return(this);
    };

    instance.SetTransport = function(transporter)
    {
        if (transporter && Kodi.util.isType(transporter, "object") === true){
            instance.transporter = transporter;
        }

        console.log("APIservice::SetTransport([%h : %o])", Yennoo.setting.method | null, transporter);

        return(this);
    };
});