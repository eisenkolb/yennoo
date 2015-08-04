angular.module("Kodi.Directive", []).directive("subheader", ["Navigation", "$location", "$filter", "$compile", function(Navigation, $location, $filter, $compile){return{
    restrict: "A",
    controller: function($scope, $compile){
        $scope.$compile = $compile;
        $scope.$watchCollection("represent", function(represent)
        {
            if (represent === undefined || represent === null){
                return(false);
            }

            for(var origin in represent){
                if (Yennoo.setting.represent[origin] === undefined){
                    Yennoo.setting.represent[origin] = {};
                }

                Yennoo.setting.represent[origin] = represent[origin];
                Yennoo.cookie.save(JSON.stringify(Yennoo.setting));
            }
        });

        $scope.$root.represent = Yennoo.setting.represent || {};
    },
    link: function($scope, $element, $attrs)
    {
        if ($scope.$parent.pagelength === undefined && $scope.pagination){
            $scope.$parent.pagelength = angular.copy($scope.pagination.pages.length)
        }

        var source = $element.clone(true);
        var attrib = $attrs.subheader.split("/");
        var target = angular.element("#container #header .top > .group."+ attrib[0] || {}).eq(0);

        if (attrib[1] === null){
            attrib[1] = "replace"
        }

        if (attrib[1] && attrib[1] === "replace"){
            target.html($scope.$compile(source[0].innerHTML)($scope.$parent));
        } else if (attrib[1] && attrib[1] === "append" || attrib[1] && attrib[1] === "after"){

            target.append($scope.$compile(source[0].innerHTML)($scope.$parent));

        } else if (attrib[1] && attrib[1] === "before"){
            target.html($scope.$compile(source[0].innerHTML + target[0].innerHTML)($scope.$parent));
        }

        $element.remove();
    }
}}]);