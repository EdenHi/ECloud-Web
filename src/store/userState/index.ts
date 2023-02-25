const store = {
  state: {
    token: "",
    userName:"",
    roleID:0,
    email:""
  },
  actions: {
    setToken: (
      newState: { token: string },
      action: { type: string; val: string }
    ) => {
      newState.token = action.val;
    },
    setRole: (
        newState: { roleID: number },
        action: { type: string; val: number }
    ) => {
      newState.roleID = action.val;
    },
    setEmail: (
        newState: { email: string },
        action: { type: string; val: string }
    ) => {
      newState.email = action.val;
    },
    setName: (
        newState: { userName: string },
        action: { type: string; val: string }
    ) => {
      newState.userName = action.val;
    },
  },
  asyncActions: {},
  actionNames: {},
};
for (let key in store.actions) {
  store.actionNames[key] = key;
}
export default store;
