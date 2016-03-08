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
yyController.controller('YyAddToCompanyController', ['$scope', '$state', '$timeout', 'User', 'Institutions', 'ToastService', function($scope, $state, $timeout, User, Institutions, ToastService) {
    $scope.isGetCheckCode = false;
    $scope.addIns = {institutionName: ''};
    $scope.submit = function() {
        Institutions.checkRepeat($scope.addIns.institutionName).then(function() {
            //假设 一切验证好了
            //
            //
            //
            

            var postObj = {
                'insName': $scope.addIns.institutionName
            };
            Institutions.addToInstitution(postObj).then(function(data) {
                if(data.status == yyConfig.codes.errorStatus) {
                    if(data.info == 'repeat') {
                        ToastService.showToast('您已加入该机构，请勿重复加入', 'bottom');
                        return false;
                    }
                }else if(data.status == yyConfig.codes.successStatus) {
                    Institutions.getInstitution().then(function() {
                        $state.go('tab.checkResult');
                    });
                }
            });
        }, function() {
            ToastService.showToast('机构名称错误', 'bottom');
        });
    };
    $scope.getCheckCode = function() {
        $scope.isGetCheckCode = !$scope.isGetCheckCode;
        $timeout(function() {
            $scope.isGetCheckCode = false;
        }, 10000);
    };
    $scope.user = User.user;
}]);

