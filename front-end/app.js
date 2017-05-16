var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages']);
app.config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'home.html',
        publicAccess: true
    })
});

app.controller(
    'HomeCtrl', [
        '$scope',
        '$window', '$timeout', '$http', '$interval' , '$mdSidenav', '$mdToast',function ($scope, $window, $timeout, $http, $interval, $mdSidenav, $mdToast) {

            $scope.isPaused=false;
            var last = {
                bottom: true,
                top: false,
                left: true,
                right: false
            };

            $scope.toastPosition = angular.extend({}, last);

            $scope.getToastPosition = function () {
                sanitizePosition();

                return Object.keys($scope.toastPosition)
                    .filter(function (pos) {
                        return $scope.toastPosition[pos];
                    })
                    .join(' ');
            };

            function sanitizePosition() {
                var current = $scope.toastPosition;

                if (current.bottom && last.top) current.top = false;
                if (current.top && last.bottom) current.bottom = false;
                if (current.right && last.left) current.left = false;
                if (current.left && last.right) current.right = false;

                last = angular.extend({}, current);
            }

            $scope.showSimpleToast = function (message) {
                var pinTo = $scope.getToastPosition();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position(pinTo).hideDelay(1000)
                );
            };

            $scope.turn = 'X';
            var apiURL = "http://localhost:8080/V1/";
            $scope.toggleTurn = function () {
                console.log($scope.data);
                if ($scope.turn == 'X')
                    $scope.turn = 'O';
                else
                    $scope.turn = 'X';
                return $scope.turn;
            };
            $scope.interval = 1000;
            $scope.showMessage=null;
            $scope.changeInterval=function(interval)
            {
                $scope.interval=interval;
                if($scope.isPaused==false) {
                    $scope.pauseTimer();
                    $scope.resumeTimer();
                }
            };
            $scope.grid_size = 3;
            $scope.player = {
                O: 'user',
                X: 'user',
                algorithmX: 'random',
                algorithmO: 'random',

            };
            $scope.isCalculating = false;
            $scope.init = function (i) {

                if (i != undefined)
                    $scope.grid_size = i;
                $scope.scores = {
                    X: 0,
                    O: 0,
                    draw: 0
                };

                $scope.marks = {
                    X: 'X',
                    O: 'O',
                    count: 0
                };

                $scope.dummyArray = new Array($scope.grid_size);
                $scope.dummyArray2 = new Array($scope.grid_size*$scope.grid_size);
                $scope.data = [];
                $scope.data.splice(0, $scope.data.length);
                for (var i = 0; i < $scope.grid_size * $scope.grid_size; i++) {
                    $scope.data.push(' ');
                }
            };
            $scope.resumeTimer = function () {
                $scope.isPaused=false;
                if (timer === null) {
                    timer = $interval(function () {
                        $scope.computerMoves();
                    }, $scope.interval);
                }
            };
            $scope.pauseTimer = function () {
                $scope.isPaused=true;
                $interval.cancel(timer);
                timer = null;
            };
            $scope.getResult=function(response)
            {
                console.log("response:");
                console.log(response);
                if (response.move != -1) {

                    $scope.marks.count++;
                    $scope.data[response.move] = $scope.turn;
                    $scope.toggleTurn();


                }
                if(response.message!=" ")
                    $scope.showMessage=response.message;

                $scope.isCalculating = false;
            }
            $scope.computerMoves = function () {
                if($scope.showMessage!=null)
                {
                    if ($scope.showMessage == 'O has won') {
                        $scope.showSimpleToast($scope.showMessage);
                        $scope.scores['O']++;
                        $scope.empty();

                    }
                    if ($scope.showMessage == 'X has won') {
                        $scope.showSimpleToast($scope.showMessage);
                        $scope.scores['X']++;
                        $scope.empty();


                    }
                    if ($scope.showMessage == "it's a draw") {
                        $scope.showSimpleToast($scope.showMessage);
                        $scope.scores.draw++;
                        $scope.empty();

                    }
                    $scope.showMessage=null;
                }
                else  if ($scope.isCalculating == false) {

                    if ($scope.turn == 'X' && $scope.player.X == 'computer') {
                        $scope.isCalculating = true;
                        $scope.calculateNextMove($scope.player.algorithmX, function (response) {
                            $scope.getResult(response);
                        });

                    } else if ($scope.turn == 'O' && $scope.player.O == 'computer') {
                        $scope.isCalculating = true;
                        $scope.calculateNextMove($scope.player.algorithmO, function (response) {
                            $scope.getResult(response);
                        });
                    }
                }

            }
            var timer = $interval(function () {
                // console.log("ping!");
                $scope.computerMoves();
            }, $scope.interval);


            $scope.empty = function () {
                $scope.data.splice(0, $scope.data.length);
                for (var i = 0; i < $scope.grid_size * $scope.grid_size; i++) {
                    $scope.data.push(' ');
                }
                $scope.marks.count = 0;
                $scope.turn = 'X';
            };

            $scope.mark = function (row_index, column_index, turn) {
                console.log($scope.player);
                if ($scope.data[row_index * $scope.grid_size + column_index] != ' ') {
                    return;
                }
                if(turn=='X'&&$scope.player.X=='computer')
                    return;

                if(turn=='O'&&$scope.player.O=='computer')
                    return;
                $scope.marks.count++;
                $scope.data[row_index * $scope.grid_size + column_index] = turn;
                // $timeout(function () {
                // console.log($scope.data);
                $scope.didWin(function (response) {

                    // }
                    console.log("response:" + response);

                    if (response == "true") {
                        $scope.showSimpleToast(turn + " has won");
                        $scope.scores[turn]++;

                        $scope.empty();
                    } else if ($scope.marks.count == $scope.grid_size * $scope.grid_size) {
                        $scope.showSimpleToast("It's a draw !");
                        $scope.scores.draw++;
                        $scope.empty();
                    }
                });

                $scope.toggleTurn();

            };


            $scope.didWin = function (callback) {

                $http({
                    url: apiURL + "didWin",
                    method: 'POST',
                    params: {
                        "board[]": $scope.data,
                        turn: $scope.turn,
                        boardSize: $scope.grid_size
                    }
                }).then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(response.data.message);
                    callback(response.data.message);

                });
            };

            $scope.calculateNextMove = function (algorithm, callback) {

                var depth=0;
                if(algorithm!='random')
                    depth=algorithm;
                $http({
                    url: apiURL + "nextMove",
                    method: 'POST',
                    params: {
                        "board[]": $scope.data,
                        turn: $scope.turn,
                        boardSize: $scope.grid_size,
                        algorithm: algorithm,
                        depth: depth
                    }
                }).then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(response.data);
                    callback(response.data);

                });
            };
            $scope.init();
            $scope.toggleRight = buildToggler('right');
            function buildToggler(componentId) {
                return function () {
                    $mdSidenav(componentId).toggle();
                };
            };
            $scope.isOpenRight = function(){
                return $mdSidenav('right').isOpen();
            };
        }]);
