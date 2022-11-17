import { Input, Divider, Form, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi } from "@/request/api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./login.module.scss";
type LoginForm = {
  userName: string;
  password: string;
  rememberMe: boolean;
};
type RegisterForm = {
  userName: string;
  password: string;
  email: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: LoginForm) => {
    const res = await loginApi({
      userName: values.userName,
      password: values.password,
    });
    switch (res.code) {
      case 0:
        dispatch({ type: "setToken", val: res.data.token });
        navigate("/");
        break;
      default:
        break;
    }
    console.log(res);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className={styles.container}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: "#FFF",
            marginBottom: 40,
          }}
        >
          ECloud云仓后台管理系统
        </h1>
        <div className={styles.loginBox}>
          <div
            style={{
              position: "absolute",
              top: 0,
              height: 50,
              lineHeight: "50px",
              fontSize: 20,
            }}
          >
            登录
          </div>
          <Divider style={{ marginTop: 30 }} plain />
          <div className={styles.inputBox}>
            <Form
              name="basic"
              labelCol={{ span: 24, offset: 2 }}
              wrapperCol={{ span: 20, offset: 2 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                style={{ marginBottom: 4 }}
                label="用户名"
                name="userName"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={
                    <UserOutlined style={{ color: "rgb(168,171,178)" }} />
                  }
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 4 }}
                label="密码"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={
                    <LockOutlined style={{ color: "rgb(168,171,178)" }} />
                  }
                />
              </Form.Item>
              <Button type="link" style={{ marginLeft: 40, padding: 0 }}>
                忘记密码
              </Button>

              <Form.Item
                style={{ marginTop: 30 }}
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 2, span: 6 }}
              >
                <Checkbox>记住密码</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 2, span: 20 }}>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  htmlType="submit"
                >
                  登录
                </Button>
              </Form.Item>
              <div style={{ paddingLeft: "40px" }}>
                还没有账号？
                <Button type="link" style={{ padding: "0 0px" }}>
                  立即注册
                </Button>
                。
              </div>
            </Form>
          </div>
        </div>
        <p
          style={{
            position: "absolute",
            bottom: 20,
            color: "rgb(255 255 255 / 23%)",
          }}
        >
          Designed By Eden
        </p>
      </div>
    </>
  );
};

export default Login;
