// var wsUri = 'ws://localhost:8083/ws';
// var output;
//
// class WsClient {
//     constructor() {
//         this.output = document.getElementById('output');
//
//         $('#send').on('click', this.sendHandler.bind(this));
//         $('#connect').on('click', this.connectHandler.bind(this));
//         $('#close').on('click', this.closeHandler.bind(this));
//     }
//
//     sendHandler() {
//         var msg = $('#input').val();
//         this.doSend(msg);
//     }
//
//     connectHandler() {
//         let ws = this.ws = new WebSocket(wsUri);
//
//         ws.onopen = this.onOpen.bind(this);
//         ws.onclose = this.onClose.bind(this);
//         ws.onmessage = this.onMessage.bind(this);
//         ws.onerror = this.onError.bind(this);
//     }
//
//     closeHandler() {
//         if (this.socketConnected()) {
//             this.ws.close();
//         }
//     }
//
//     socketConnected() {
//         let ws = this.ws;
//         return (ws && ws.readyState === ws.OPEN);
//     }
//
//     onOpen(evt) {
//         this.writeToScreen("CONNECTED");
//         // this.doSend("WebSocket rocks");
//     }
//
//     onClose(evt) {
//         this.writeToScreen("DISCONNECTED");
//     }
//
//     onMessage(evt) {
//         this.writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
//     }
//
//     onError(evt) {
//         this.writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
//     }
//
//     doSend(message) {
//         if (!this.socketConnected()) {
//             return; }
//         this.writeToScreen("SENT: " + message);
//         this.ws.send(message);
//     }
//
//     writeToScreen(message) {
//         var pre = document.createElement('p');
//         pre.style.wordWrap = 'break-word';
//         pre.innerHTML = message;
//         this.output.appendChild(pre);
//     }
//
//     static getInstance() {
//         return new WsClient();
//     }
// }
//
// window.addEventListener('load', WsClient.getInstance, false);
