
var app = angular.module('myapp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'view/main.html',
            controller: 'mainController'
        })

        .when('/login', {
            templateUrl: 'view/login.html',
            controller: 'loginController'
        })

        .when('/registration', {

            templateUrl: 'view/register.html',
            controller: 'registrationController'
        })

        .when('/postjob', {

            templateUrl: 'view/postjob.html',
            controller: 'postjobController',
            
        })

        .when('/searchjob', {

            templateUrl: 'view/searchjob.html',
            controller: 'searchjobController',
            
        })

        .when('/company', {

            templateUrl: 'view/company.html',
            controller: 'companyController',
           
        })

        .when('/jobseeker', { 

            templateUrl: 'view/jobseeker.html',
            controller: 'jobseekerController',
            
        })

        .when('/logout', {

            templateUrl: 'view/main.html',
            controller: 'logoutController'
        })

        .otherwise({

            templateUrl: 'view/error.html'
        });
});



//
app.controller("indexController", function ($scope) {

    $scope.$on('main', (event, obj) => {
        $scope.login = true;
        $scope.register = true;
        $scope.addjob = false;
        $scope.search = false;
        $scope.logout = false;
    });

    $scope.$on('login', (event, obj) => {
        $scope.login = true;
        $scope.register = true;
        $scope.addjob = false;
        $scope.search = false;
        $scope.logout = false; 
    });

    $scope.$on('register', (event, obj) => {

        $scope.login = true;
        $scope.register = true;
        $scope.addjob = false;
        $scope.search = false;
        $scope.logout = false;

        console.log(obj);
    });

    $scope.$on('jobseeker', (event, obj) => {
        $scope.login = false;
        $scope.register = false;
        $scope.addjob = false;
        $scope.search = true;
        $scope.logout = true;
    });

    $scope.$on('company', (event, obj) => {
        $scope.login = false;
        $scope.register = false;
        $scope.addjob = true;
        $scope.search = false;
        $scope.logout = true;
    });

    $scope.$on('search', (event, obj) => {
        $scope.login = false;
        $scope.register = false;
        $scope.addjob = false;
        $scope.search = true;
        $scope.logout = true;
    });

    $scope.$on('addjob', (event, obj) => {
        $scope.login = false;
        $scope.register = false;
        $scope.addjob = true;
        $scope.search = false;
        $scope.logout = true;
    });

});



//Factory Service
app.factory("authService", function($location) {
   return{
       checkUserStatus:function(){
           //console.log('checked');
           if(sessionStorage.loggedIn=="false"){
               $location.url("/login");
           }
       }
   }
});



//MainController
//

app.controller("mainController", function ($scope) {
   
        $scope.$emit('main', {});
    

});



//Register
//-

app.controller('registrationController', function ($scope, $http, $location) {

    $scope.$emit('register', {});
    //$scope.loggedIn = false;

    $scope.register = function () {
        $http.post("http://localhost:3000/register", {registerform: $scope.registerform})
        .then(function (res) {
            if (res.data == true) {
                console.log('registered successful');
                $location.url("/login");
            } 
            else {
                alert("registration failed");
            }
        })
        .catch(() => {
            console.log("reg request failed");
        });
    };
});





//LOGIN
//
app.controller('loginController', function ($scope,$http,$location) {

    $scope.$emit('login', {});
    
    $scope.login = function () {
        $http.post("http://localhost:3000/login", {loginform: $scope.loginform})
        .then(function (res) {
                sessionStorage.loggedIn = true;
                sessionStorage.username = res.data.username;
                if (res.data.usertype == "Company") {
                    sessionStorage.usertype = "company";
                    console.log("Registered as Company");
                    $location.url("/company");
                }
                else if (res.data.usertype == "Job seeker") {
                    sessionStorage.usertype = "jobseeker";
                    console.log("Registered as Job seeker");
                    $location.url("/jobseeker");
                }
            })
            .catch(() => {
                console.log("login request failed");
            });
    };
});




