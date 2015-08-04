/*
 * Yennoo : Web Interface for XBMC/Kodi
 * Copyright 2015, Ronny Eisenkolb (@eisenkolb)
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
angular.module("Kodi.Locale", ["pascalprecht.translate"]).provider("Locale", function($translateProvider){
    this.$get = ["$translate", function($translate){
        this.GetService = function GetService(){
            return($translate);
        };

        return(this);
    }];

    $translateProvider.useSanitizeValueStrategy("escaped");

    /**
     * Register a loader for the static files
     *
     * Configure: staticFilesLoader
     */
    $translateProvider.useStaticFilesLoader({
        prefix: "resources/i18n/",
        suffix: ".json"
    });

    /**
     * Register fallback keys if none of the other language are available
     */
    $translateProvider.fallbackLanguage(["en_US", "de_DE"]);

    /**
     * Build and register the language negotiation
     */
    this.languageKeys  = {};
    this.languageNames = {};
    var availablesLang = Yennoo.languages || Yennoo.config.languages;
    for(var name in availablesLang || []){
        var language = availablesLang[name];
        if (language.name === null || !language.keys || !language.keys.length){
            continue;
        }

        /**
         * Build the language negotiation
         */
        this.languageNames[name] = language.name;
        for (var lang in language.keys){
            this.languageKeys[language.keys[lang]] = name;
        }
    }

    this.GetLanguageName = function(key){
        if (key === null){
            return(this.languageNames);
        }
    };

    this.GetLanguageKey = function(language)
    {
        var lang = Object.keys(this.languageKeys);
        var name = lang.indexOf((language || navigator.browserLanguage || navigator.language));
        if (name === -1 || Kodi.util.isType(lang[name], "undefined") === true){
            return(language);
        }

        return(this.languageKeys[lang[name]]);
    };

    this.SetLanguage = function(language)
    {
        this.language = this.GetLanguageKey(language);
        $translateProvider.use(this.GetLanguageKey(language));

        return(this);
    };

    this.GetLanguage = function()
    {
        return(this.language);
    };

    return(this);
});