var yyController = angular.module('yyApp.controllers', []);
yyController.controller('rootController', ['$scope', '$state', '$window', '$location', '$ionicHistory', '$ionicGesture', function($scope, $state, $window, $location, $ionicHistory, $ionicGesture) {


    $scope.goBack = function() {
        goBack();
    };
    $scope.onSwipeRight = function() {
        goBack();
    };
    function goBack() {
        var path = $location.path();
        switch(path) {
            case '/tab/fqSend':
                $state.go('tab.fq');
                break;
            default:
                $ionicHistory.goBack();
        }
    }
}]);

yyController.controller('YyAboutUsController', ['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.version = "2.1.0";
}]);
yyController.controller('YyAddToCompanyController', ['$scope', '$state', '$http', '$timeout', 'currUserService', function($scope, $state, $http, $timeout, currUserService) {
    $scope.isGetCheckCode = false;
    $scope.submit = function() {
        $state.go('tab.checkResult');
    };

    $scope.getCheckCode = function() {
        $scope.isGetCheckCode = !$scope.isGetCheckCode;
        $timeout(function() {
            $scope.isGetCheckCode = false;
        }, 10000);
    };
    $scope.user = currUserService;
}]);

yyController.controller('YyCheckResultController', ['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.submit = function() {
        $state.go('checkResult');
    };
}]);
yyController.controller('YyCreateCompanyController', ['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.submit = function() {
        $state.go('tab.checkResult');
    };
}]);
yyController.controller('YyEditUsernameController', ['$scope', '$state', '$http', '$ionicHistory', '$cordovaToast', 'currUserService', 'updService', function($scope, $state, $http, $ionicHistory, $cordovaToast, currUserService, updService) {
    $scope.save = function() {
        if($scope.user.username) {
            var postObj = {
                'username': $scope.user.username
            };
            updService.upd('updName', postObj, function(data) {

                if(data.status == yyConfig.codes.errorStatus) {
                    if(data.info == 'repeat') {
                         console.log('该用户已存在');
                        $cordovaToast.show('该用户已存在','short','bottom');
                        return false;
                    }
                } else if(data.status == yyConfig.codes.successStatus) {
                    currUserService.set({'username': $scope.user.username});
                    console.log('名字更改成功');
                    $cordovaToast.show('名字更改成功','short','bottom');
                    $ionicHistory.goBack();
                }
            });
        } else {
            $cordovaToast.show('名字不能为空','short','bottom');
        }
    };
    $scope.user = {'username': currUserService.username};
}]);   
yyController.controller('YyEditUsertelController', ['$scope', '$state', '$http', '$cordovaToast', '$ionicHistory', 'currUserService', 'updService', function($scope, $state, $http, $cordovaToast, $ionicHistory, currUserService, updService) {
    $scope.user = {'ceilPhone': currUserService.ceilPhone};
    $scope.save = function() {
        if($scope.user.ceilPhone) {
            var postObj = {
                'ceilPhone': $scope.user.ceilPhone
            };
            updService.upd('updCeilPhone', postObj, function(data) {

                if(data.status == yyConfig.codes.successStatus) {
                    currUserService.set({'ceilPhone': $scope.user.ceilPhone});
                    console.log('手机号更改成功');
                    $cordovaToast.show('手机号更改成功','short','bottom');
                    $ionicHistory.goBack();
                }
            });
        } else {
            $cordovaToast.show('手机号码不能为空','short','bottom');
        }
       
        
    };
}]);
yyController.controller('YyForgotController', ['$scope', '$state', '$timeout', function($scope, $state, $timeout) {
    $scope.newPwdType = $scope.reNewPwdType = 'password';
    $scope.toggleType = function() {
        if(arguments[0] == 're') {
            $scope.reNewHidePwd = !$scope.reNewHidePwd;
            $scope.reNewPwdType = $scope.reNewHidePwd == true ? 'text' : 'password';
        } else {
            $scope.newHidePwd = !$scope.newHidePwd;
            $scope.newPwdType = $scope.newHidePwd == true ? 'text' : 'password';
        }
        
    };
    $scope.getCheckCode = function() {
        if(!$scope.isGetCheckCode) {
            $scope.isGetCheckCode = true;
            $timeout(function() {
                $scope.isGetCheckCode = false;
            }, 4000);
        } else {
            return false;
        }
    };
    $scope.validatePassword = function(){
        var newP = $scope.newPassword;
        var confirmP = $scope.confirmPassword;
        if(newP==confirmP){
            return true;
        }
        else {
            return false;
        }
    }
    $scope.validateForm = function(phoneValid){
        getUserInfosService001.success(function(data){
            // 数据库是否有这个手机号码
            var hasTheMobliePhone = true;
            angular.forEach(data,function(obj){
                if($scope.mobilePhone==obj.mobilePhone){
                    hasTheMobliePhone = true;
                }
                else {
                    hasTheMobliePhone = false;
                }
            })
            if(hasTheMobliePhone==false){
                alert("该手机还未注册...")
            }
            else if($scope.validatePassword() && phoneValid && hasTheMobliePhone==true) {
                alert("成功发送");
            }
            else {
                if($scope.validatePassword()==false){
                    alert("您输入的密码不一致，请重新输入");
                }
                else if(phoneValid==false){
                    alert("您输入的手机号码有误");
                }
            }
        })
    }
}]);
yyController.controller('YyFqDetailController', ['$scope', '$state', '$stateParams', '$http', function($scope, $state, $stateParams, $http) {

    if($stateParams.type && $stateParams.id) {
        var type = $stateParams.type;
        var id = $stateParams.id;

        getData(type, function(data) {
            var isGet = false;
            angular.forEach(data, function(obj) {
                if(obj.id == id) {
                    $scope.fqDetail = obj;
                    isGet = true;
                    return;
                }
            });
            if(!isGet) {
                console.log('error');
            }
        });
    }
    
    function getData(opts, callback) {
        var timeStamp = new Date().valueOf();
        $http.get('data/fqDetail.json?timeStamp=' + timeStamp).success(function(data) {
            var returnStr = '';
            switch(opts) {
                case 'received':
                    returnStr = data.received;
                    break;
                case 'sent':
                    returnStr = data.sent;
                    break;
                default:
                    returnStr = data.received;;
            }
            callback(returnStr);
        }).error(function(data) {});
    }
}]);
yyController.controller('YyFqIndexController', ['$rootScope', '$scope', '$state', '$http', '$timeout', '$cordovaToast', 'currUserService', 'fqListService', function($rootScope, $scope, $state, $http, $timeout, $cordovaToast, currUserService, fqListService) {

    $scope.isOpen = false;

    $scope.$on('$ionicView.beforeLeave', function(scope, states) {
    });
    $scope.$on('$ionicView.beforeEnter', function(scope, states) {
    });

    $scope.$parent.myScrollOptions = {
        'wrapper': {
            click: true,
            onScrollEnd: function() {
                console.log('finished scroll...');
            }
        }
    };
    function ROUListToggle() {
        $scope.isOpen = !$scope.isOpen;
        if($scope.isOpen) {
            $scope.selectListOpen = {
                '-webkit-transform': 'translateY(0)'
            };
            $rootScope.hideTabs = 'tabs-item-hide';
            //$('.tab-nav').hide();

        } else {
            $scope.selectListOpen = {
                '-webkit-transform': 'translateY(-110%)'
            };
            $rootScope.hideTabs = '';
            //$('.tab-nav').show();
        }
    }
    function refreshFq(_ROUId) {
        var _ROUId = _ROUId || 1;
        var timeStamp = new Date().valueOf();
        $http.get('data/fqIndex.json?timeStamp=' + timeStamp).success(function(data) {

            var _ROUs = data.ROUs;
            _ROUs.forEach(function(ROU) {
                if(ROU.id == _ROUId) {
                    $scope.list = ROU.fqIndexList;

                    if(ROU.fqIndexList.length) {
                        $scope.isListEmpty = false;
                    } else {
                        $scope.isListEmpty = true;
                    }
                    return;
                }
            });
        }).error(function(data) {

        });
    }
    function getROUFq(_ROUId) {
        var _ROUId = _ROUId || 1;
        var timeStamp = new Date().valueOf();
        $http.get('data/fqIndex.json?timeStamp=' + timeStamp).success(function(data) {

            var _ROUs = data.ROUs;
            _ROUs.forEach(function(ROU) {
                if(ROU.id == _ROUId) {
                    $scope.list = ROU.fqIndexList;
                    var listL = $scope.list.length;
                    for(s in ROU.fqIndexList) {
                        $scope.list[Number(listL) + Number(s)] = ROU.fqIndexList[s];
                    }

                    if(ROU.fqIndexList.length) {
                        $scope.isListEmpty = false;
                    } else {
                        $scope.isListEmpty = true;
                    }
                    return;
                }
            });
        }).error(function(data) {

        });
    };
    function getROUList() {
        var timeStamp = new Date().valueOf();
        $http.get('data/fqIndex.json?timeStamp=' + timeStamp).success(function(data) {

            var _ROUs = [];
            data.ROUs.forEach(function(ROU) {
                _ROUs.push({
                    id: ROU.id,
                    name: ROU.name
                });
            });
            $scope.ROUList = _ROUs;
            refreshFq();
        }).error(function(data) {

        });
    }
    getROUList();
    $scope.ROUIdSelect = fqListService.getObj().ROUSIdSelect;
    $scope.myFq = function() {
        $state.go('tab.myFq');
    };
    $scope.send = function() {
        $state.go('tab.fqSend');
    };
    $scope.selectFilter = function() {
        ROUListToggle();
    };
    $scope.choseROU = function(_ROUid) {
        fqListService.setInfo({'ROUSIdSelect': _ROUid}, function() {

        });
        //getROUFq(_ROUid);
        //ROUListToggle();
    };
    $scope.selectROU = function() {
        var _ROUId = fqListService.getObj().ROUSIdSelect;
        refreshFq(_ROUId);
        ROUListToggle();
    };
    
    $scope.fqDetail = function() {
        //临时
        $state.go('tab.fqDetail', {'type': 'received', 'id': 1});
    };
    $scope.doDpListRefresh = function() {
        $timeout(function() {
            getROUList();
            $scope.$broadcast('scroll.refreshComplete');
            $cordovaToast.show('刷新成功','short','bottom');
        }, 1000);
    };
    $scope.doFqListRefresh = function() {
        $timeout(function() {
            var _ROUId = fqListService.getObj().ROUSIdSelect;
            refreshFq(_ROUId);
            $scope.$broadcast('scroll.refreshComplete');
            $cordovaToast.show('刷新成功','short','bottom');
        }, 1000);
    };
    $scope.loadMore = function() {
        $timeout(function() {
            var _ROUId = fqListService.getObj().ROUSIdSelect;
            getROUFq(_ROUId);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
    };
}]);

yyController.controller('YyFqSendController', ['$scope', '$state', '$http', 'sendFqService', function($scope, $state, $http, sendFqService) {

    $scope.whichActive = 'fq';
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.sendPerson = sendFqService.sendFq;
    });


    $scope.changeActive = function(activeName) {
        $scope.whichActive = activeName;
    };

    $scope.changeCheck = function(type, n) {
        $scope['img' + type] = n;
    };

    $scope.selectDepartment = function() {
        $state.go('tab.fqSelectDepartment');
    };
    $scope.send = function() {
        $state.go('tab.fqSendBack');
    };
}]);

