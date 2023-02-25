import axios from "axios";

const path = "http://localhost:5173/login"
const config = {
    baseURL: "http://localhost:3000",
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
}
const instance = axios.create(config as any);

// instance.defaults.headers.common[''] =
//*请求拦截器
instance.interceptors.request.use(
    (config) => {
        // token = localStorage.getItem('ECloud_Token') || "Basic"
        // console.log(token)
        // instance.defaults.headers.common['Authorization'] = 'Bearer ' + token
        // console.log(instance.defaults.headers.common['Authorization']
        let token = localStorage.getItem('ECloud_Token') || "Basic"
        config.headers['Authorization'] = 'Bearer ' + token// 让每个请求携带自定义token 请根据实际情况自行修改

        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
//*响应拦截器
instance.interceptors.response.use(
    (res) => {
        if (res.config.url === "/auth/login") {

        }
        return res.data;
    },
    (err) => {
        if (err.response.status === 401) {
            setTimeout(() => {
                location.replace(path)
                localStorage.removeItem('ECloud_Token')
            }, 2000)
        }
        return Promise.reject(err);
    }
);

export default instance;
