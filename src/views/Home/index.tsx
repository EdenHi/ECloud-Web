import { Breadcrumb, Layout } from "antd";
import SideMenu from "@/components/Menu";
import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const Home: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边栏 */}
      <SideMenu />
      <Layout className="site-layout">
        {/* 头部 */}
        <Header
          className="site-layout-background"
          style={{
            paddingLeft: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* 面包屑 */}
          <Breadcrumb style={{}}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
        </Header>

        {/* 内容 */}
        <Content
          style={{ margin: "10px 16px 0 16px" }}
          className="site-layout-background"
        >
          <Outlet />
        </Content>
        {/* 底部 */}
        <Footer style={{ textAlign: "center", padding: 0, lineHeight: "48px" }}>
          ECloud Management Created by Eden Zhang
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
