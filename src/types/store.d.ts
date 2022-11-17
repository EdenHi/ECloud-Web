type RootState = ReturnType<typeof import("../store/index").getState>;
interface Window {
  __REDUX_DEVTOOLS_EXTENSTION_COMPOSE__: function;
}
