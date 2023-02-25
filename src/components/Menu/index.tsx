import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type {MenuProps} from "antd";
import {Layout, Menu} from "antd";
import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Cache} from "three";
import get = Cache.get;

const {Sider} = Layout;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem("仪表盘", "/page1", <PieChartOutlined/>),
    getItem("仓库管理", "/warehouses", <DesktopOutlined/>),
    getItem("用户管理", "/userList", <DesktopOutlined/>),
    getItem("货物管理", "/goodsList", <DesktopOutlined/>),
    getItem("User", "sub1", <UserOutlined/>),
    getItem("Team", "sub2", <TeamOutlined/>, [
        getItem("Team 1", "/sub2/page1"),
        getItem("Team 2", "/sub2/page2"),
    ]),
    getItem("Files", "sub3", <FileOutlined/>, [
        getItem("File 1", "/sub3/page1"),
        getItem("File 2", "/sub3/page2"),
    ]),
];
const rootSubmenuKeys = ["sub1", "sub2", "sub3"];
let initOpenKey: string = "";
// console.log(MenuItem);

const SideMenu: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const logoView = !collapsed ? (
        <div className="logo">ECloud-M</div>
    ) : (
        <div className="logo">E</div>
    );

    const navigateTo = useNavigate();
    const currentRoute = useLocation();
    const findChildrenInMenu = () => {
        const menuItemWithChildren = items.filter((item) => {
            return (item as any).children;
        });
        menuItemWithChildren.forEach((menuItem) => {
            if (
                (menuItem as any).children.find(
                    (item: { key: string }) => item.key === currentRoute.pathname
                )
            ) {
                initOpenKey = menuItem!.key as string;
            }
        });
    };
    findChildrenInMenu();
    const menuClick = (e: { key: string }) => {
        navigateTo(e.key);
    };
    const [openKeys, setOpenKeys] = useState([initOpenKey]);
    const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
            {logoView}
            <Menu
                theme="dark"
                defaultSelectedKeys={[currentRoute.pathname]}
                mode="inline"
                items={items}
                onClick={menuClick}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            />
        </Sider>
    );
};

export default SideMenu;
