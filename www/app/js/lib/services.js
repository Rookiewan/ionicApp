var yyServices = angular.module('yyApp.services', ['ngResource']);

yyServices.factory('pop', function() {
    return {
        'isPop': false
    };
});


//cwf

yyServices.factory('currUserService', ['$resource', '$http', function($resource, $http) {


    var currUser = {
    };
    currUser.set = function(obj) {
        console.log('--------------');
        console.log(obj);
        var key;
        for(key in obj) {
            currUser[key] = obj[key];

        }
    };
    /*currUser.get = function() {
        return currUser;
    };*/
    return currUser;
}])

yyServices.factory('getCurrUserService', ['$resource', '$http', 'currUserService', function($resource, $http, currUserService) {

    return {
      getInfo: function(callbackData) {
        var timeStamp = new Date().valueOf();
        $http.get(yyConfig.urls.baseUrl + 'A=getUserInfo&userId=' + currUserService.id +'&timeStamp=' + timeStamp).success(function(data) {
            if(data.headPhotoUrl == '') {
                data.headPhotoUrl = yyConfig.urls.imgUploadUrl + 'upload/user-header.png';
            } else {
                data.headPhotoUrl = yyConfig.urls.imgUploadUrl + data.headPhotoUrl;
            }

            data.sex = data.sex == 0 ? '男': '女';
            switch(data.role) {
                case '0':
                    data.role = '队长';
                    break;
                case '1':
                    data.role = '教练';
                    break;
                case '2':
                    data.role = '管理员';
                    break;
                default:
                    data.role = '队员';
            }
            callbackData(data);
        }).error(function(data) {
            console.log('error' + data);
        });
      }
    };
}])
yyServices.factory('sendFqService', ['$http', function($http) {
    var sendFq = {};
    return {
        sendFq: sendFq,
        setInfo: function(obj, callbackData) {
            if(typeof obj != 'object') {
                return false;
            }
            var key, value;
            for(key in obj) {
                sendFq[key] = obj[key];
            }
            callbackData(sendFq);
        },
        clear: function(callback) {
            var key, value;
            for(key in sendFq) {
                sendFq[key] = undefined;
            }
            if(typeof arguments[0] == 'function') {
                callback(sendFq);
            }
        }
    };
}]);

yyServices.factory('fqListService', ['$http', function() {
    var fqList = {
        ROUSIdSelect: 1
    };
    return {
        getObj: function() {
            return fqList;
        },
        setInfo: function(obj, callbackData) {
            if(typeof obj != 'object') {
                return false;
            }
            var key, value;
            for(key in obj) {
                fqList[key] = obj[key];
            }
            callbackData(fqList);
        },
    };
}]);