yyController.controller('YyFqSendBackController', ['$scope', '$state', '$http', '$ionicHistory', 'sendFqService', 'currUserService', function($scope, $state, $http, $ionicHistory, sendFqService, currUserService) {
    $scope.sendAgain = function() {
        sendFqService.clear(function(data) {
            console.log('leave');
            console.log(sendFqService.sendFq);
            $ionicHistory.goBack();
        });
    };
}]);

yyController.controller('YyInviteDowingQrcodeController', ['$scope', '$state', '$http', function($scope, $state, $http) {

}]);
yyController.controller('YyInviteTypesController', ['$scope', '$state', '$http', function($scope, $state, $http) {

    $scope.addToCompany = function() {
        $state.go('tab.addToCompany');
    };
    $scope.inviteQrcode = function() {
        $state.go('tab.inviteDowingQrcode');
    };
}]);

yyController.controller('YyLoginController', ['$scope', '$state', 'currUserService', '$cordovaToast', '$timeout', '$http', '$ionicHistory', function($scope, $state, currUserService, $cordovaToast, $timeout, $http, $ionicHistory) {
    // $scope.accountNumber = 'Rookie_wan';
    // $scope.password = '123456';
    // $scope.userPhoto = 'upload/user-header.png';


    $timeout(function() {
        $scope.$watch('accountNumber', function(nValue) {
            getUserLogin(function(userInfos) {
                var userPhoto = 'upload/user-header.png';
                angular.forEach(userInfos, function(user) {
                    if(user.username == nValue) {
                        userPhoto = yyConfig.urls.imgUploadUrl + user.headPhotoUrl;
                        return false;
                    }

                });
                $scope.userPhoto = userPhoto;
            });
        });
    }, 100);

    // 验证用户名密码
    $scope.validateUser = function() {
        var hasTheUser = false;
        getUserLogin(function(userInfos) {
            var currUser;
            angular.forEach(userInfos, function(user) {
                if($scope.accountNumber==user.username){
                    currUser = user;
                    hasTheUser = true;
                    return;
                }
            });

            if(hasTheUser) {
                if($scope.password == currUser.password) {
                    console.log('登录成功');
                    localStorage.setItem('userId', currUser.id);
                    currUserService.set(currUser);
                    $cordovaToast.show('登录成功','short','bottom');
                    $state.go('tab.user', {'userId': currUser.id});
                } else if($scope.password != currUser.password){
                    $cordovaToast.show('密码错误','short','bottom');
                }
            } else {
                $cordovaToast.show('该用户不存在','short','bottom');
            }
        });
    }
    $scope.reg = function() {
        $state.go('reg');
    };
    $scope.forgot = function() {
        $state.go('forgot');
    };

    $scope.$on('$ionicView.enter', function() {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    });
    
    function getUserLogin(callback) {
        var timeStamp = new Date().valueOf();

        $http.get(yyConfig.urls.baseUrl + 'A=getUserLogin&timeStamp=' + timeStamp).success(function(data) {
            callback(data);
        }).error(function(data) {
            console.log('error' + data);
        });
    }
    checkIsLogin();
    function checkIsLogin() {
        if(!!localStorage.getItem('userId')) {
            var userId = parseInt(localStorage.getItem('userId'));

            getUserLogin(function(userInfos) {
                angular.forEach(userInfos, function(user) {
                    if(userId==user.id){
                        currUserService.set(user);
                        $state.go('tab.user', {'userId': user.id});
                        return;
                    }
                });
            });
        }
    }
}]);

