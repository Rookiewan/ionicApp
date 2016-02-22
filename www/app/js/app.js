var yyApp = angular.module('yyApp', ['ionic', 'ngCordova', 'ui.router', 'yyApp.routes', 'yyApp.controllers', 'yyApp.directives', 'yyApp.services']);

var hosts = [
    'http://www.rookiewan.wang/',
    'http://localhost/',
    'http://192.168.22.151/'
];
var host = hosts[0];

var yyConfig = {
    urls: {
        imgUploadUrl: host + 'yyapp/upload/',
        baseUrl: host + 'yyapp/index.php?index&'
    },
    codes: {
        errorStatus: 400,
        successStatus: 200
    },
    error: {

    }

};

yyApp
    .run(function($rootScope, $ionicPlatform, $location, $ionicHistory, $cordovaToast) {
        $ionicPlatform.registerBackButtonAction(function(e) {
            e.preventDefault();
            if ($location.path() == '/tab/news' || $location.path() == '/tab/fq' || $location.path() == '/tab/user' || $location.path() == '/login') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.show('再按一次退出应用', 'short', 'bottom');
                    setTimeout(function() {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
                return false;
            }
            $ionicHistory.goBack()
        }, 101);
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
