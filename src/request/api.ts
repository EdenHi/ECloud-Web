import request from "./index";

export const loginApi = (params: LoginApiReq): Promise<LoginApiRes> => {
  return request.post("/auth/login", params);
};

export const testTokenApi = (params: any): Promise<any> => {
  return request.get("/list/message", params);
};