yyController.controller('YyMessageBoxController', ['$scope', '$state', '$stateParams', '$http', '$timeout', '$cordovaToast', function($scope, $state, $stateParams, $http, $timeout, $cordovaToast) {

    $scope.isSysMenuOpen = false;
    $scope.$parent.myScrollOptions = {
        'wrapper': {
            click: true,
            onScrollEnd: function() {
                console.log('finished scroll...');
            }
        }
    };
    var sysMenuOpts = [
        {
            name: "置顶"
        },
        {
            name: "删除消息"
        },
        {
            name: "标记已读"
        }
    ];
    $scope.sysMenuOpts = sysMenuOpts;
    $scope.detail = function(articleId) {
        console.log(articleId);
        $state.go('tab.messageDetail', {'articleId': articleId});
    };
    $scope.doNewMsg = function() {
        console.log('newMsg');
        $scope.isSysMenuOpen = true;
    };
    $scope.doRefresh = function() {
        $timeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            $cordovaToast.show('刷新成功','short','bottom');
        }, 1000);
    };
    var timeStamp = new Date().valueOf();
    $http.get('data/messageBox.json?timeStamp=' + timeStamp).success(function(data) {
        $scope.lists = data.messages;
    }).error(function(data) {});
}]);
yyController.controller('YyMessageDetailController', ['$scope', '$state', '$stateParams', '$http', function($scope, $state, $stateParams, $http) {

    var articleId = 1;
    /*if($stateParams) {
        articleId = $stateParams.articleId;
    }*/
    if($stateParams.articleId) {
        articleId = $stateParams.articleId;
        console.log(articleId);
    }
    var timeStamp = new Date().valueOf();
    $http.get(yyConfig.urls.baseUrl + 'A=getNewsDetail&articleId=' + articleId + '&timeStamp=' + timeStamp).success(function(data) {
        data.imgUrl = yyConfig.urls.imgUploadUrl + data.imgUrl;
        $scope.article = data;
        console.log(data);
    }).error(function(data) {
        console.log('error: ' + data);
    });
    /*$http.get('data/messageDetail.json?timeStamp=' + timeStamp).success(function(data) {
        var articles = data.articles;
        for(s in articles) {
            var article = articles[s];
            if(article.id == articleId) {
                $scope.article = article.detail;
                return;
            }
        }
    }).error(function(data) {

    });*/
}]);
yyController.controller('YyMoreController', ['$scope', '$state', '$http', '$ionicPopup', function($scope, $state, $http, $ionicPopup) {

    $scope.isPopOpen = false;
    $scope.aboutUs = function() {
        $state.go('tab.aboutUs');
    };
    $scope.loginOut = function() {
        var opt = {
            fun: 'loginOut'
        };
        $scope.opt = opt;
        $scope.isPopOpen = true;
        $scope.comPop = true;
        $scope.popText = '确定要退出账号？';
        $scope.btnL = '取消';
        $scope.btnR = '确定';
    };
    $scope.checkUpd = function() {
        $scope.popText = '当前已是最新版本';
        $http.get('data/checkUpd.json').success(function(data) {
            $scope.newVersion = data.newVersion;
            $scope.updTexts = data.updTexts;
        }).error(function(data) {});
        $scope.isPopOpen = true;
        $scope.btnL = '暂不更新';
        $scope.btnR = '立即更新';
    };
    $scope.clearCache = function() {
        $ionicPopup.confirm({
            title: '清除缓存',
            subTitle: '是否清除缓存？',
            cancelText: '取消',
            okText: '确定'
        });
    };
}]);
yyController.controller('YyMyCompanyController', ['$scope', '$state', '$http', function($scope, $state, $http) {

    $scope.createCompany = function() {
        $state.go('tab.createCompany');
    };
}]);
yyController.controller('YyMyFqController', ['$scope', '$state', '$http', '$timeout', '$cordovaToast', function($scope, $state, $http, $timeout, $cordovaToast) {

    $scope.reActive = true;
    getData('received', function(data) {
        $scope.list = data;
    });
    $scope.received = function() {
        $scope.reActive = true;
        $scope.seActive = false;
        getData('received', function(data) {
            $scope.list = data;
        });
    };
    $scope.sent = function() {
        $scope.seActive = true;
        $scope.reActive = false;
        getData('sent', function(data) {
            $scope.list = data;
        });
    };
    $scope.detail = function(id) {
        var type = '';
        if($scope.reActive) {//我收到的
            type = 'received';
        } else {//我送出的
            type = 'sent';
        }
        $state.go('tab.fqDetail', {'type': type, 'id': id});
    };
    $scope.sendBack = function() {
        console.log('sendBack click!');
    };
    $scope.doRefresh = function() {
        $timeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
            $cordovaToast.show('刷新成功','short','bottom');
        }, 1000);
    };
    function getData(opts, callback) {
        var timeStamp = new Date().valueOf();
        $http.get('data/myFq.json?timeStamp=' + timeStamp).success(function(data) {
            var returnStr = '';
            switch(opts) {
                case 'received':
                    returnStr = data.received;
                    break;
                case 'sent':
                    returnStr = data.sent;
                    break;
                default:
                    returnStr = data.received;;
            }
            callback(returnStr);
        }).error(function(data) {});
    }
}]);
yyController.controller('YyMyPasswordController', ['$scope', '$state', '$http', '$ionicHistory', 'currUserService', 'updService', '$cordovaToast', function($scope, $state, $http, $ionicHistory, currUserService, updService, $cordovaToast) {

    $scope.pwd = {
        'oldPassword': '',
        'newPassword': '',
        'reNewPassword': ''
    };
    $scope.save = function() {
        if(currUserService.password != $scope.pwd.oldPassword) {
            $cordovaToast.show('密码错误','short','bottom');
            return false;
        } else if($scope.pwd.newPassword != $scope.pwd.reNewPassword || $scope.pwd.newPassword == '') {
            $cordovaToast.show('两次输入密码不一致','short','bottom');
            return false;
        } else {
            var pwdObj = {
                'oldPwd': $scope.pwd.oldPassword,
                'newPwd': $scope.pwd.newPassword
            };
            updService.upd('updPwd', pwdObj, function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                   currUserService.set({'password': $scope.pwd.newPassword});
                   console.log('修改成功');
                   $cordovaToast.show('修改成功','short','bottom');
                   $ionicHistory.goBack();
                }
                return false;
            });
        }

        // success
    };
}]);
yyController.controller('YyMyRoleController', ['$scope', '$state', '$http', '$cordovaToast', '$ionicHistory', 'currUserService', 'updService', function($scope, $state, $http, $cordovaToast, $ionicHistory, currUserService, updService) {
    $scope.role = currUserService.role;
    $scope.changeRole = function(role) {
        var _role;
        switch(role) {
            case '队长':
                _role = 0;
                break;
            case '教练':
                _role = 1;
                break;
            case '管理员':
                _role = 2;
                break;
            default:
                _role = 3;
        }
        var postObj = {
            'role': _role
        };
        updService.upd('updRole', postObj, function(data) {

            if(data.status == yyConfig.codes.successStatus) {
                currUserService.set({'role': role});
                console.log('角色更改成功');
                $cordovaToast.show('角色更改成功','short','bottom');
                $ionicHistory.goBack();
            }
        });

        
    };
}]);
yyController.controller('YyMySexController', ['$scope', '$state', '$http', '$cordovaToast', '$ionicHistory', 'currUserService', 'updService', function($scope, $state, $http, $cordovaToast, $ionicHistory, currUserService, updService) {
    $scope.sex = currUserService.sex;
    $scope.changeSex = function(sex) {
        var postObj = {
            'sex': sex == '女' ? 1 : 0
        };
        updService.upd('updSex', postObj, function(data) {

            if(data.status == yyConfig.codes.successStatus) {
                currUserService.set({'sex': sex});
                console.log('性别更改成功');
                $cordovaToast.show('性别更改成功','short','bottom');
                $ionicHistory.goBack();
            }
        });
    };
}]);
yyController.controller('YyNewsIndexController', ['$scope', '$state', '$http', '$timeout', '$cordovaToast', function($scope, $state, $http, $timeout, $cordovaToast) {
    $scope.bannerImage = 'upload/news-index-banner-0.png';
    $scope.bannerTitle = '放飞心中的梦想——丰收老师分享';

    $scope.$on('$ionicView.beforeLeave', function(scope, states) {
    });
    $scope.$on('$ionicView.beforeEnter', function(scope, states) {
    });

    $scope.$parent.myScrollOptions = {
        'wrapper': {
            click: true,
            onScrollEnd: function() {
                console.log('finished scroll...');
            }
        }
    };
    $scope.detail = function(id) {
        console.log('boom!!!');
        $state.go('tab.messageDetail', {'articleId': id});
    };
    $scope.message = function() {
        $state.go('tab.messageBox');
    };
    $scope.doRefresh = function() {
        $timeout(function() {
            refreshNews();
            $scope.$broadcast('scroll.refreshComplete');
            $cordovaToast.show('刷新成功','short','bottom');
        }, 1000);
    };
    $scope.loadMore = function() {
        var timeStamp = new Date().valueOf();
        $timeout(function() {
            getNews(function(data) {
                var listL = $scope.lists.length;
                for(s in data) {
                    data[s].imgUrl = yyConfig.urls.imgUploadUrl + data[s].imgUrl;
                    data[s].time = data[s].time.substring(0, 10);
                    $scope.lists[Number(listL) + Number(s)] = data[s];
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }, 1000);
        
    };
    refreshNews();
    getBanner();

    function getNews(callbackData) {
        var timeStamp = new Date().valueOf();
        $http.get(yyConfig.urls.baseUrl + 'A=getNews&timeStamp=' + timeStamp).success(function(data) {
            callbackData(data);
        }).error(function(data) {
            console.log('error' + data);
        });
    }

    function refreshNews() {
        getNews(function(data) {
            for(s in data) {
                data[s].imgUrl = yyConfig.urls.imgUploadUrl + data[s].imgUrl;
                data[s].time = data[s].time.substring(0, 10);
            }
            $scope.lists = data;
        });
    }

    function getBanner() {
       var timeStamp = new Date().valueOf();

       $http.get(yyConfig.urls.baseUrl + 'A=getNewsBanner&id=1&timeStamp=' + timeStamp).success(function(data) {
           for(s in data) {
               data[s].imgUrl = yyConfig.urls.imgUploadUrl + data[s].imgUrl;
           }
           $scope.banner = data[0];
           
       }).error(function(data) {
           console.log('error' + data);
       }); 
    }
    

    
    /*$http.get('data/newsIndex.json').success(function(data) {
        $scope.lists = data.list;
    }).error(function(data) {

    });*/
}]);
yyController.controller('YyRegController', ['$scope', '$state', '$timeout', '$http', '$interval', function($scope, $state, $timeout, $http, $interval) {
    $scope.pwdType = 'password';
    $scope.checkCodeText = '获取验证码';
    var counter,
        isCount = false
        countDownTime = 60;
    checkInit();
    $scope.isGetCheckCode = isCount;
    $scope.toggleType = function() {
        $scope.hidePwd = !$scope.hidePwd;
        $scope.pwdType = $scope.hidePwd == true ? 'text' : 'password';
    };
    $scope.getCheckCode = function() {
        if(isCount) {
            return;
        }
        localStorage.setItem('reg_isCount', true);
        if(!$scope.isGetCheckCode) {
            $scope.isGetCheckCode = true;
            if(!isCount) {
                localStorage.setItem('reg_clickTime', new Date().getTime());

                countCode();
                isCount = true;
            }
        } else {
           return false;
        }
    };
    function checkInit() {
        if(!localStorage.getItem('reg_isCount')) {
            localStorage.setItem('reg_isCount', false);
        } else if(localStorage.getItem('reg_isCount') == 'true'){
            isCount = true;
            countCode();
        }
    }
    function countCode() {
        var _clickTime = localStorage.getItem('reg_clickTime');
        counter = $interval(function() {
            var _time = timeInterval(_clickTime);
            var _countDownTime = countDownTime - _time;

            if(_countDownTime <= 0) {
                localStorage.setItem('reg_isCount', false);
                $scope.checkCodeText = '获取验证码';
                clearInterval(counter);
                return false;
            }
            $scope.checkCodeText = '发送 ' + _countDownTime + ' 秒';
        }, 1000);
    }
    function timeInterval(prevTime) { //return seconds
        var _seconds = new Date().getTime();
        return Math.floor((_seconds - prevTime)/1000);
    }
    // 验证注册名是否被使用
    $scope.reg = function() {
        /*getUserInfosService001.success(function(data) {
            var hasTheUserName = false;
            angular.forEach(data, function(obj) {
                if ($scope.userName == obj.userName) {

                    hasTheUserName = true;
                } else {}
            })
            if (hasTheUserName == true) {
                alert("该用户名已经被使用...");
            } else if (hasTheUserName == false) {
                var user = {
                    'userName': $scope.userName,
                    'mobilePheone': $scope.mobilePhone,
                    'userEmail': "",
                    'password': $scope.userPassword
                };
                regUsersService.addNewUser(user);
                alert('注册成功');
                $state.go('login');
            } else {
                console.log($scope.have);
            }
        }).error(function() {
            alert("数据获取失败...");
        });*/
        var regInfo = {
            "username": $scope.username,
            "password": $scope.password,
            "ceilPhone": $scope.ceilPhone
        };

        /*$http({
            method: 'POST',
            url: baseUrl + 'A=userReg',
            params: regInfo
        }).success(function(data) {
            console.log('success: ' + data);
        }).error(function(data) {
            console.log('error: ' + data);
        });*/

        $http({
            method: 'POST',
            url: yyConfig.urls.baseUrl + 'A=userReg',
            params: {
                'postdata': regInfo
            }
        }).success(function(data) {
            if(data.status == yyConfig.codes.errorStatus) {
                if(data.info == 'repeat') {
                    $cordovaToast.show('该用户已存在','short','bottom');
                    return false;
                }
            } else if(data.status == yyConfig.codes.successStatus) {
                console.log('success');
                $timeout(function() {
                    //more codes
                    $state.go('login');
                }, 1000);
                $cordovaToast.show('注册成功','short','bottom');
            }
        });

        /*$http.get(baseUrl + 'A=userReg&id=1&timeStamp=' + timeStamp).success(function(data) {
            callback(data);
        }).error(function(data) {
            console.log('error' + data);
        });*/
    };

}]);


yyController.controller('YyFqSendDepartmentController', ['$scope', '$state', '$http', 'currUserService', 'sendFqService', function($scope, $state, $http, currUserService, sendFqService) {
    $scope.selectDepartment = function(ROUId, name) {
        sendFqService.setInfo({'ROUId': ROUId, 'ROUName': name}, function(data) {
            $state.go('tab.fqSelectPerson');
        });
    };

    var timeStamp = new Date().valueOf();
    $http.get('data/fqROUs.json?timeStamp=' + timeStamp).success(function(data) {

        var _ROUs = [];
        data.ROUs.forEach(function(ROU) {
            _ROUs.push({
                id: ROU.ROUId,
                name: ROU.ROUName
            });
        });
        $scope.ROUList = _ROUs;
    }).error(function(data) {

    });
}]);

yyController.controller('YyFqSendPresonController', ['$ionicHistory', '$scope', '$state', '$window', '$http', 'currUserService', 'sendFqService', function($ionicHistory, $scope, $state, $window, $http, currUserService, sendFqService) {
    $scope.checkPerson = sendFqService.sendFq.personName;
    var timeStamp = new Date().valueOf();
    $http.get('data/fqROUPerson.json?timeStamp=' + timeStamp).success(function(data) {

        var ROUId = sendFqService.sendFq.ROUId;
        var people = [];
        data.peopleList.forEach(function(person) {
            if(person.ROUId == ROUId) {
                people = person.people;
                return;
            }
        });
        $scope.peopleList = people;
    }).error(function(data) {

    });
    $scope.selectPerson = function(personId, personName) {
        sendFqService.setInfo({'personId': personId,'personName': personName}, function(data) {
            console.log(data);
            alert('您选中了 ' + sendFqService.sendFq.ROUName + ' ROU 的 ' + sendFqService.sendFq.personName);

            $ionicHistory.goBack(-2);
        });
    };
}]);

yyController.controller('YyUserController', ['$scope', '$state', '$stateParams', '$ionicGesture', 'getCurrUserService', 'currUserService',function($scope, $state, $stateParams, $ionicGesture, getCurrUserService, currUserService) {
    var userId = '';
    if($stateParams.userId) {
        userId = $stateParams.userId;
    }



    //$scope.sex = currUserService.sex == undefined ? null : (currUserService.sex == '男' ? '♂' : '♀');

    $scope.$on('$ionicView.loaded', function(scope, states) {
        //临时
        //currUserService.set({'id': '0'});
        
        getCurrUserService.getInfo(function(user) {
            console.log(user);
            currUserService.set(user);
            $scope.user = currUserService;
        });
    });
    $scope.$on('$ionicView.beforeLeave', function(scope, states) {
    });
    $scope.$on('$ionicView.beforeEnter', function(scope, states) {
    });

    $scope.invitePartner = function() {
        $state.go('tab.inviteTypes');
    };
    $scope.myCompany = function() {
        $state.go('tab.myCompany');
    };
    $scope.updPwd = function() {
        $state.go('tab.myPassword');
    };
    $scope.more = function() {
        $state.go('tab.more');
    };
    $scope.userInfo = function() {
        $state.go('tab.userInfo');
    };
    $scope.mySex = function() {
        $state.go('tab.mySex');
    };
    var ele = document.querySelector('.wgt-user-header');
    var headerHeight = ele.offsetHeight;
    var distortion = {};
    var startY = 0;
    var moveDis = 0;

    ele.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startY = e.touches[0].pageY;
    });
    ele.addEventListener('touchmove', function(e) {
        e.preventDefault();

        $scope.$apply(function () {
            var nowH = 0;
            moveDis = e.touches[0].pageY - startY;
            if(moveDis < 0) {
                return;
            }
            nowH = headerHeight + moveDis;
            var scale_ = nowH / headerHeight;
            
            if(scale_ < 2) {
                distortion.scaleS = scale_;
                distortion.headerH = nowH + 'px';
                distortion.imageDown = moveDis / 4 + 'px';
                distortion.nameDown = moveDis * 3 / 4 + 'px';
                $scope.distortion = distortion;
            }
        });
    });
    ele.addEventListener('touchend', function(e) {
        e.preventDefault();
        $scope.$apply(function () {
            distortion.headerH = headerHeight + 'px';
            distortion.scaleS = '1';
            distortion.imageDown = '0';
            distortion.nameDown = '0';
            $scope.distortion = distortion;
        });
    });
    // $ionicGesture.on('dragdown', function (event) {
    //     $scope.$apply(function () {
    //         var nowH = 0;
    //         var distance = event.gesture.distance;
    //         nowH = headerHeight + distance;
    //         var scale_ = nowH / headerHeight;
            
    //         if(scale_ < 2) {
    //             distortion.scaleS = scale_;
    //             distortion.headerH = nowH + 'px';
    //             distortion.imageDown = distance / 4 + 'px';
    //             distortion.nameDown = distance * 3 / 4 + 'px';
    //             $scope.distortion = distortion;
    //         }
    //     });
    // }, ele);
    // $ionicGesture.on('release', function (event) {
    //     $scope.$apply(function () {
    //         distortion.headerH = headerHeight + 'px';
    //         distortion.scaleS = '1';
    //         distortion.imageDown = '0';
    //         distortion.nameDown = '0';
    //         $scope.distortion = distortion;
    //     });
    // }, ele);
}]);

yyController.controller('YyUserInfoController', ['$scope', '$state', '$http', 'currUserService', function($scope, $state, $http, currUserService) {

    $scope.$parent.myScrollOptions = {
        'wrapper': {
            click: true,
            onScrollEnd: function() {
                console.log('finished scroll...');
            }
        }
    };
    var sysMenuOpts = [
        {
            name: "拍照",
            fun: "takePic"
        },
        {
            name: "选择本地照片",
            fun: "selectPicFromLocal"
        }
    ];
    $scope.sysMenuOpts = sysMenuOpts;


    console.log(currUserService);
    $scope.user = currUserService;
    $scope.selectPhoto = function() {
        $scope.isSysMenuOpen = true;
    };
    $scope.editUsername = function() {
        $state.go('tab.editUsername');
    }
    $scope.mySex = function() {
        $state.go('tab.mySex');
    };
    $scope.editUsertel = function() {
        $state.go('tab.editUsertel');
    };
    $scope.myRole = function() {
        $state.go('tab.myRole');
    };
}]);
yyController.controller('YyWgtPopupController', ['$scope', '$state', '$http', '$timeout', function($scope, $state, $http, $timeout) {
    $scope.cancle = function() {
        $scope.$parent.isPopOpen = false;
        $scope.$parent.comPop = false;
        $scope.$parent.newVersion = false;
    };
    $scope.ok = function(optName) {
        console.log(optName);
        switch(optName) {
            case 'loginOut':
                console.log('out');
                localStorage.setItem('userId', '');
                $timeout(function() {
                   $state.go('login'); 
                }, 100);
                
                //ionic.Platform.exitApp();
                break;
            default:
        }
        $scope.$parent.isPopOpen = false;
        $scope.$parent.comPop = false;
        $scope.$parent.newVersion = false;
    };
}]);
yyController.controller('YyWgtSysMenuController', ['$scope', '$state', '$http', '$cordovaCamera', '$cordovaImagePicker', 'currUserService', 'uploadPicService', function($scope, $state, $http, $cordovaCamera, $cordovaImagePicker, currUserService, uploadPicService) {
    $scope.cancle = function() {
        $scope.$parent.isSysMenuOpen = false;
        console.log('cancle');
    };
    $scope.sysOpt = function(optName) {
        console.log(optName);
        switch (optName) {
            case 'takePic':
                var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA
                };
                $cordovaCamera.getPicture(options).then(function(imageURI) {
                    $scope.$parent.user.headPhotoUrl = imageURI;
                    currUserService.headPhotoUrl = imageURI;
                    $scope.cancle();
                }, function(err) {
                    // error  
                });
                break;
            case 'selectPicFromLocal':
                var options = {
                    maximumImagesCount: 1
                };
                $cordovaImagePicker.getPictures(options).then(function(results) {
                    $scope.$parent.user.headPhotoUrl = results[0];
                    currUserService.headPhotoUrl = results[0];
                    //alert(results[0]);
                    uploadPicService.upload(results[0], function(data) {
                    });
                    $scope.cancle();
                }, function(error) {});
                break;
            default:

        }
    };
    
}]);
