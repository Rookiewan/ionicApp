var yyDirectives = angular.module('yyApp.directives', []);

yyDirectives.directive('pop', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/view/widget/popup.html',
        replace: false
    };
});

yyDirectives.directive('sysMenu', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/view/widget/system-menu.html'
    };
});
yyDirectives.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = 'tabs-item-hide';
            });
        }
    };
});
yyDirectives.directive('showTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = '';
            });
        }
    };
});
yyDirectives.directive('btnCheck', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/view/widget/btn-check.html',
        replace: true,
        link: function(scope, iEle, iAttrs) {
            var opt = iAttrs.opt;
            var isCount = false;
            var maxCount = 60;
            scope.btnCheckText = '获取验证码';
            iEle.bind('click', function() {
                var _this = angular.element(this);
                
                _this.addClass('disabled').attr('disabled', true);

                if(!isCount) {
                    localStorage.setItem('check-' + opt, new Date().getTime());
                    isCount = true;
                    counting();
                }
            });
            if(!!localStorage.getItem('check-' + opt)) {
                if(countDiff(localStorage.getItem('check-' + opt)) > 0) {
                    var _this = angular.element(iEle);
                    _this.addClass('disabled').attr('disabled', true);
                    isCount = true;
                    counting();
                }
            }
            function countDiff(timeStamp) {
                var diff = maxCount - Math.floor((new Date().getTime() - timeStamp)/1000);
                return diff;
            }
            function counting() {
                var lastTime = localStorage.getItem('check-' + opt);
                var diff;
                var counter = setInterval(function() {
                    diff = countDiff(lastTime);
                    scope.$apply(function() { 
                        if(diff <= 0) {
                            isCount = false;
                            angular.element(iEle).removeClass('disabled').removeAttr('disabled');
                            clearInterval(counter);
                            scope.btnCheckText = '获取验证码';
                        } else {
                            scope.btnCheckText = '重新发送' + diff + '秒';
                        }
                        
                    });
                }, 1000);
            }
        }
    };
});