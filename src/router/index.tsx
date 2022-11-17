import { Navigate } from "react-router-dom";
import React from "react";
import { lazy } from "react";
import { Spin } from "antd";
import Home from "@/views/Home";
import Login from "@/views/Login";
const Page1 = lazy(() => import("@/views/page1"));
const Page2 = lazy(() => import("@/views/page2"));
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
        <Spin size="large" />
      </div>
    }
  >
    {comp}
  </React.Suspense>
);
const routes = [
  {
    path: "/",
    element: <Navigate to="/page1" />,
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/page1",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "/page2",
        element: lazyLoading(<Page2 />),
      },
      {
        path: "sub1/page1",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "sub1/page2",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "sub1/page3",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "sub2/page1",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "sub2/page2",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "sub3/page1",
        element: lazyLoading(<Page1 />),
      },
      {
        path: "sub3/page2",
        element: lazyLoading(<Page1 />),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];
export default routes;