yyServices.factory('uploadPicService', ['$http', function(){
    return {
        upload: function(picUrl, callbackData) {

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = picUrl.substr(picUrl.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            var params = new Object();
            options.params = params;
            options.chunkedMode = false;


            var ft = new FileTransfer();
            ft.upload(picUrl, yyConfig.urls.baseUrl + 'A=upload', function(data) {
                //alert(data + '');
                var resp = JSON.parse(data.response);
                alert(resp);
                callbackData(data);
            }, function(error) {
                alert(error);
            }, options);
        }
    };
}])

/*
    toast
 */

yyServices.factory('ToastService', ['$cordovaToast', function($cordovaToast) {
    return {
        showToast: function(content, pos) {
            console.log(content);
            // try {
            //     $cordovaToast.show(content, 'short', pos);
            // }catch(error) {
            //     console.log(content);
            // }
        }
    };
}]);
/*
    user
 */
yyServices.factory('User', ['$q', 'StorageService', function($q, StorageService) {
    var user = {
        user: {},
        fq: {},
        institutions: {
            ROUs: [
                {"id": 1,"name": "战略规划ROU"},
                {"id": 2,"name": "经营云规划ROU"},
                {"id": 3,"name": "行政综合服务ROU"},
                {"id": 4,"name": "财务服务ROU"},
                {"id": 5,"name": "运营ROU"},
                {"id": 6,"name": "用户学院ROU"},
                {"id": 7,"name": "战略合作与服务ROU"},
                {"id": 8,"name": "中小学渠道与服务ROU"},
                {"id": 9,"name": "中高职与服务ROU"},
                {"id": 10,"name": "互动电影ROU"},
                {"id": 11,"name": "应用产品ROU"},
                {"id": 12,"name": "移动产品ROU"},
                {"id": 13,"name": "技术支撑ROU"},
                {"id": 14,"name": "视觉设计ROU"},
                {"id": 15,"name": "前端设计ROU"},
                {"id": 16,"name": "质保ROU"},
                {"id": 17,"name": "产品专业委员会"},
                {"id": 18,"name": "技术委员会"},
                {"id": 19,"name": "项目管理委员会"}
            ],
            roles: [
                {"id": 1,"name": "管理员"},
                {"id": 2,"name": "队员"},
                {"id": 3,"name": "队长"},
                {"id": 4,"name": "教练"}
            ],
            msgType: [
                {"id": 1,"name": "notice","icon": "icon-msgbox-notice"},
                {"id": 2,"name": "birthday","icon": "icon-msgbox-birthday"}
            ],
            myCreate: [],
            myIn: []
        }
    };

    user.save = function(newUser) {
        var userDefer = $q.defer();
        angular.extend(user, newUser);
        StorageService.save('user', user).then(function() {
            userDefer.resolve();
        });
        
        return userDefer.promise;
    };
    user.clear = function() {
        var userDefer = $q.defer();
        user = {};
        StorageService.save('user', user).then(function() {
            userDefer.resolve();
        });

        return userDefer.promise;
    };
    user.getRole = function(roleId) {
        var isFind = false;
        var roleName = '';
        var searchArea;

        if(typeof(arguments[1]) == 'object') {
            searchArea = arguments[1];
        } else {
            searchArea = user.user.institution.roles;
        }
        angular.forEach(angular.fromJson(searchArea), function(role) {
            if(!isFind) {
                if(role.id == roleId) {
                    roleName = role.name;
                    isFind = true;
                }
            }
        });
        return roleName;
    };
    user.getRou = function(RouId) {
        var isFind = false;
        var RouName = null;
        var searchArea;
        if(typeof(arguments[1]) == 'object') {
            searchArea = arguments[1];
        } else {
            searchArea = user.user.institution.ROUs;
        }
        angular.forEach(angular.fromJson(searchArea), function(Rou) {
            if(!isFind) {
                if(Rou.id == RouId) {
                    RouName = Rou.name;
                    isFind = true;
                }
            }
        });
        return RouName;
    };
    return user;
}]);
/*
    account
 */
yyServices.factory('AccountService', ['$http', '$q', '$timeout', 'User', 'Institutions', 'Msg', 'Fq', function($http, $q, $timeout, User, Institutions, Msg, Fq) {
    var o ={};

    o.login = function(loginUser) {
        var dtd = $q.defer();
        var hasUser = false;
        $http.get(yyConfig.urls.baseUrl + 'A=getUserLogin').success(function(userInfos) {
            var currUser;
            angular.forEach(userInfos, function(user) {
                if(loginUser.username==user.username){
                    hasUser = true;
                    currUser = user;
                    return;
                }
            });
            if(hasUser) {
                dtd.resolve(currUser);
            } else {
                dtd.reject();
            }
        }).error(function(data) {
            console.log('error' + data);
        });

        return dtd.promise;
    };

    o.update = function (opt, postObj) {
        var dtd = $q.defer();
        $http({
            method: 'POST',
            url: yyConfig.urls.baseUrl + 'A=' + opt + '&userId=' + User.user.userId,
            data: postObj,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            dtd.resolve(data);
        });

        return dtd.promise;
    };

    o.logout = function() {
        return User.clear();
        
    };
    o.changeInstitution = function(insId) {
        var myAllInstitutions = [];
        var dtd = $q.defer();

        //合并数组
        myAllInstitutions = User.institutions.myCreate.concat(User.institutions.myIn);

        angular.forEach(myAllInstitutions, function(institution) {
            if(parseInt(institution.createStatus) === 1 && institution.id == insId) {

                //改变机构时 切换角色\职务
                var roleName = User.getRole(institution.roleId);

                angular.extend(User.user, {"institutionId": insId,"institutionName": institution.name, "institution": institution, "role": roleName});
                Msg.getMsg().then(function() {
                    User.save(User).then(function() {
                        console.log(User);
                        dtd.resolve();
                    });
                });
                
                //return;  
            }
        });
        return dtd.promise;
    };
    o.getPersonsByRouId = function() {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getPersonsByRouId&insId=' + User.user.institution.insId + '&rouId=' + Fq.send.receiveRouId).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;
    };
    return o;
}]);

/*
    profile
 */
yyServices.factory('ProfileService', ['$q', '$http', 'User', function($q, $http, User){
    var o = {};
    o.get = function() {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getUserInfo&userId=' + User.user.id).success(function(data) {
            if(data.headPhotoUrl == '') {
                data.headPhotoUrl = yyConfig.urls.imgUploadUrl + 'upload/user-header.png';
            } else {
                data.headPhotoUrl = yyConfig.urls.imgUploadUrl + data.headPhotoUrl;
            }
            data.sex = data.sex == 0 ? '男': '女';
            User.save(User).then(function() {
                angular.extend(User.user, data);
                User.save(User).then(function() {
                    dtd.resolve(data);
                });
            });
            
            return dtd.promise;

            
        }).error(function(data) {
            console.log('error' + data);
        });

        return dtd.promise;
    };
    return o;
}])
/*
    localStorage
 */
