import handler from "./index";

let reducer = (state = handler.state, action: { type: string; val: any }) => {
  let newState = JSON.parse(JSON.stringify(state));
  for (let key in handler.actionNames) {
    if (action.type === handler.actionNames[key]) {
      handler.actions[key](newState, action);
      break;
    }
  }
  return newState;
};

export default reducer;
