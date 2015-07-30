uneXBMC.register.controller("config.PrefsCtrl"
, ["$scope", "$translate", "Locale", "Transporter"
, function($scope, $translate, Locale, Transporter){
    $scope.openTabName = null;
    $scope.application = uneXBMC.application;

    /**
     * Section: Language
     */

    $scope.languageUsed  = Locale.GetLanguage();
    $scope.languageNames = Locale.languageNames;
    $scope.displayNotify = function(message){
        uneXBMC.util.notify.new({
            type: uneXBMC.util.notify.types.INFO,
            time: 3000,
            body: message
        }).show();
    };

    $scope.$watch("languageUsed", function(language)
    {
        if (Locale.GetLanguage() !== language && language){
            Locale.GetService().use(language).then(function(){
                uneXBMC.setting.language = Locale.language = language;
                uneXBMC.cookie.save(JSON.stringify(uneXBMC.setting));

                $translate("SETTING.LANGUAGE_CHANGED", {language: $scope.languageNames[language]+ " ("+ language+ ")"}).then(function(translation){
                    $scope.displayNotify(translation);
                });

            }, function(){
                $translate("GLOBAL.SAVING_ERROR").then(function(translation){
                    $scope.displayNotify(translation);
                });
            });
        }
    });

    /**
     * Section: Settings overlay
     */

    $scope.overlaySettingsOpen = function(extend)
    {
        if (extend && extend === true){
            $scope.transporterSettingsExtend();
        }

        angular.element("#main").addClass("show-settings").find("#drop-settings").fadeIn(500);
    };

    $scope.overlaySettingsClose = function()
    {
        angular.element("#main").removeClass("show-settings").find("#drop-settings").fadeOut(200);
    };

    $scope.$on("overlay:settings:open", function(event, data){
        if (data) {
            $scope.messages = data || [];
            $scope.$apply();
        }

        $scope.openTabName = data && data.tabName || null;
        $scope.overlaySettingsOpen()
    });

    $scope.$on("overlay:settings:close", function(event, data){
        $scope.overlaySettingsClose()
    });

    $scope.$on("overlay:settings:toggle", function(){
        if (angular.element("#drop-settings").is(":visible")) {
            return($scope.overlaySettingsClose());
        }

        $scope.overlaySettingsOpen();

    });

    /**
     * Section: Transporter
     *
     * Fetch the transporter infos
     */

    $scope.transporterSettingsExtend = function(event)
    {
        angular.element("#main-transporter").show();
        angular.element("#modal-head-transporter").hide();
        angular.element("#button-save-transporter").show();

        if (event && event.preventDefault){
            event.preventDefault();
        }
    };

    $scope.saveTransporter = function(event)
    {
        this.setting = angular.extend(uneXBMC.setting, $scope.changed);
        uneXBMC.cookie.save(JSON.stringify(this.setting), function(){
            document.location.reload();
        });

        event.preventDefault();
    };

    $scope.formChangeTransporter = function(transporter, event)
    {
        $scope.changed.method = event.target.checked ? transporter : null;
    };

    $scope.changed  = {
        method    : Transporter.GetName(),
        transport : {}
    };

    $scope.transporters = {
        current : {
            method: Transporter.GetName()
        },
        available: {}
    };

    var available = Transporter.Availables();
    for(var index = 0; index < available.length; index++){
        var name  = available[index];
        $scope.transporters.available[name] = Transporter.Transporter(name).defaults;
        $scope.changed.transport[name] = uneXBMC.setting.transport && uneXBMC.setting.transport[name] || {};
    }
}]);