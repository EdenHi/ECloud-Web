import {Avatar, Breadcrumb, Dropdown, Layout, Popconfirm, Popover} from "antd";
import SideMenu from "@/components/Menu";
import type {MenuProps} from 'antd';
import React, {useState} from "react";
import {useNavigate, Outlet} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {SmileOutlined} from "@ant-design/icons";

const {Header, Content, Footer, Sider} = Layout;
const breadcrumbNameMap: Record<string, string> = {
    '/apps': 'Application List',
    '/apps/1': 'Application1',
    '/apps/2': 'Application2',
    '/apps/1/detail': 'Detail',
    '/apps/2/detail': 'Detail',
};
const Home: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {userName} = useSelector((state: any) => {
        return {
            userName: state.handleUser.userName
        }
    });
    const logout = () => {
        dispatch({type: 'setToken', val: ''})
        localStorage.removeItem('ECloud_Token')
        navigate('/login')
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div href="#" onClick={logout}>退出登录</div>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            icon: <SmileOutlined/>,
            disabled: true,
        },

    ];
    return (
        <Layout style={{minHeight: "100vh"}}>
            {/* 侧边栏 */}
            <SideMenu/>
            <Layout className="site-layout">
                {/* 头部 */}
                <Header
                    className="site-layout-background"
                    style={{
                        paddingLeft: 16,
                        display: "flex",
                        alignItems: "center",
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {/* 面包屑 */}
                    <Breadcrumb style={{}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{position: 'absolute', right: '1%'}}>
                        <Dropdown menu={{items}}>
                            <Avatar
                                style={{backgroundColor: 'rgb(0,33,41)', verticalAlign: 'middle'}} size="large" gap={0}>
                                {userName.slice(0, 1)}
                            </Avatar>
                        </Dropdown>
                    </div>
                </Header>

                {/* 内容 */}
                <Content
                    style={{margin: "10px 16px 0 16px"}}
                    className="site-layout-background"
                >
                    <Outlet/>
                </Content>
                {/* 底部 */}
                <Footer style={{textAlign: "center", padding: 0, lineHeight: "48px"}}>
                    ECloud Management Created by Eden Zhang
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Home;
