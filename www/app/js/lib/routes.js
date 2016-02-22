var yyRoutes = angular.module('yyApp.routes', []);

yyRoutes.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/view/login.html',
            controller: 'YyLoginController'
        })
        .state('reg', {
            url: '/reg',
            templateUrl: 'app/view/reg.html',
            controller: 'YyRegController'
        })
        .state('forgot', {
            url: '/forgot',
            templateUrl: 'app/view/forgot.html',
            controller: 'YyForgotController'
        })
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'app/view/widget/tabs.html'
        })
        .state('tab.news', {
            url: '/news',
            views: {
                'tab-news': {
                    templateUrl: 'app/view/news-index.html',
                    controller: 'YyNewsIndexController'
                }
            }
        })
        .state('tab.messageBox', {
            url: '/messageBox',
            views: {
                'tab-news': {
                    templateUrl: 'app/view/message-box.html',
                    controller: 'YyMessageBoxController'
                }
            }
        })
        .state('tab.messageDetail', {
            url: '/messageDetail/:articleId',
            views: {
                'tab-news': {
                    templateUrl: 'app/view/message-detail.html',
                    controller: 'YyMessageDetailController'
                }
            }
        })
        .state('tab.fq', {
            url: '/fq',
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/fq-index.html',
                    controller: 'YyFqIndexController'
                }
            }
        })
        .state('tab.myFq', {
            url: '/myFq',
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/my-fq.html',
                    controller: 'YyMyFqController'
                }
            }
        })
        .state('tab.fqDetail', {
            url: '/fqDetail/:type/:id',
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/fq-detail.html',
                    controller: 'YyFqDetailController'
                }
            }
        })
        .state('tab.fqSend', {
            url: '/fqSend',
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/fq-send.html',
                    controller: 'YyFqSendController'
                }
            }
        })
        .state('tab.fqSelectDepartment', {
            url: '/fqSelectDepartment',
            cache: false,
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/select-send-department.html',
                    controller: 'YyFqSendDepartmentController'
                }
            }
        })
        .state('tab.fqSelectPerson', {
            url: '/fqSelectPerson',
            cache: false,
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/select-send-department-preson.html',
                    controller: 'YyFqSendPresonController'
                }
            }
        })
        .state('tab.fqSendBack', {
            url: '/fqSendBack',
            cache: false,
            views: {
                'tab-fq': {
                    templateUrl: 'app/view/fq-send-callback.html',
                    controller: 'YyFqSendBackController'
                }
            }
        })
        .state('tab.user', {
            url: '/user',
            views: {
                'tab-user': {
                    templateUrl: 'app/view/user.html',
                    controller: 'YyUserController'
                }
            }
        })
        .state('tab.inviteTypes', {
            url: '/inviteTypes',
            views: {
                'tab-user': {
                    templateUrl: 'app/view/invite-types.html',
                    controller: 'YyInviteTypesController'
                }
            }
        })
        .state('tab.inviteDowingQrcode', {
            url: '/inviteDowingQrcode',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/invite-dowing-qrcode.html',
                    controller: 'YyInviteDowingQrcodeController'
                }
            }

        })
        .state('tab.addToCompany', {
            url: '/addToCompany',
            views: {
                'tab-user': {
                    templateUrl: 'app/view/add-to-company.html',
                    controller: 'YyAddToCompanyController'
                }
            }
        })
        .state('tab.myCompany', {
            url: '/myCompany',
            views: {
                'tab-user': {
                    templateUrl: 'app/view/my-company.html',
                    controller: 'YyMyCompanyController'
                }
            }
        })
        .state('tab.createCompany', {
            url: '/createCompany',
            views: {
                'tab-user': {
                    templateUrl: 'app/view/create-company.html',
                    controller: 'YyCreateCompanyController'
                }
            }
        })
        .state('tab.checkResult', {
            url: '/checkResult',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/check-result.html',
                    controller: 'YyCheckResultController'
                }
            }
        })
        .state('tab.myPassword', {
            url: '/myPassword',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/my-password.html',
                    controller: 'YyMyPasswordController'
                }
            }
        })
        .state('tab.more', {
            url: '/more',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/more.html',
                    controller: 'YyMoreController'
                }
            }
        })
        .state('tab.aboutUs', {
            url: '/aboutUs',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/about-us.html',
                    controller: 'YyAboutUsController'
                }
            }
        })
        .state('tab.userInfo', {
            url: '/userInfo',
            views: {
                'tab-user': {
                    templateUrl: 'app/view/userinfo.html',
                    controller: 'YyUserInfoController'
                }
            }
        })
        .state('tab.editUsername', {
            url: '/editUsername',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/edit-username.html',
                    controller: 'YyEditUsernameController'
                }
            }
        })
        .state('tab.mySex', {
            url: '/mySex',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/my-sex.html',
                    controller: 'YyMySexController'
                }
            }
        })
        .state('tab.editUsertel', {
            url: '/editUsertel',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/edit-usertel.html',
                    controller: 'YyEditUsertelController'
                }
            }
        })
        .state('tab.myRole', {
            url: '/myRole',
            cache: false,
            views: {
                'tab-user': {
                    templateUrl: 'app/view/my-role.html',
                    controller: 'YyMyRoleController'
                }
            }
        });
       $urlRouterProvider.otherwise('/login');
}]);
