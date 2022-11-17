interface LoginApiReq {
  userName: string;
  password: string;
}
interface LoginApiRes {
  code: number;
  msg: string;
  data: {
    token: string;
  };
}
