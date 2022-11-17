import { useSelector, useDispatch } from "react-redux";
import store from "@/store";
// type RootState = ReturnType<typeof store.getState>;
const page2: React.FC = () => {
  const { num } = useSelector((state: RootState) => ({ num: state.num }));
  return <div>page{num}</div>;
};
export default page2;
