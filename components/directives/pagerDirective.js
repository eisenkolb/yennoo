angular.module("Kodi.Directive").directive("pager", ["$filter", "$translate", function($filter, $translate){return {
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
        scope.createPager = function()
        {
            var current   = parseInt(scope.$parent.page || 1);
            var limit     = scope.$root.filter.limit || 8;
            var offset    = current === 1 ? 0 : limit *(current -1);
            var filter    = {
                expression: scope.$root.filter.property || "",
                reverse   : scope.$root.filter.reverse  || false
            };

            /**
             * Calculate the pagination element
             *
             * @param  {!number} current
             * @param  {!number} total
             * @param  {!number} limit
             * @return {{pages: array<object>}}
             */
            var buildPagination    = function(current, total, limit){
                this.buttons       = 5;
                this.pager         = {pages: []};
                this.pager.total   = Number((total / limit).toFixed());
                this.pager.current = this.pager.lower = this.pager.upper = Math.min(current, this.pager.total);

                for(var index = 1; index < this.buttons && index < this.pager.total;){
                    if (this.pager.lower > 1 ) {this.pager.lower--; index++;}
                    if (index < this.buttons && this.pager.upper < this.pager.total) {this.pager.upper++; index++;}
                }

                for(var index = this.pager.lower; index <= this.pager.upper; index++){
                    this.pager.pages.push(index);
                }

                this.pager.path = scope.$root.pagerPath || null;
                if (this.pager.path === null || this.pager.path && location.href.indexOf(this.pager.path) < 0){
                    this.pager.path = scope.$root.pagerPath = location.hash;
                }

                return(this.pager);
            };

            if (Kodi.util.isType(attrs.in, "undefined") === true || Kodi.util.isType(attrs.out, "undefined") === true){
                return(false);
            }

            /**
             * The 'pager' attributes is present and enabled
             */
            if (attrs.pager && attrs.pager === "true"){
                this.order = $filter("orderBy")(this["in"], filter.expression, filter.reverse);
                this.$root[this.out]  = Array.prototype.slice.call(this.order, offset, offset +limit);
                this.$root.pagination = this.pagination = buildPagination(current, this["in"].length, limit);
            }
        };

        /**
         * Create pager on the first 'link' call
         */
        scope.createPager();

        /**
         * Recreation of pager, when filter was changed
         */
        scope.$watchCollection("$root.filter", function(){
            scope.createPager();
            Yennoo.setting.filter = scope.$root.filter;
            Yennoo.cookie.save(JSON.stringify(Yennoo.setting));
        });
    }
}}]);