import axios from "axios";
import { store } from "@/store/index";
// import { useSelector, useDispatch } from "react-redux";
// const { token } = useSelector((state: any) => {
//   return {
//     token: state.handleUser.token,
//   };
// });
// const token = store.state.token;
// const token = store.getState().handleUser.token;

const token = JSON.parse(
  JSON.parse(localStorage.getItem("persist:ECloud")).handleUser
).token;

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
//*请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
//*响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
