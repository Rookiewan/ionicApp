var yyServices = angular.module('yyApp.services', ['ngResource']);

yyServices.factory('pop', function() {
    return {
        'isPop': false
    };
});

yyServices.factory("getUserInfosService", function($http) {
    var user = {
        "No": "001",
        "userName": "zhangsan",
        "password": "123456",
        "age": 18,
        "sex": "男"
    };
    return user;
});

yyServices.factory("getUserInfosService001", function($http) {
    var timeStamp = new Date().valueOf();
    var a = $http.get("data/users-info.json?timeStamp=" + timeStamp);

    return a;
});

yyServices.factory('getUserInfosServiceCwf', function($http) {
    var timeStamp = new Date().valueOf();
    var rst = $http.get("data/users-info.json?timeStamp=" + timeStamp).$$state;
    return rst;
});
// 注册的新用户,新用户的信息如下
/*
  1.userName
  2.mobilePhone
  3.userEmail
  4.password
*/
yyServices.factory("regUsersService", function($http) {
    var usersList = [];
    var user = {
        "userName": "",
        "mobilePhone": "",
        "userEmail": "",
        "password": "",
    };
    usersList.addNewUser = function(user) {
        // 设置用户信息
        user.setInfo = function(user) {
            this.userName = user.userName;
            this.mobilePhone = user.mobilePhone
            this.userEmail = user.userEmail
            this.password = user.password
        }
        usersList.push(user);
    };


    return usersList;
});

yyServices.factory("loginUserService", function() {
    var theUser = {
        "userName": "",
        "mobilePhone": "",
        "userEmail": "",
        "password": ""
    };
    // 获得登陆用户的个体
    theUser.setTheUser = function(theUser) {
        this.userName = theUser.userName;
        this.mobilePhone = theUser.mobilePhone;
        this.userEmail = theUser.userEmail;
        this.password = theUser.password;
        this.sex = theUser.sex;
    };
    theUser.getTheUser = function(theUser) {
        return this;
    };
    return theUser;
})

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
        console.log(yyConfig.urls.baseUrl + 'A=getUserInfo&userId=' + currUserService.id);
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
yyServices.factory('updService', ['$http', 'currUserService', function($http, currUserService){
    return {
        upd: function(opt, postObj, callbackData) {
            console.log(currUserService);
            $http({
                method: 'POST',
                url: yyConfig.urls.baseUrl + 'A=' + opt + '&userId=' + currUserService.userId,
                params: {
                    'postdata': postObj
                }
            }).success(function(data) {
                callbackData(data);
            });
        }
    };
}]);
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