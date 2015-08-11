angular.module("Kodi.Directive").directive("pager", [function(){return {
    restrict: "EAC",
    transclude: true,
    scope: {
        "customerInfo": "=info",
        "in":  "=",
        "out": "@"
    },
    template: "<div ng-transclude class=\"transclude\"></div>",
    link: function(scope, element, attrs)
    {
        var current = parseInt(scope.$parent.page || 1);
        var limit   = scope.$parent.limit || 8;
        var offset  = current === 1 ? 0 : limit *(current -1);

        scope.buildPagination  = function(current, total, limit){
            var buttons        = 5;
            this.pager         = {pages: []};
            this.pager.total   = Number((total / limit).toFixed());
            this.pager.current = this.pager.lower = this.pager.upper = Math.min(current, this.pager.total);

            for (var index = 1; index < buttons && index < this.pager.total;){
                if (this.pager.lower > 1 ) { this.pager.lower--; index++;}
                if (index < buttons && this.pager.upper < this.pager.total) {this.pager.upper++; index++;}
            }

            for(var i = this.pager.lower; i <= this.pager.upper; i++){
                this.pager.pages.push(i);
            }

            this.pager.path = scope.$root.pagerPath || null;
            if (this.pager.path === null || this.pager.path && location.href.indexOf(this.pager.path) < 0){
                this.pager.path = scope.$root.pagerPath = location.hash;
            }

            return(this.pager);
        };

        scope.limit = scope.$root.limit = limit;
        scope.incrementLimit = function(){
            scope.$root.limit += scope.$root.limit;
        };

        if (Kodi.util.isType(attrs.in, "undefined") === true || Kodi.util.isType(attrs.out, "undefined") === true){
            return(false);
        }

        /**
         * The 'pager' attributes is present and enabled
         */
        if (attrs.pager && attrs.pager === "true"){
            scope.$root[scope.out] = Array.prototype.slice.call(scope["in"], offset, offset +limit);
            scope.$root.pagination = scope.pagination = scope.buildPagination(current, scope["in"].length, limit);
        }
    }
}}]);