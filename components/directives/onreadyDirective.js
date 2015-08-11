angular.module("Kodi.Directive").directive("onready", function(){return{
    restrict: "A",
    link: function(scope, element, attrs)
    {
        scope[attrs.onready].apply(element, [scope, element]);
    }
}});