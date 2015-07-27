uneXBMC.register.controller("config.PrefsCtrl"
, ["$scope", "$translate", "Locale", "Transporter"
, function($scope, $translate, Locale, Transporter){

    /**
     * Default Setting - Language
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
     * Transporter setting
     */

    $scope.$on("modal:transporter:open", function(event, data){
        if (data) {
            $scope.messages = data || [];
            $scope.$apply();
        }

        $scope.openModalTransporter()
    });

    $scope.$on("modal:transporter:close", function(event, data){
        $scope.hideModalTransporter()
    });

    $scope.openModalTransporter = function(extend)
    {
        if (extend && extend === true){
            $scope.extendModalTransporter({target: angular.element("#extendModalTransporter")[0]});
        }
        angular.element("#modal-main").foundation("reveal", "open");
    };
    $scope.hideModalTransporter = function()
    {
        angular.element("#modal-main").foundation("reveal", "close");
    };

    /**
     * Fetch the transporter infos
     */

    $scope.extendModalTransporter = function(event)
    {
        angular.element("#main-transporter").show();
        event.target.style.display = "none";
        event.target.parentNode.style.display = "none";
    };

    $scope.saveTransporter = function(event)
    {
        this.setting = angular.extend(uneXBMC.setting, $scope.changed);
        uneXBMC.cookie.save(JSON.stringify(this.setting), function(){
            document.location.reload();
        });

        event.preventDefault();
    };

    $scope.openTransporter = function(event)
    {
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

    setInterval(function(){
        $scope.settings = uneXBMC.setting;
        $scope.$apply();
    }, 200);
}]);