yyServices.factory('StorageService', ['$q', function($q) {
    return {
        save: function(name, obj) {
            var StorDefer = $q.defer();
            var objJson = angular.toJson(obj);
            localStorage.setItem(name, objJson);
            StorDefer.resolve();
            return StorDefer.promise;
        },
        get: function(name) {
            var StorDefer = $q.defer();
            var _json = localStorage.getItem(name);
            var obj = angular.fromJson(_json);
            StorDefer.resolve(obj);

            return StorDefer.promise;
        }
    };
}]);

/*
    fq
 */

yyServices.factory('Fq', ['$q', '$http', 'User', function($q, $http, User){
    var o = {
        mySend: [],
        myReceive: [],
        fqs: [],
        fqIndexCount: 4,
        fqMyCount: 5,
        selectedRouId: 1,
        send: {
            receiveRouId: null,
            receiveId: null,
            receiveName: null
        }
    };

    o.getInsFq = function(pageIndex) {
        var dtd = $q.defer();

        $http.get(yyConfig.urls.baseUrl + 'A=getInsFq&insId=' + User.user.institution.insId + '&pageIndex=' + pageIndex + '&fqIndexCount=' + o.fqIndexCount + '&rouId=' + o.selectedRouId).success(function(data) {
            dtd.resolve(data);
        }).error(function(data) {
            console.log('error' + data);
        });

        // $http.get(yyConfig.urls.baseUrl + 'A=getInsFq').success(function(Fqs) {
        //     var currUser;
        //     angular.forEach(userInfos, function(user) {
        //         if(loginUser.username==user.username){
        //             hasUser = true;
        //             currUser = user;
        //             return;
        //         }
        //     });
        //     if(hasUser) {
        //         dtd.resolve(currUser);
        //     } else {
        //         dtd.reject();
        //     }
        // }).error(function(data) {
        //     console.log('error' + data);
        // });
        return dtd.promise;
    };
    o.getMyFq = function(pageIndex) {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getMyFq&insId=' + User.user.institution.insId + '&pageIndex=' + pageIndex + '&fqMyCount=' + o.fqMyCount + '&rouId=' + o.selectedRouId + '&userId=' + User.user.id).success(function(data) {
            var _a = {
                'hasNewReceive': false,
                'hasNewSend': false
            }
            angular.forEach(data, function(oneFq) {

                oneFq.img = yyConfig.urls.imgUploadUrl + oneFq.img;
                oneFq.time = oneFq.time.substring(0, 10);

                if(oneFq.sendId == User.user.id) {
                    o.mySend.push(oneFq);
                    _a.hasNewSend = true;
                } else if(oneFq.receiveId == User.user.id) {
                    o.myReceive.push(oneFq);
                    _a.hasNewReceive = true;
                }
            });
            dtd.resolve(_a);
        });
        return dtd.promise;
    };
    o.sendFq = function(postObj) {
        var dtd = $q.defer();
        $http({
            method: 'post',
            url: yyConfig.urls.baseUrl + 'A=sendFq&userId=' + User.user.userId + '&insId=' + User.user.institution.insId + '&receiveId=' + o.send.receiveId + '&receiveRouId=' + o.send.receiveRouId,
            data: postObj,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;
    };
    o.getFqDetail = function(id) {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getFqDetail&fqId=' + id).success(function(data) {
            var oneFq = data[0];
            oneFq.img = yyConfig.urls.imgUploadUrl + oneFq.img;
            oneFq.senderImg = yyConfig.urls.imgUploadUrl + oneFq.senderImg;

            oneFq.RouName = User.getRou(oneFq.senderRouId);

            o.getFqReply(id).then(function(replys) {
                oneFq.replys = replys;
                dtd.resolve(oneFq);
            });

            
        });
        // var searchArr = o.mySend.concat(o.myReceive);
        // console.log(searchArr);
        // angular.forEach(searchArr, function(oneFq) {
        //     if(oneFq.id == id) {
        //         dtd.resolve(oneFq);
        //     }
        // });
        return dtd.promise;
    };
    o.getFqReply = function(id) {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getFqReply&fqId=' + id).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;
    };
    return o;
}])

