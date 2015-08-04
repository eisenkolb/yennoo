/**!
 * @fileOverview XBMC/Kodi Utility module
 *
 * @author  [Ronny Eisenkolb]{@link https://github.com/eisenkolb}
 * @version 0.7.8
 * @license Yennoo : Web Interface for XBMC/Kodi<br>
 *          Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)<br>
 *          License: [MIT License]{@link http://www.opensource.org/licenses/MIT}
 */
(function(window, Kodi, undefined){
    "use strict";

    /** @const **/ var OBJECT_TYPE    = "object";
    /** @const **/ var STRING_TYPE    = "string";
    /** @const **/ var UNDEFINED_TYPE = "undefined";
    /** @const **/ var FUNCTION_TYPE  = "function";
    /** @const **/ var BOOLEAN_TYPE   = "boolean";
    /** @const **/ var OBJECT_CLASS   = "[object Object]";
    /** @const **/ var ARRAY_CLASS    = "[object Array]";

    /**
     * @namespace
     * @extends {Kodi}
     */
    Kodi.util = {

        /**
         * Checks if the `input` an given `type`
         *
         * @param  {*} input - Reference to check
         * @param  {string} type - Custom type to compare the `input` value
         * @return {boolean}
         */
        isType: function(input, type)
        {
            return(typeof input === type);
        },

        /**
         * Checks if a reference is an `Object`
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isObject: function(input)
        {
            return(this.isType(input, OBJECT_TYPE) && Object.toString && Object.prototype.toString.call(input) === OBJECT_CLASS);
        },

        /**
         * Checks if a reference is an `Array`
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isArray: function(input)
        {
            return(Array.isArray && Array.isArray(input) || Object.toString && Object.prototype.toString.call(input) === ARRAY_CLASS);
        },

        /**
         * Checks if a reference is an `Boolean`
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isBoolean: function(input)
        {
            return(this.isType(input, BOOLEAN_TYPE) === true);
        },

        /**
         * Checks if a reference is a `Number`
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isNumber: function(input)
        {
            return(this.isType(input, UNDEFINED_TYPE) || input == "" ? false : input && !!Number(input || null));
        },

        /**
         * Checks if a reference is a `String`
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isString: function(input)
        {
            return(this.isType(input, STRING_TYPE) === true);
        },

        /**
         * Checks if a reference is a `Function`
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isFunction: function(input)
        {
            return(this.isType(input, FUNCTION_TYPE) === true);
        },

        /**
         * Checks if a reference is undefined
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isUndefined: function(input)
        {
            return(this.isType(input, UNDEFINED_TYPE) === true && input +"" !== UNDEFINED_TYPE || input == null);
        },

        /**
         * Checks if a reference is defined
         *
         * @param  {*} input - Reference to check
         * @return {boolean}
         */
        isDefined: function(input)
        {
            return(this.isType(input, UNDEFINED_TYPE) === false);
        },

        /**
         * @struct
         * @constructor
         * @param  {?boolean} start - Start the timer on construction
         * @return {Kodi.util.Timer}
         */
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

        /**
         * Notification method
         *
         * @type object
         */
        notify: {
            stack: {},
            style: {offset: {bottom: 10, begin: 87}},
            types: {SUCCESS: "success", INFO: "info", WARNING: "warning", ERROR: "error"},
            template: function(template)
            {
                template = Kodi.util.isUndefined(template)
                         ? document.getElementById("notifyTemplate").innerHTML
                         : template;
                template = angular.element(template);

                return(template);
            },
            notify: function(options, self)
            {
                self = this;
                self.id = "notify-" + Date.now();
                self.element = Kodi.util.notify.template(options.template);
                self.element[0].id = self.id;
                self.title = function(title){
                    self.element.find(".title").html(function()
                    {
                        if (Kodi.util.isUndefined(title)){
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

                    Kodi.util.notify.stack[self.id] = self;

                    if (Kodi.util.isNumber(options.time)){
                        setTimeout(function(){
                            self.destroy();
                        }, parseInt(options.time));
                    }

                    return(self);
                };
                self.destroy = function(duration)
                {
                    var seconds = Kodi.util.isUndefined(duration) ? 1000 : duration;
                    var destroy = function(){
                        delete(Kodi.util.notify.stack[self.id]);
                        self.element.remove();
                    };

                    self.element.animate({
                        opacity: 0,
                        top: "-=100px"
                    }, seconds, destroy);

                    /** reposition only the larger items **/
                    for(var index in Kodi.util.notify.stack){
                        var offset = Kodi.util.notify.stack[index].element[0].offsetTop - self.element[0].offsetHeight;
                        if (offset > Kodi.util.notify.style.offset.begin && Kodi.util.notify.stack[index].element[0].offsetTop > self.element[0].offsetTop) {
                            Kodi.util.notify.stack[index].element.animate({
                                top: "-=" + (self.element[0].offsetHeight + Kodi.util.notify.style.offset.bottom) + "px"
                            }, seconds + 200);
                        }
                    }

                    return(self);
                };
                self.apply = function(target)
                {
                    this.offset = Kodi.util.notify.style.offset.begin;
                    for (var index in Kodi.util.notify.stack){
                        this.offset += Kodi.util.notify.stack[index].element[0].offsetHeight;
                        this.offset += Kodi.util.notify.style.offset.bottom;
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
                for (var index in Kodi.util.notify.stack){
                    Kodi.util.notify.stack[index].destroy(duration);
                    if (duration === "reset"){
                        Kodi.util.notify.stack[index].element.remove();
                        delete(Kodi.util.notify.stack[Kodi.util.notify.stack[index].id]);
                    }
                }

                return(this);
            },
            reset: function()
            {
                return(this.clear("reset"));
            }
        },

        /**
         * Display communication error as a notification
         *
         * @param  {object} data - That contain the XBMC response object
         * @return {Kodi.util.notify}
         */
        communicationError: function(data)
        {
            var body = data.error.message;
            var head = null;
            var time = 3000;

            if (data.error && data.error.data && data.error.data.stack){
                head = data.error.data.method+ ": " +body;
                body = data.error.data.stack.message+ " on "+ data.error.data.stack.name;

                if (JSON && Kodi.util.isType(JSON.stringify,"function") === true){
                    body += "<br>Stack:<br><span style=\"white-space:pre;\">" +JSON.stringify(data.error.data.stack, "\n", 2)+ "</span>";
                    time = null;
                }
            }

            return(Kodi.util.notify["new"]({
                type: Kodi.util.notify.types.ERROR,
                time: time,
                head: head,
                body: body
            }).show());
        },

        /**
         * Display communication message as a notification
         *
         * @param  {object} data - That contain the XBMC response object
         * @return {Kodi.util.notify}
         */
        communicationMessage: function(data)
        {
            var head = data.params.sender.toUpperCase();
            if (data.params && data.params.data && data.params.data.item){
                head = data.params.sender.toUpperCase()+ " : ("+  data.params.data.item.type +" = "+ data.params.data.item.id +")";
            }

            Kodi.util.notify["new"]({
                head: head,
                time: 6000,
                body: data.method
            }).show();
        },

        /**
         * Method that performs no operations
         */
        noop: function(){}
    };

    window.Kodi = Kodi;

})(window, (window.Kodi || {}));