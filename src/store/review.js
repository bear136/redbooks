import Vue from 'vue'
import moment from 'moment'
export default {
    namespaced: true,//开启命名空间
    state: {
        commentObj: {
            article_id: 0,
            level: 1,
            content: '',
            comment_time: '',
            reply_comment_id: 0,
            reply_user_id: 0
        }  //
    },
    mutations: {
        updateComment (state, info) {
            if (info !== null) {

                Object.keys(info).map(item => {
                    if (Object.keys(state.commentObj).includes(item)) {
                        Vue.set(state.commentObj, item, info[item])
                    }
                })
                Vue.set(state.commentObj, 'comment_time', moment().format('YYYY/MM/DD HH:mm'))
            }
        }

    },
    actions: {
        addReviewInfo (context, value) {
            context.commit('updateComment', value)
        },

    },
    getters: {
        getAllInfo (state) {
            return state.commentObj
        }
    }
}