/*
    institutions
 */
yyServices.factory('Institutions', ['$q', '$http', 'User', 'Msg', function($q, $http, User, Msg){
    var o = {
        myCreate: [],
        myIn: []
    };

    o.create = function (postObj) {
        var dtd = $q.defer();
        $http({
            method: 'post',
            url: yyConfig.urls.baseUrl + 'A=createInstitution&userId=' + User.user.userId,
            data: postObj,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;
    };

    o.getInstitution = function() {
        var dtd = $q.defer();
        if(arguments[0]) {
            var insId = arguments[0];
            $http.get(yyConfig.urls.baseUrl + 'A=getInstitutionByInsId&userId=' + User.user.userId + '&insId=' + insId).success(function(data) {

                var roleName = User.getRole(data.roleId, angular.fromJson(data.roles));
                //angular.extend(User.user, {"institution": data, "role": roleName});
                angular.extend(User.user, {"institution": data});
                console.log(data);
                Msg.getMsg().then(function() {
                    User.save(User).then(function() {
                        dtd.resolve(); 
                    });
                });
                
            });
        } else {
            $http.get(yyConfig.urls.baseUrl + 'A=getInstitution&userId=' + User.user.userId).success(function(data) {
                var myCreate = [];
                    myIn = [];
                angular.forEach(data, function(insititution) {
                    if(insititution.createUserId == User.user.userId) {

                        myCreate.push(insititution);
                        //User.institutions.myCreate.push(insititution);
                    } else {
                        myIn.push(insititution);
                        //User.institutions.myIn.push(insititution);
                    }
                });
                User.institutions.myCreate = [];
                User.institutions.myIn = [];

                angular.extend(User.institutions.myCreate, myCreate);
                angular.extend(User.institutions.myIn, myIn);

                angular.extend(o.myCreate, myCreate);
                angular.extend(o.myIn, myIn);

                User.save(User).then(function() {
                   dtd.resolve(); 
                });
            });
        }
        return dtd.promise;
    };

    o.checkRepeat = function(institutionName) {
        var dtd = $q.defer();

        $http.get(yyConfig.urls.baseUrl + 'A=checkInsRepeat&insName=' + institutionName).success(function(data) {
            if(data.length) {
                dtd.resolve();
            } else {
                dtd.reject();
            }
        });

        return dtd.promise;
    };
    o.addToInstitution = function(postObj) {
        var dtd = $q.defer();

        $http({
            method: 'POST',
            url: yyConfig.urls.baseUrl + 'A=addToInstitution&userId=' + User.user.userId,
            data: postObj,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;

    };
    return o;
}]);

/*
    msg
 */
yyServices.factory('Msg', ['$q', '$http', 'User', function($q, $http, User){
    var o = {
        msgs: {}
    };
    o.getMsg = function() {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getMsg&userId=' + User.user.userId + '&insId=' + User.user.institution.id).success(function(data) {
            var msgtype = angular.fromJson(User.user.institution.msgType);
            var msg = {};

            angular.forEach(msgtype, function(oneMsgtype) {
                    msg[oneMsgtype.id] = {};
                    msg[oneMsgtype.id].icon = oneMsgtype.icon;
                    msg[oneMsgtype.id].name = oneMsgtype.name;
                    msg[oneMsgtype.id].msgs = [];
                    msg[oneMsgtype.id].unReadNum = 0;
            })
            angular.forEach(data, function(oneMsg) {
                if(oneMsg.isRead == 0) {
                    msg[oneMsg.typeId].unReadNum++;
                }
                msg[oneMsg.typeId].msgs.push(oneMsg);
                angular.extend(msg[oneMsg.typeId], oneMsg);
            });
            console.log(msg);
            // angular.forEach(data, function(oneMsg) {
            //     angular.forEach(msgtype, function(oneMsgtype) {
            //         if(oneMsgtype.id == oneMsg.typeId) {
            //             msg[oneMsgtype.typeId] = [];
            //             oneMsg.typeName = oneMsgtype.name;
            //             oneMsg.icon = oneMsgtype.icon;
            //             msg.push(oneMsg);
            //         }
            //     });
            // });
            //var date = new Date(msg[0].time);
            //if() 需要判断 与当前时间的关系
            //console.log(date.getHours());
            angular.extend(User.user, {'msg': msg});
            o.msgs = msg;
            dtd.resolve();
        });
        return dtd.promise;
    };

    o.setMsgTop = function() {
        angular.forEach(User.user.msg, function(msg) {
            if(msg.typeId == o.selectedTypeId) {
                msg.typeTopId = -2;
            }
        });
        console.log(User.user.msg);
    }
    o.setSelectedTypeId = function(typeId) {
        o.selectedTypeId = typeId;
    };
    return o;
}])

/**
 * news
 */
yyServices.factory('News', ['$q', '$http', 'User', function($q, $http, User){
    var o = {
        maxCounts: 4,
        sumNews: []
    };

    o.getNews = function(pageIndex) {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=getNews&insId=' + User.user.institution.insId + '&pageIndex=' + pageIndex + '&maxCounts=' + o.maxCounts).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;
    };
    o.readNews = function() {
        var dtd = $q.defer();
        $http.get(yyConfig.urls.baseUrl + 'A=readNews&insId=' + User.user.institution.insId).success(function(data) {
            dtd.resolve(data);
        });
        return dtd.promise;
    };
    o.getNewsById = function(id) {
        var dtd = $q.defer();
        angular.forEach(o.sumNews, function(oneNews) {
            if(oneNews.id == id) {
                dtd.resolve(oneNews);
            }
        });
        return dtd.promise;
    };
    return o;
}])
/*yyServices.factory('helpTools', ['$q', function($q){
    var o = {};
    //searchFormObj
    //searchConObj {key: value}
    o.SFO = function(searchObj, searchConObj) {
        var key = searchConObj
    };
    return o;
}])*/