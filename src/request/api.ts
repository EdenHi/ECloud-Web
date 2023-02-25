import request from "./index";

export const loginApi = (params: LoginApiReq): Promise<LoginApiRes> => {
    return request.post("/auth/login", params);
};

export const testTokenApi = (params: any): Promise<any> => {
    return request.get("/list/message", params);
};
export const getWareHouseList = (params: any): Promise<any> => {
    return request.post("/house/get/warehouses", params);
};

export const getUserDataList = (params: any): Promise<any> => {
    return request.post("/users/getList", params);
};
export const updateUserInfo = (params: any): Promise<any> => {
    return request.post("/users/updateInfo", params);
};
export const deleteUser = (params: any): Promise<any> => {
    return request.post("/users/deleteUser", params);
};
export const getWarehouseInfo = (params: any): Promise<any> => {
    return request.post("/house/get/info", params);
};

export const registerUser = (params: any): Promise<any> => {
    return request.post("/auth/register", params);
};