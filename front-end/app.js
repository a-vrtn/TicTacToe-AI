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
        '$window', '$timeout', '$http', '$interval' , '$mdSidenav', function ($scope, $window, $timeout, $http, $interval, $mdSidenav) {

            $scope.grid_options = [
                {
                    value: 3,
                    label: '3 X 3'
                }, {
                    value: 4,
                    label: '4 X 4'
                }, {
                    value: 5,
                    label: '5 X 5'
                }, {
                    value: 10,
                    label: '10 X 10'
                }, {
                    value: 25,
                    label: '25 X 25'
                }];

            // $scope.game = new $tictactoe(3);
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
            $scope.grid_size = 3;
            $scope.player = {
                O: 'user',
                X: 'user',
                algorithmX: 'random',
                algorithmO: 'random'

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
                console.log("gridSize:" + $scope.grid_size);
                console.log("gridSize:" + i);
                $scope.data = [];
                $scope.data.splice(0, $scope.data.length);
                for (var i = 0; i < $scope.grid_size * $scope.grid_size; i++) {
                    $scope.data.push(' ');
                }
                // var rows = [], columns = [];
            };
            $scope.resumeTimer = function () {
                if (timer === null) {
                    timer = $interval(function () {
                        // console.log("ping!");
                        $scope.computerMoves();
                    }, $scope.interval);
                }
            };
            $scope.pauseTimer = function () {
                $interval.cancel(timer);
                timer = null;
            }
            $scope.computerMoves = function () {
                if ($scope.isCalculating == false) {

                    if ($scope.turn == 'X' && $scope.player.X == 'computer') {
                        $scope.isCalculating = true;
                        $scope.calculateNextMove($scope.player.algorithmX, function (response) {
                            console.log("response:");
                            console.log(response);
                            if (response.move != -1) {

                                $scope.marks.count++;
                                $scope.data[response.move] = $scope.turn;
                                $scope.toggleTurn();


                            }
                            if (response.message == 'O has won') {
                                alert(response.message);
                                $scope.scores['O']++;
                                $scope.empty();

                            }
                            if (response.message == 'X has won') {
                                alert(response.message);
                                $scope.scores['X']++;
                                $scope.empty();


                            }
                            if (response.message == "it's a draw") {
                                alert(response.message);
                                $scope.scores.draw++;
                                $scope.empty();

                            }
                            $scope.isCalculating = false;
                        });

                    } else if ($scope.turn == 'O' && $scope.player.O == 'computer') {
                        $scope.isCalculating = true;
                        $scope.calculateNextMove($scope.player.algorithmO, function (response) {
                            console.log("response:");
                            console.log(response);
                            if (response.move != -1) {

                                $scope.marks.count++;
                                $scope.data[response.move] = $scope.turn;
                                $scope.toggleTurn();
                            }
                            if (response.message == 'O has won') {
                                alert(response.message);
                                $scope.scores['O']++;
                                $scope.empty();
                            }
                            if (response.message == 'X has won') {
                                alert(response.message);
                                $scope.scores['X']++;
                                $scope.empty();

                            }
                            if (response.message == "it's a draw") {
                                alert(response.message);
                                $scope.scores.draw++;
                                $scope.empty();

                            }
                            $scope.isCalculating = false;

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

                $scope.marks.count++;
                $scope.data[row_index * $scope.grid_size + column_index] = turn;
                // $timeout(function () {
                // console.log($scope.data);
                $scope.didWin(function (response) {

                    // }
                    console.log("response:" + response);

                    if (response == "true") {
                        alert(turn + " has won");
                        $scope.scores[turn]++;

                        $scope.empty();
                    } else if ($scope.marks.count == $scope.grid_size * $scope.grid_size) {
                        alert("It's a draw !");
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

                $http({
                    url: apiURL + "nextMove",
                    method: 'POST',
                    params: {
                        "board[]": $scope.data,
                        turn: $scope.turn,
                        boardSize: $scope.grid_size,
                        algorithm: algorithm
                    }
                }).then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log(response.data);
                    callback(response.data);

                });
            };
            $scope.init();
            $scope.toggleLeft = buildToggler('left');
            function buildToggler(componentId) {
                return function () {
                    $mdSidenav(componentId).toggle();
                };
            };
            $scope.isOpenRight = function(){
                return $mdSidenav('left').isOpen();
            };
        }]);
