import React, {useState, useEffect, useRef} from "react";
import {getWareHouseList} from "@/request/api";
import {Button, Form, Input, Pagination, Select, Space, Table, Tag} from "antd";
import type {ColumnsType} from 'antd/es/table';
import type {PaginationProps} from 'antd'
import {CheckCircleTwoTone, ExclamationCircleTwoTone, StopTwoTone} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import FormItem from "antd/es/form/FormItem";

type houseListType = {
    whId: string,
    xNum: number
    yNum: number
    zNum: number
    houseName: string
    usedNum: number
    totalNum: number
    operationLog: string
    tableName: string
}
type searchDataType = {
    page: number;
    limit: number;
    whId?: string;
    status?: number;
    houseName?: string
}

enum status {
    'low' = 1,
    'medium' = 2,
    'high' = 3,
}

const switchStatus = (num) => {

    switch (true) {
        case num >= 0 && num < 0.3:
            return <StopTwoTone twoToneColor={'#F56C6C'}/>
            break;
        case num >= 0.3 && num < 0.6:
            return <ExclamationCircleTwoTone twoToneColor={'#E6A23C'}/>
            break;
        case num >= 0.6 && num <= 1:
            return <CheckCircleTwoTone twoToneColor={'#67C23A'}/>
            break;
        default:
            return <div>null</div>
    }
}


const wareHouseList: React.FC = () => {


    const navigate = useNavigate()
    const [list, setList] = useState<Array<houseListType>>([])
    const [totalPage, setTotalPage] = useState<number>(0)
    const [searchData, setSearchData] = useState<searchDataType>({page: 1, limit: 10})
    const getList = async (data?: searchDataType) => {
        const res = await getWareHouseList({...data || searchData})
        setList(res.data.list)
        setTotalPage(res.data.totalNum)
    }
    const [searchId, setSearchId] = useState<string>('')
    const [searchName, setSearchName] = useState<string>('')
    const [searchStatus, setSearchStatus] = useState<number>(0)
    useEffect(() => {
        getList().then(r => {
        })
        return () => {
        }
    }, [])
    const search: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        setSearchData({page: current, limit: pageSize});
        getList({
            page: current,
            limit: pageSize,
            status: searchStatus,
            houseName: searchName,
            whId: searchId
        })
    };
    const reset = () => {
        setSearchStatus(0)
        setSearchId('')
        setSearchName('')
        search(1, 10)
    }
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 20,
            userSelect: 'text'
        }}>

            <div style={{
                width: '100%',

            }}>
                <Form style={{display: 'flex', alignItems: 'center', paddingLeft: 15, paddingTop: 15}}>
                    <Form.Item style={{width: 200}} label={'??????ID'}>
                        <Input value={searchId} placeholder="?????????ID" onChange={(e) => {

                            setSearchId(e.target.value)
                        }} onPressEnter={() => {
                            search!(1, 10)
                        }}></Input>
                    </Form.Item>
                    <Form.Item style={{width: 200, paddingLeft: 15}} label={'????????????'}>
                        <Input value={searchName} placeholder="???????????????" onChange={(e) => {

                            setSearchName(e.target.value)
                        }} onPressEnter={() => {
                            search!(1, 10)
                        }}></Input>
                    </Form.Item>
                    <Form.Item style={{width: 180, paddingLeft: 15}} label={'????????????'}>
                        <Select onChange={(e) => {
                            setSearchStatus(e)
                        }} defaultValue={0 as any} value={searchStatus as any} options={[
                            {value: 0, label: '?????????'},
                            {value: status.low, label: '???'},
                            {value: status.medium, label: '???'},
                            {value: status.high, label: '???'},
                        ] as any}/>
                    </Form.Item>
                    <Form.Item style={{paddingLeft: 15}}>
                        <Button onClick={() => {
                            if (search) {
                                search(1, 10)
                            }
                        }
                        } type="primary">??????</Button>

                        <Button onClick={reset} style={{marginLeft: 15}}>??????</Button>
                    </Form.Item>
                </Form>
            </div>
            <Table style={{width: '100%'}} dataSource={list as any} pagination={false} rowKey={'whId'}>

                <Column title="??????ID" dataIndex="whId" render={(_, item) => (
                    <Button type="link" onClick={() => {
                        navigate(`/warehouses/detail`, {state: item})
                    }}>WH-{item.whId}</Button>
                )}/>
                <Column title="????????????" dataIndex="houseName"/>
                <Column
                    title="????????????"

                    render={(_, item) => (
                        <>
                            {switchStatus(item.usedNum / item.totalNum)}
                        </>
                    )}
                />
                <Column
                    title="??????"

                    render={(_: any, item) => (
                        <>
                            {item.usedNum}/{item.totalNum}
                        </>
                    )}
                />
                <Column title="???????????????" dataIndex="xNum"/>
                <Column title="???????????????" dataIndex="yNum"/>
                <Column title="????????????" dataIndex="zNum"/>
                <Column title="????????????" dataIndex="tableName"/>
                <Column title="????????????" dataIndex="operationLog"/>

            </Table>
            <br/>
            <Pagination current={searchData.page} onChange={search} showTotal={(total) => `?????? ${total} ??? `}
                        showSizeChanger
                        onShowSizeChange={search} total={totalPage || 0} defaultCurrent={1}
                        style={{alignSelf: 'flex-end', marginRight: '12px'}}>
            </Pagination>
        </div>
    )
}
export default wareHouseList