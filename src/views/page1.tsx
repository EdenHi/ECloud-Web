import { useSelector, useDispatch } from "react-redux";
import { testTokenApi } from "@/request/api";
import { useState, useEffect } from "react";


const page1: React.FC = () => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: any) => {
    return {
      token: state.handleUser.token,
    };
  });
  const [list, setList] = useState<Array<{}>>([]);
  const getList = async () => {
    const res = await testTokenApi({});
    console.log(res.list);
    setList([...res.list]);
    console.log(list);
  };
  useEffect(() => {
    getList();
  }, []);

  // const { num } = useSelector((state: any) => ({
  //   num: state.handleNum.num,
  // }));
  // const change = (): void => {
  //   dispatch({ type: "increment", val: 1 });
  // };
  return (
    <>
      token:{token}
      <br />
      {/* {list.map((item: any) => (
        <li>{item}</li>
      ))} */}
    </>
  );
};
export default page1;
