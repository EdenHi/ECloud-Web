const store = {
  state: {
    token: "666",
  },
  actions: {
    setToken: (
      newState: { name: string },
      action: { type: string; val: string }
    ) => {
      newState.token = action.val;
    },
  },
  asyncActions: {},
  actionNames: {},
};
for (let key in store.actions) {
  store.actionNames[key] = key;
}
export default store;
