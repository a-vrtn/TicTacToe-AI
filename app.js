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
        '$window', '$tictactoe', function ($scope, $window, $tictactoe) {
            var wsUri = 'ws://localhost:8083/ws';
            var output;
            var ws;
            $scope.isConnected=false;
            $scope.connectHandler = function () {
                ws = new WebSocket(wsUri);
                ws.onopen = $scope.onOpen.bind(this);
                ws.onclose = $scope.onClose.bind(this);
                ws.onmessage = $scope.onMessage.bind(this);
                ws.onerror = $scope.onError.bind(this);
            };
            $scope.closeHandler=function() {
                if (ws && ws.readyState === ws.OPEN) {
                    ws.close();
                    // $scope.isConnected=false;
                }
            };

            $scope.onOpen = function (evt) {
                // this.writeToScreen("CONNECTED");
                // this.doSend("WebSocket rocks");
                console.log("CONNECTED");
                $scope.isConnected=true;
                // console.log("$scope.isConnected:"+$scope.isConnected);
            };

            $scope.onClose = function (evt) {
                // this.writeToScreen("DISCONNECTED");
                console.log("DISCONNECTED");
                $scope.isConnected=false;

            };

            $scope.onMessage = function (evt) {
                // this.writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
                console.log("RESPONSE:" + evt.data);

            };

            $scope.onError = function (evt) {
                // this.writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
                console.log("ERROR:" + evt.data);
            };
            //////
            $scope.grid_options = [
                //     {
                //     value: 2,
                //     label: '2 X 2'
                // },
                {
                    value: 3,
                    label: '3 X 3'
                }, {
                    value: 4,
                    label: '4 X 4'
                }, {
                    value: 5,
                    label: '5 X 5'
                }];

            $scope.game = new $tictactoe(3);

        }]);

app.factory('$tictactoe', ['$timeout', function ($timeout) {
    return function (grid_size) {

        this.grid_size = grid_size;

        this.init = function () {

            this.scores = {
                X: 0,
                O: 0
            };

            this.marks = {
                X: 'X',
                O: 'O',
                count: 0
            };

            this.dummyArray = new Array(this.grid_size);

            this.data = {};

        };


        this.empty = function () {
            this.data = {};
            this.marks.count = 0;
        };

        this.mark = function (row_index, column_index) {

            var self = this;

            if (self.data[row_index + '' + column_index]) {
                return;
            }

            self.marks.count++;

            var current_mark = self.marks.count % 2 === 1 ? self.marks.X : self.marks.O;
            self.current_mark=current_mark;
            self.data[row_index + '' + column_index] = current_mark;

            $timeout(function () {
                if (self.didWin(current_mark)) {
                    alert(current_mark + " has won");
                    self.scores[self.marks.count % 2 === 1 ? 'X' : 'O']++;
                    self.empty();
                } else if (self.marks.count == self.grid_size * self.grid_size) {
                    alert("It's a draw !");
                    self.empty();
                }
            });

        };


        this.didWin = function (mark) {

            var vertical_count = 0,
                horizontal_count = 0,
                right_to_left_count = 0,
                left_to_right_count = 0;


            for (var i = 0; i < this.grid_size; i++) {

                vertical_count = 0;
                horizontal_count = 0;

                for (var j = 0; j < this.grid_size; j++) {

                    if (this.data[i + '' + j] == mark) {
                        horizontal_count++;
                    }

                    if (this.data[j + '' + i] == mark) {
                        vertical_count++;
                    }

                }

                if (this.data[i + '' + i] == mark) {
                    left_to_right_count++;
                }

                if (this.data[(this.grid_size - 1 - i) + '' + i] == mark) {
                    right_to_left_count++;
                }

                if (horizontal_count == this.grid_size || vertical_count == this.grid_size) {
                    return true;
                }

            }

            if (left_to_right_count == this.grid_size || right_to_left_count == this.grid_size) {
                return true;
            }

            return false;
        };


        this.init();

        return this;

    };
}]);
