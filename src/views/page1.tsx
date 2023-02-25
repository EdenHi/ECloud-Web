import {useSelector, useDispatch} from "react-redux";
import {testTokenApi} from "@/request/api";
import React, {useState, useEffect, useRef} from "react";


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
        setList([...res.list]);
    };
    useEffect(() => {
        getList()
    }, []);

    return (
        <>
            token:{token}
            <br/>
            {list.map((item: any) => (<div key={item.userID}>{item.userName}</div>
            ))}
            <hr/>
            <button onClick={() => {
                list.push({
                    "userID": list.length,
                    "userName": "Matthew White",
                    "roleID": 1,
                    "password": "111111",
                    "email": "v.tohudco@eungf.bm"
                })
                setList(list)
            }
            }>click
            </button>

        </>
    );
};
export default page1;
