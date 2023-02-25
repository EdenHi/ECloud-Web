import React from "react";
import ReactDOM from "react-dom/client";
//* 样式初始化
import "reset-css";

//* UI样式
// import "antd/dist/antd.css"
//* 全局样式
import "@/assets/styles/global.scss";
//* 组件样式
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
