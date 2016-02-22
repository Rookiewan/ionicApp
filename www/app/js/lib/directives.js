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