const url = 'ws://123.57.180.25:9000/webSocket'
const token = window.localStorage.getItem('redBooksToken')
var global_callback = null
var websocket = new WebSocket(url, [token])
function connectWebsocket (callback) {
    global_callback = callback
    initWebSocket()
}
function initWebSocket () {
    websocket.onopen = function () {
        console.log('连接成功')
        heartCheck.reset().start()
    }
    websocket.addEventListener('message', (e) => {
        websocketMsg(e)
    })
    websocket.onclose = function () {
        console.log('websocket关闭了')
        heartCheck.reset()
        reconnect()
    }
    websocket.onerror = function () {
        console.log("WebSocket连接发生错误")
        reconnect()
    }

}

//避免重复连接
let lockReconnect = false
var heartCheckStatue = ''
/**
 * websocket重连
 */
function reconnect () {
    console.log('重连中...')
    if (lockReconnect) return
    lockReconnect = true
    setTimeout(() => {     //没连接上会一直重连，设置延迟避免请求过多
        websocket = new WebSocket(url, [token])
        initWebSocket()
        lockReconnect = false
    }, 5000)
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
var heartCheck = {
    timeout: 31000,
    timeoutObj: null,
    closeObj: null,
    reset: function () {
        clearInterval(this.timeoutObj)
        clearTimeout(this.closeObj)
        return this
    },
    start: function () {
        this.timeoutObj = setInterval(function () {
            //这里接收个心跳，前端收到后进行判断
            if (heartCheckStatue === 'ping') {
                heartCheckStatue = ''
                this.closeObj && clearTimeout(this.closeObj)
            } else {
                this.closeObj = setTimeout(() => {
                    if (heartCheckStatue !== 'ping') websocket.close()
                    //如果onclose会执行reconnect，我们执行 websocket.close()就行了.如果直接执行 reconnect 会触发onclose导致重连两次
                }, 5000)
            }
        }, this.timeout)
    }
}
//接收信息
function websocketMsg (msg) {
    if (msg.data === 'ping') {
        heartCheckStatue = 'ping'
    }
    let res = msg.data
    global_callback(res)
}
export default {
    sendSock,
    connectWebsocket,
    websocketClose,
    websocket
}
