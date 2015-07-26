/**!
 * uneXBMC.util.js | XBMC Utility module
 */
(function(window){
    "use strict";

    window.uneXBMC.util = {

        isType: function(input, type)
        {
            return(typeof input === type);
        },

        Timer: function(start)
        {
            this.stats = {begin: null, end: null};
            this.start = function()
            {
                this.stats.begin = Date.now();

                return(this);
            };
            this.stop = function()
            {
                this.stats.end = Date.now();

                return(this);
            };
            this.elapsed = function()
            {
                if (this.stats.end === null){
                    this.stop();
                }

                return(new Date(this.stats.end - this.stats.begin));
            };

            if (start && start === true){
                this.start();
            }

            return(this);
        },

        notify: {
            stack: {},
            style: {offset: {bottom: 10, begin: 87}},
            types: {SUCCESS: "success", INFO: "info", WARNING: "warning", ERROR: "error"},
            template: function(template)
            {
                template = uneXBMC.util.isType(template, "undefined")
                         ? document.getElementById("notifyTemplate").innerHTML
                         : template;
                template = angular.element(template);

                return(template);
            },
            notify: function(options, self)
            {
                self = this;
                self.id = "notify-" + Date.now();
                self.element = window.uneXBMC.util.notify.template(options.template);
                self.element[0].id = self.id;
                self.title = function(title){
                    self.element.find(".title").html(function()
                    {
                        if (title === null){
                            self.element.find(".title").hide();
                        }

                        return(title);
                    });

                    return(self);
                };
                self.body = function(body)
                {
                    self.element.find(".body").html(body);

                    return(self);
                };
                self.click = function()
                {
                    self.destroy();

                    return(self);
                };
                self.show = function()
                {
                    self.element.fadeIn(400);

                    window.uneXBMC.util.notify.stack[self.id] = self;

                    if (typeof options.time === "number"){
                        setTimeout(function(){
                            self.destroy();
                        }, parseInt(options.time));
                    }

                    return(self);
                };
                self.destroy = function(duration)
                {
                    var seconds = typeof duration === "undefined" ? 1000 : duration;
                    var destroy = function(){
                        delete(window.uneXBMC.util.notify.stack[self.id]);
                        self.element.remove();
                    };

                    self.element.animate({
                        opacity: 0,
                        top: "-=100px"
                    }, seconds, destroy);

                    /** reposition only the larger items **/
                    for(var index in window.uneXBMC.util.notify.stack){
                        var offset = window.uneXBMC.util.notify.stack[index].element[0].offsetTop - self.element[0].offsetHeight;
                        if (offset > window.uneXBMC.util.notify.style.offset.begin && window.uneXBMC.util.notify.stack[index].element[0].offsetTop > self.element[0].offsetTop) {
                            window.uneXBMC.util.notify.stack[index].element.animate({
                                top: "-=" + (self.element[0].offsetHeight + window.uneXBMC.util.notify.style.offset.bottom) + "px"
                            }, seconds + 200);
                        }
                    }

                    return(self);
                };
                self.apply = function(target)
                {
                    this.offset = window.uneXBMC.util.notify.style.offset.begin;
                    for ( var index in window.uneXBMC.util.notify.stack){
                        this.offset += window.uneXBMC.util.notify.stack[index].element[0].offsetHeight;
                        this.offset += window.uneXBMC.util.notify.style.offset.bottom;
                    }

                    self.element.click(self.click)
                        .offset({top: this.offset})
                        .addClass(options.type || "default")
                        .appendTo(typeof target === "undefined" ? "body" : target);

                    return(self);
                };

                return(self);
            },

            new: function(options)
            {
                this.alert = new this.notify(options);
                this.alert.title(options.head || null)
                    .body(options.body || null)
                    .apply();

                return(this.alert);
            },
            clear: function(duration)
            {
                for (var index in window.uneXBMC.util.notify.stack){
                    window.uneXBMC.util.notify.stack[index].destroy(duration);
                    if (duration === "reset"){
                        window.uneXBMC.util.notify.stack[index].element.remove();
                        delete(window.uneXBMC.util.notify.stack[window.uneXBMC.util.notify.stack[index].id]);
                    }
                }

                return(this);
            },
            reset: function()
            {
                return(this.clear("reset"));
            }
        },

        communicationError: function(data)
        {
            var body = data.error.message;
            var head = null;
            var time = 3000;

            if (data.error && data.error.data && data.error.data.stack){
                head = data.error.data.method+ ": " +body;
                body = data.error.data.stack.message+ " on "+ data.error.data.stack.name;

                if (JSON && uneXBMC.util.isType(JSON.stringify,"function") === true){
                    body += "<br>Stack:<br><span style=\"white-space:pre;\">" +JSON.stringify(data.error.data.stack, "\n", 2)+ "</span>";
                    time = null;
                }
            }

            return(uneXBMC.util.notify["new"]({
                type: uneXBMC.util.notify.types.ERROR,
                time: time,
                head: head,
                body: body
            }).show());
        },

        communicationMessage: function(data)
        {
            var head = data.params.sender.toUpperCase();
            if (data.params && data.params.data && data.params.data.item){
                head = data.params.sender.toUpperCase()+ " : ("+  data.params.data.item.type +" = "+ data.params.data.item.id +")";
            }

            uneXBMC.util.notify["new"]({
                head: head,
                time: 6000,
                body: data.method
            }).show();
        },

        noop: function(){}
    };

    window.uneXBMC = uneXBMC;

}(window));