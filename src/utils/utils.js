function formattUrl (imgUrl) {
    const defalutUrl = "http://123.57.180.25:9000"
    return `${defalutUrl}${imgUrl.slice(1, imgUrl.length)}`
}


//格式化文件
function forrmatFileUrl (obj) {
    const defalutUrl = "http://123.57.180.25:9000"
    // let obj = JSON.parse(JSON.stringify(fileUrl))
    const type = typeof (obj)
    // 如果是一个字符串
    if (type === 'string') {
        obj = `${defalutUrl}${obj.slice(1, obj.length)}`
    } else if (type === 'object' && obj !== null) {
        //如果是一个数组
        if (Array.isArray(obj)) {
            if (obj.length === 0) return obj
            for (let i = 0; i < obj.length; i++) {
                if (typeof (obj[i]) === 'object') {
                    forrmatFileUrl(obj[i])
                } else {
                    if (obj[i].slice(0, 8) == './upload') {
                        obj[i] = `${defalutUrl}${obj[i].slice(1, obj[i].length)}`
                    }
                }
            }
        } else {

            //对象
            Object.keys(obj).forEach(item => {
                if (typeof (obj[item]) === 'object' && (obj[item] !== null)) {
                    //对象的属性也是引用数据类型
                    forrmatFileUrl(obj[item])
                } else {
                    if (typeof (obj[item]) === "string") {
                        if (obj[item].slice(0, 8) === './upload') {
                            obj[item] = `${defalutUrl}${obj[item].slice(1, obj[item].length)}`
                        }
                    }
                }
            })
        }
    }
    return obj
}
const debounce = (func, delay = 1000) => {
    let timeout = 0
    return (...args) => {
        // 如果没有阻断
        if (!timeout) {
            // 那么开始阻断
            timeout = setTimeout(() => {
                // delay之后解除阻断
                timeout = 0
            }, delay)
            // 立即执行
            func.apply(this, args)
        } else {
            // 什么也不做
        }
    }
}


// function debounce (func, wait = 1000) {
//     let timeout

//     return function () {

//         let context = this // 保存this指向
//         let args = arguments // 拿到event对象
//         if (timeout) {
//             clearTimeout(timeout)
//         }
//         timeout = setTimeout(function () {
//             func.apply(context, args)
//         }, wait)
//     }
// }

export {
    formattUrl,
    forrmatFileUrl,
    debounce
}