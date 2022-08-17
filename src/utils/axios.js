import axios from 'axios'
import router from '../router'
//设置baseUrl
axios.defaults.baseURL = '/api/'
axios.defaults.withCredentials = true
//设置超时时间
axios.defaults.timeout = 30000
//设置request拦截器，将token进行携带
//设置axios拦截器
let whiteList = ['/login', '/sendCode', '/register', '/check']
axios.interceptors.request.use(config => {
    if (whiteList.includes(config.url)) {
        return config
    } else {
        //将token字符串发送到服务器
        config.headers.Authorization = 'Basic ' + window.localStorage.getItem('redBooksToken')
        // 最后必须return config
        return config
    }

}, err => {
    return Promise.reject(err)
})
axios.interceptors.response.use(response => {
    const { data: { code } } = response
    if (code === 2003 || code === 2004 || code == 2005) {
        window.localStorage.removeItem('redBooksToken')
        router.push('/login')
    }
    return response
})
export default axios