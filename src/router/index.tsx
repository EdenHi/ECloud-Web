import {Navigate} from "react-router-dom";
import React from "react";
import {lazy} from "react";
import {Spin} from "antd";
import Home from "@/views/Home";
import Login from "@/views/Login";

const Page1 = lazy(() => import("@/views/page1"));
const Warehouses = lazy(() => import("@/views/Warehouse/list"))
const WarehouseDetail = lazy(() => import("@/views/Warehouse/detail"))
const UserList = lazy(() => import("@/views/User/list"))
const GoodsList = lazy(() => import("@/views/Goods/index"))
const lazyLoading = (comp: JSX.Element): JSX.Element => (
    <React.Suspense
        fallback={
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large"/>
            </div>
        }
    >
        {comp}
    </React.Suspense>
);
const routes = [
    {
        path: "/",
        element: <Navigate to="/page1"/>,
    },
    {
        path: "/",
        element: <Home/>,
        children: [
            {
                path: "/page1",
                element: lazyLoading(<Page1/>),
            },
            {
                path: "/warehouses",
                element: lazyLoading(<Warehouses/>),
            },
            {
                path: "/warehouses/detail",
                element: lazyLoading(<WarehouseDetail/>)
            },
            {
                path: "/userList",
                element: lazyLoading(<UserList/>)
            },
            {
                path: "/goodsList",
                element: lazyLoading(<GoodsList/>)
            },
        ],
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "*",
        element: <Navigate to="/"/>,
    },
];
export default routes;
