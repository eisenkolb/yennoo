angular.module("Kodi.Directive").directive("imageonload", function(){return{
    restrict: "A",
    scope: {
        media: "@"
    },
    link: function(scope, element, attrs)
    {
        var image = new Image();
        var media = attrs[scope.media] || null;
        if (media && scope.media === "poster"){
            image.failed = Yennoo.const.VIDEO_COVER_CRACK;
            image.loaded = Yennoo.const.VIDEO_COVER_EDGES;
        } else if (scope.media === "music"){
            image.loaded = Yennoo.const.ALBUM_COVER_EDGES;
            image.failed = Yennoo.const.ALBUM_COVER_FRAME;
        } else if (scope.media === "people"){
            image.loaded = Yennoo.const.VIDEO_COVER_BLANK;
            image.failed = Yennoo.const.UNKNOWN_THUMBNAIL;
        }

        if (attrs.src === undefined && scope.media && scope.media === "poster"){
            element[0].src = Yennoo.const.VIDEO_COVER_FRAME;
        }

        scope.$parent.$watch(media, function(watch){
            if (watch){
                image.src    = watch;
                image.onload = function(){
                    element[0].style.backgroundImage = "url('image')".replace("image", this.src);
                    element[0].src = image.loaded ? image.loaded : element[0].src;
                };
                image.onerror = function(){
                    element[0].src = image.failed;
                };
            }
        });
    }
}});