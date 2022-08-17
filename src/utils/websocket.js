var websocket = null
const url = 'ws://123.57.180.25:9000/webSocket'
const token = window.localStorage.getItem('redBooksToken')
var global_callback = null

function initWebSocket (callback) {
    global_callback = callback
    websocket = new WebSocket(url, [token])
    websocket.onopen = function () {
        console.log('连接成功')
    }
    websocket.addEventListener('message', (e) => {
        websocketMsg(e)
    })
    websocket.onclose = function () {
        websocketClose()
    }
    websocket.onerror = function () {
        console.log("WebSocket连接发生错误")
    }
}
//结束连接
function websocketClose () {
    websocket.close()
}
//发送信息
function sendData (msg) {
    let data = JSON.stringify(msg)
    websocket.send(data)
}
function sendSock (agentData) {

    if (websocket.readyState === websocket.OPEN) {
        // 若是ws开启状态
        sendData(agentData)
    } else if (websocket.readyState === websocket.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData)
        }, 1000)
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData)
        }, 1000)
    }
}
//接收信息
function websocketMsg (msg) {
    let res = msg.data
    global_callback(res)
}
export default {
    sendSock,
    initWebSocket,
    websocketClose
}