//COMPANY
//
app.controller('companyController', function (authService, $scope, $http) {
    authService.checkUserStatus();
    $scope.$emit('company', {});

    $http.get("http://localhost:3000/jobs")
    .then(function (res) {
        //console.log(res.data);
        $scope.jobs = res.data;
    });
    
});





//POST JOB
app.controller('postjobController', function (authService,$scope,$http,$location) {

    authService.checkUserStatus();
    $scope.$emit('addjob', {});

    $scope.postJob = function () {
        $http.post("http://localhost:3000/postjob",{postjob: $scope.jobform})
        .then(function (res) {
            if (res.data==true) {
                //console.log(res.data);
                $location.url("/company");
            }
            else{
                alert("post failed");
            }
        })
        .catch(() => {
            console.log("post failed");
        });
    };

});




//JOBSEEKER
//-
app.controller('jobseekerController', function ($scope,$http,authService) {
    authService.checkUserStatus();
    $scope.$emit('jobseeker', {});
    $scope.username = sessionStorage.username;
    
    $http.get(`http://localhost:3000/users/${$scope.username}`)
    .then(function (res) {
        $scope.user = res.data;
    });


    $http.get("http://localhost:3000/jobs")
    .then(function (res) {
        //console.log(res);
        $scope.jobs = res.data;
    });



    //saving the job
    $scope.save = function (event) {
        var id = event.target.id;
        // console.log(id);
        // console.log($scope.username);
        $http.get(`http://localhost:3000/save/${id}/${$scope.username}`)
        .then(function (res) {
                console.log(res.data);
                $scope.user = res.data;    
        })
        .catch((err) => {
            console.log(err);
        })

    }



    //applying for job
    $scope.apply = function (event) {
        var id = event.target.id;
        $scope.username = sessionStorage.username;
        $http.get(`http://localhost:3000/apply/${id}/${$scope.username}`)
        .then(function (res) {
            $scope.user = res.data;
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        })

    }

});





//SEARCH JOB
//
app.controller('searchjobController', function ($scope, $http, authService) {
    authService.checkUserStatus();
    $scope.$emit('search', {});
    $scope.username = sessionStorage.username;
    

    //search
    $scope.search = function () {
        $scope.search.title==""?$scope.search.title=undefined:$scope.search.title=$scope.search.title;
        $scope.search.keyword==""?$scope.search.keyword=undefined:$scope.search.keyword=$scope.search.keyword;
        $scope.search.location==""?$scope.search.location=undefined:$scope.search.location=$scope.search.location;
        
        $http.get(`http://localhost:3000/search/${$scope.search.title}/${$scope.search.keyword}/${$scope.search.location}`).then(function(res){
            $scope.jobs = res.data;
        }).catch(err=>console.log(err))
    }



    //Saved jobs
    $scope.getSavedJobs = function (event) {
        $http.get(`http://localhost:3000/savedjobs/${$scope.username}`)
        .then(function (res) {
            if (res.data) {
                console.log(res.data);
                $scope.jobs = res.data;
                   
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }



    //Applied jobs
    $scope.getAppliedJobs = function (event) {
        $http.get(`http://localhost:3000/appliedjobs/${$scope.username}`)
        .then(function (res) {
            if (res.data) {
                console.log(res.data);
                $scope.jobs = res.data;
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }


    //Reset
    $scope.reset = function () {
        $http.get("http://localhost:3000/jobs")
        .then(function (res) {
            if (res.data) {
                console.log(res.data);
                $scope.jobs = res.data;
                //alert('refreshed!!!');
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    $scope.reset();

});




//LOGOUT
//
app.controller('logoutController', function ($location) {

    sessionStorage.loggedIn = false;
    sessionStorage.username = undefined;
    sessionStorage.usertype = undefined;
    $location.url('/');

});