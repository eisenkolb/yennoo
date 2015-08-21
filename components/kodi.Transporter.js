/*
 * Yennoo : Web Interface for XBMC/Kodi
 * Copyright 2015, Ronny Eisenkolb (@eisenkolb)
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
angular.module("Kodi.Transporter", []).provider("Transporter", function(APIserviceProvider){
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

    var transporters = {};

    self.Get = function(name)
    {
        if (Kodi.util.isType(name, "string") === true && self.Has(name) === true){
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
        return(Yennoo.setting.method || null);
    };
    self.Initialize = function()
    {
        var method = self.GetName();
        if (method && self.Has(method)){
            self.current = this.Get(method);
            Yennoo.setting.method = method;

            if (self.current && Kodi.util.isFunction(self.current.Initialize)){
                self.current.Initialize.apply(self, [null]);
            }
        } else {
            console.log("Transporter::Initialize() -> Transport %h not exists, reinitialize...", method);
            Yennoo.setting.method = ("WebSocket" in window) ? "WebSocket" : "HTTP";
            return(self.Initialize());
        }

        console.log("Transporter::Initialize() -> new Transport: %h", method);

        return(self.current && method === Yennoo.setting.method ? true : false);
    };
    self.Has = function(name)
    {
        return(name && self.Availables().indexOf(name) !== -1);
    };
    self.GetPort = function()
    {
        if (Yennoo.setting.transport && Yennoo.setting.transport[self.GetName()]
        && (Yennoo.setting.transport[self.GetName()].port)){
            return(Yennoo.setting.transport[self.GetName()].port)
        }

        return(self.Current().defaults.port)
    };
    self.Availables = function()
    {
        return(Object.keys(transporters) || []);
    };

    self.Register = function(name, transporter)
    {
        transporters[name] = transporter;

        return(this);
    };

    return(self);
});