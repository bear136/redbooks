import Vue from 'vue'
export default {
    namespaced: true,//开启命名空间
    state: {
        historyMsg: {},   //历史消息列表
    },
    mutations: {
        historyMessage (state, info) {
            if (info !== null) {
                Object.keys(info).forEach((i) => {
                    Vue.set(state.historyMsg, i, info[i])
                })
            } else {
                state.historyMsg = {}
            }
        },
        changeMsg (state, info) {
            console.log(info)
            let sign = info.from_user
            let data = ''
            //将接收到的消息转化为格式化
            if (info.msgType == 'send') {
                data = `${info.send_time}+send+${info.content}`
            } else {
                data = `${info.send_time}+receive+${info.content}`
            }

            //给你发送信息的人原来给你发过消息
            state.historyMsg.data[sign].history_data.push(data)

        }
    },
    actions: {
        addOldInfo (context, value) {
            context.commit('historyMessage', value)
        },
        addUserMsg (context, value) {
            context.commit('changeMsg', value)
        }
    },
    getters: {
        getMsg (state) {
            return (sign) => {
                if (Object.keys(state.historyMsg).length === 0) return
                if (state.historyMsg.data[sign]) {
                    return state.historyMsg.data[sign]
                } else {
                    return null
                }
            }
        },
        getAllMsg (state) {
            return state.historyMsg
        }
    }
}