yyController.controller('YyCheckResultController', ['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.submit = function() {
        $state.go('checkResult');
    };
}]);
yyController.controller('YyCreateCompanyController', ['$scope', '$state', 'User', 'Institutions', 'ToastService', function($scope, $state, User, Institutions, ToastService) {
    $scope.user = {
        institutionName: '',
        username: User.user.username,
        email: User.user.email,
        ceilPhone: User.user.ceilPhone  
    };
    $scope.submit = function() {
        var postObj = {
            "name": $scope.user.institutionName,
            "ROUs": angular.toJson(User.institutions.ROUs),
            "jobs": angular.toJson(User.institutions.jobs)
        };

        Institutions.create(postObj).then(function(data) {
            if(data.status == yyConfig.codes.errorStatus) {
                if(data.info == 'repeat') {
                    ToastService.showToast('该名称已经被创建', 'bottom');
                    return false;
                }
            }else if(data.status == yyConfig.codes.successStatus) {
                $state.go('tab.checkResult');
            }
        });
    };
}]);
yyController.controller('YyDepartmentSelectController', ['$scope', '$state', '$http', '$ionicHistory', 'User', 'AccountService', 'Institutions', 'ToastService', function($scope, $state, $http, $ionicHistory, User, AccountService, Institutions, ToastService) {
    $scope.user= {"ROU": User.getRou(User.user.institution.rouId),"rouId": User.user.institution.rouId};

    $scope.departments = angular.fromJson(User.user.institution.ROUs);
    $scope.select = function(selectId) {
        //do something
        var postObj = {
            "rouId": selectId,
            "insId": User.user.institution.insId
        };

        AccountService.update('updRou', postObj).then(function(data) {
            if(data.status == yyConfig.codes.successStatus) {
                angular.extend(User.user.institution, {'rouId': selectId});
                angular.extend(User.user, {'ROU': User.getRou(selectId)});
                User.save(User).then(function() {
                        Institutions.getInstitution();
                        ToastService.showToast('ROU更改成功', 'bottom');
                        $ionicHistory.goBack();
                });
            }
        });

        $scope.user.ROU = User.getRou(selectId);
    };
}]);
yyController.controller('YyEditEmailController', ['$scope', '$state', '$http', 'ToastService', '$ionicHistory', 'currUserService', 'AccountService', 'User', function($scope, $state, $http, ToastService, $ionicHistory, currUserService, AccountService, User) {
    $scope.user = {'email': User.user.email};
    $scope.save = function() {
        if($scope.user.email) {
            var postObj = {
                'email': $scope.user.email
            };
            //正则校验
            
            AccountService.update('updEmail', postObj).then(function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, postObj);
                    User.save(User).then(function() {
                        ToastService.showToast('邮箱更改成功', 'bottom');
                        $ionicHistory.goBack();
                    });
                }
            });
        } else {
            ToastService.showToast('邮箱不能为空', 'bottom');
        }
    };
}]);
yyController.controller('YyEditQQController', ['$scope', '$state', '$http', 'ToastService', '$ionicHistory', 'currUserService', 'AccountService', 'User', function($scope, $state, $http, ToastService, $ionicHistory, currUserService, AccountService, User) {
    $scope.user = {'QQ': User.user.QQ};
    $scope.save = function() {
        if($scope.user.QQ) {
            var postObj = {
                'QQ': $scope.user.QQ
            };
            AccountService.update('updQQ', postObj).then(function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, postObj);
                    User.save(User).then(function() {
                        ToastService.showToast('QQ更改成功', 'bottom');
                        $ionicHistory.goBack();
                    });
                }
            });
        } else {
            ToastService.showToast('QQ不能为空', 'bottom');
        }
       
        
    };
}]);
yyController.controller('YyEditUsernameController', ['$scope', '$state', '$http', '$ionicHistory', 'ToastService', 'currUserService', 'User', 'AccountService', function($scope, $state, $http, $ionicHistory, ToastService, currUserService, User, AccountService) {
    $scope.save = function() {
        if($scope.user.username) {
            var postObj = {
                'username': $scope.user.username
            };
            AccountService.update('updName', postObj).then(function(data) {
                if(data.status == yyConfig.codes.errorStatus) {
                    if(data.info == 'repeat') {
                        ToastService.showToast('该用户已存在', 'bottom');
                        return false;
                    }
                } else if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, postObj);
                    User.save(User).then(function() {
                        ToastService.showToast('名字更改成功', 'bottom');
                        $ionicHistory.goBack();
                    });
                }
            });
        } else {
            ToastService.showToast('名字不能为空', 'bottom');
        }
    };
    $scope.user = {'username': User.user.username};
}]);   
yyController.controller('YyEditUsertelController', ['$scope', '$state', 'ToastService', '$ionicHistory', 'currUserService', 'AccountService', 'User', function($scope, $state, ToastService, $ionicHistory, currUserService, AccountService, User) {
    $scope.user = {'ceilPhone': User.user.ceilPhone};
    $scope.save = function() {
        if($scope.user.ceilPhone) {
            var postObj = {
                'ceilPhone': $scope.user.ceilPhone
            };
            AccountService.update('updCeilPhone', postObj).then(function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, postObj);
                    User.save(User).then(function() {
                        ToastService.showToast('手机号更改成功', 'bottom');
                        $ionicHistory.goBack();
                    });
                }
            });
        } else {
            ToastService.showToast('手机号码不能为空', 'bottom');
        }
       
        
    };
}]);
yyController.controller('YyEditWorkPhoneController', ['$scope', '$state', 'ToastService', '$ionicHistory', 'currUserService', 'AccountService', 'User', function($scope, $state, ToastService, $ionicHistory, currUserService, AccountService, User) {
    $scope.user = {'workPhone': User.user.workPhone};

    $scope.save = function() {
        if($scope.user.workPhone) {
            var postObj = {
                'workPhone': $scope.user.workPhone
            };
            AccountService.update('updWorkPhone', postObj).then(function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, postObj);
                    User.save(User).then(function() {
                        ToastService.showToast('办公号码更改成功', 'bottom');
                        $ionicHistory.goBack();
                    });
                }
            });
        } else {
            ToastService.showToast('办公号码不能为空', 'bottom');
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
yyController.controller('YyFqIndexController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'ToastService', 'currUserService', 'fqListService', function($rootScope, $scope, $state, $http, $timeout, ToastService, currUserService, fqListService) {

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
            ToastService.showToast('刷新成功', 'bottom');
        }, 1000);
    };
    $scope.doFqListRefresh = function() {
        $timeout(function() {
            var _ROUId = fqListService.getObj().ROUSIdSelect;
            refreshFq(_ROUId);
            $scope.$broadcast('scroll.refreshComplete');
            ToastService.showToast('刷新成功', 'bottom');
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

yyController.controller('YyLoginController', ['$scope', '$state', 'currUserService', 'ToastService', '$ionicHistory', 'StorageService', 'User', 'AccountService', function($scope, $state, currUserService, ToastService, $ionicHistory, StorageService, User, AccountService) {
    // $scope.username = 'Rookie_wan';
    // $scope.password = '123456';
    // $scope.userPhoto = 'upload/user-header.png';
    var userPhoto;

    //获取用户头像
    $scope.$watch('username', function(nValue) {
        AccountService.login({username: nValue}).then(function(currUser) {
            if(currUser) {
                userPhoto = yyConfig.urls.imgUploadUrl + currUser.headPhotoUrl;
            }
            $scope.userPhoto = userPhoto;
        }, function() {
            userPhoto = 'upload/user-header.png';
            $scope.userPhoto = userPhoto;
        });
    });

    // 验证用户名密码
    $scope.validateUser = function() {

        AccountService.login({username: $scope.username}).then(function(currUser) {

            if($scope.password == currUser.password) {
                angular.extend(User.user, currUser);
                User.save(User).then(function() {
                    ToastService.showToast('登录成功', 'bottom');
                    $state.go('tab.user');
                });
                
            } else if($scope.password != currUser.password){
                ToastService.showToast('密码错误', 'bottom');
            }
        },function() {
            ToastService.showToast('该用户不存在', 'bottom');
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
        StorageService.get('user').then(function(data) {
            //data.user != undefined
            //console.log(!!data.user);
            if(!!data.user) {
                angular.extend(User.user, data.user);
                User.save(User).then(function() {
                    $state.go('tab.user');
                });
            }
        });
    }
}]);

yyController.controller('YyMessageBoxController', ['$scope', '$state', '$stateParams', '$http', '$timeout', 'ToastService', function($scope, $state, $stateParams, $http, $timeout, ToastService) {

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
            ToastService.showToast('刷新成功', 'bottom');
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
yyController.controller('YyMyCompanyController', ['$scope', '$state', 'ToastService', 'AccountService', 'Institutions', 'User', function($scope, $state, ToastService, AccountService, Institutions, User) {

    $scope.createCompany = function() {
        $state.go('tab.createCompany');
    };
    $scope.jionOthers = function() {
        $state.go('tab.addToCompany');
    };
    $scope.select = function(insId) {
        if(insId == User.user.institutionId) {
            return;
        }
        //变更机构信息
        var postObj = {'institutionId': insId};
        AccountService.update('updInstitutionId', postObj).then(function(data) {
            if(data.status == yyConfig.codes.successStatus) {
                AccountService.changeInstitution(insId).then(function() {
                    console.log(User.user);
                    ToastService.showToast('机构切换成功', 'bottom');
                });
            }
        });
        
    };

    Institutions.getInstitution().then(function() {
        $scope.institutions = User.institutions;
        $scope.user = {"insId": User.user.institution.insId};
    });
}]);
yyController.controller('YyMyFqController', ['$scope', '$state', '$http', '$timeout', 'ToastService', function($scope, $state, $http, $timeout, ToastService) {

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
            ToastService.showToast('刷新成功', 'bottom');
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
yyController.controller('YyMyPasswordController', ['$scope', '$state', '$ionicHistory', 'currUserService', 'ToastService', 'AccountService', 'User', function($scope, $state, $ionicHistory, currUserService, ToastService, AccountService, User) {

    $scope.pwd = {
        'oldPassword': '',
        'newPassword': '',
        'reNewPassword': ''
    };
    $scope.save = function() {
        if(User.user.password != $scope.pwd.oldPassword) {
            ToastService.showToast('密码错误', 'bottom');
            return false;
        } else if($scope.pwd.newPassword != $scope.pwd.reNewPassword || $scope.pwd.newPassword == '') {
            ToastService.showToast('两次输入密码不一致', 'bottom');
            return false;
        } else {
            var pwdObj = {
                'oldPwd': $scope.pwd.oldPassword,
                'newPwd': $scope.pwd.newPassword
            };
            AccountService.update('updPwd', pwdObj).then(function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, {'password': $scope.pwd.newPassword});
                    User.save(User).then(function() {
                        ToastService.showToast('修改成功', 'bottom');
                        $ionicHistory.goBack();
                    });
                }
                return false;
            });
        }

        // success
    };
}]);
yyController.controller('YyMyRoleController', ['$scope', '$state', 'ToastService', '$ionicHistory', 'currUserService', 'AccountService', 'User', 'Institutions', function($scope, $state, ToastService, $ionicHistory, currUserService, AccountService, User, Institutions) {

    $scope.user = {roles: angular.fromJson(User.user.institution.roles), roleId: User.user.institution.roleId};
    $scope.changeRole = function(roleId, roleName) {
        var postObj = {
            'roleId': roleId,
            'insId': parseInt(User.user.institutionId)
        };
        AccountService.update('updRole', postObj).then(function(data) {
            if(data.status == yyConfig.codes.successStatus) {
                angular.extend(User.user.institution, {'roleId': roleId});
                angular.extend(User.user, {'role': roleName});
                User.save(User).then(function() {
                        Institutions.getInstitution();
                        ToastService.showToast('角色更改成功', 'bottom');
                        $ionicHistory.goBack();
                });
            }
        });
    };
}]);
yyController.controller('YyMySexController', ['$scope', '$state', 'ToastService', '$ionicHistory', 'currUserService', 'AccountService', 'User', function($scope, $state, ToastService, $ionicHistory, currUserService, AccountService, User) {
    $scope.sex = User.user.sex;
    $scope.changeSex = function(sex) {
        var postObj = {
            'sex': sex == '女' ? 1 : 0
        };
        AccountService.update('updSex', postObj).then(function(data) {
            if(data.status == yyConfig.codes.successStatus) {
                angular.extend(User.user, {'sex': sex});
                User.save(User).then(function() {
                    ToastService.showToast('性别更改成功', 'bottom');
                    $ionicHistory.goBack();
                });
            }
        });
        updService.upd('updSex', postObj, function(data) {

            
        });
    };
}]);
yyController.controller('YyNewsIndexController', ['$scope', '$state', '$http', '$timeout', 'ToastService', function($scope, $state, $http, $timeout, ToastService) {
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
            ToastService.showToast('刷新成功', 'bottom');
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
yyController.controller('YyRegController', ['$scope', '$state', '$timeout', '$http', '$interval', 'ToastService', function($scope, $state, $timeout, $http, $interval, ToastService) {
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
                    ToastService.showToast('该用户已存在', 'bottom');
                    return false;
                }
            } else if(data.status == yyConfig.codes.successStatus) {
                console.log('success');
                $timeout(function() {
                    //more codes
                    $state.go('login');
                }, 1000);
                ToastService.showToast('注册成功', 'bottom');
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

yyController.controller('YyUserController', ['$scope', '$state', '$stateParams', '$ionicGesture', 'getCurrUserService', 'currUserService', 'User', 'ProfileService', 'Institutions', function($scope, $state, $stateParams, $ionicGesture, getCurrUserService, currUserService, User, ProfileService, Institutions) {
    var userId;
    if($stateParams.userId) {
        userId = $stateParams.userId;
    }



    //$scope.sex = currUserService.sex == undefined ? null : (currUserService.sex == '男' ? '♂' : '♀');

    $scope.$on('$ionicView.loaded', function(scope, states) {
        //临时
        //currUserService.set({'id': '0'});
        ProfileService.get().then(function(data) {
                $scope.user = User.user;
                if(User.user.institutionId != null) {
                    Institutions.getInstitution(User.user.institutionId).then(function() {
                        $scope.user.institutionName = User.user.institution.name;
                        console.log(User);
                    });
                }
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

yyController.controller('YyUserInfoController', ['$scope', '$state', 'currUserService', 'ToastService', 'User', 'AccountService', function($scope, $state, currUserService, ToastService, User, AccountService) {

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

    $scope.user = User.user;
    console.log(User.user);
    $scope.user.role = User.getRole(User.user.institution.roleId);
    $scope.user.ROU = User.getRou(User.user.institution.rouId);
    console.log(User.user);
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
    $scope.editEmail = function() {
        $state.go('tab.editEmail')
    };
    $scope.myRole = function() {
        $state.go('tab.myRole');
    };
    $scope.editQQ = function() {
        $state.go('tab.editQQ');
    };
    $scope.editWorkPhone = function() {
        $state.go('tab.editWorkPhone');
    };
    $scope.departmentSelect = function() {
        $state.go('tab.departmentSelect');
    };
    $scope.selectDate = function() {
        var options = {
            date: new Date(),
            mode: 'date'
        };
         
        function onSuccess(date) {
            var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1));
            var day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate());
            var birthday = date.getFullYear() + '-' + month  + '-' + day;

            var postObj = {
                birthday: birthday
            };
            AccountService.update('updBirthday', postObj).then(function(data) {
                if(data.status == yyConfig.codes.successStatus) {
                    angular.extend(User.user, postObj);
                    User.save(User).then(function() {
                        ToastService.showToast('生日修改成功', 'bottom');
                    });
                }
            });
        }
         
        function onError(error) { // Android only 
            alert('Error: ' + error);
        }
         
        datePicker.show(options, onSuccess, onError);
    };

}]);
yyController.controller('YyWgtPopupController', ['$scope', '$state', '$http', '$timeout', 'User', 'AccountService', function($scope, $state, $http, $timeout, User, AccountService) {
    $scope.cancle = function() {
        $scope.$parent.isPopOpen = false;
        $scope.$parent.comPop = false;
        $scope.$parent.newVersion = false;
    };
    $scope.ok = function(optName) {
        console.log(optName);
        switch(optName) {
            case 'loginOut':
                AccountService.logout();
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
