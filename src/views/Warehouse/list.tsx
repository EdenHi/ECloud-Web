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
        console.log('我被挂载了！')

        getList().then(r => {
        })
        return () => {
            console.log('我被销毁了！')
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
            paddingBottom: 20
        }}>

            <div style={{
                width: '100%',

            }}>
                <Form style={{display: 'flex', alignItems: 'center', paddingLeft: 15, paddingTop: 15}}>
                    <Form.Item style={{width: 200}} label={'仓库Id'}>
                        <Input value={searchId} placeholder="请输入ID" onChange={(e) => {

                            setSearchId(e.target.value)
                        }} onPressEnter={() => {
                            search!(1, 10)
                        }}></Input>
                    </Form.Item>
                    <Form.Item style={{width: 200, paddingLeft: 15}} label={'仓库名称'}>
                        <Input value={searchName} placeholder="请输入名称" onChange={(e) => {

                            setSearchName(e.target.value)
                        }} onPressEnter={() => {
                            search!(1, 10)
                        }}></Input>
                    </Form.Item>
                    <Form.Item style={{width: 180, paddingLeft: 15}} label={'仓库状态'}>
                        <Select onChange={(e) => {
                            setSearchStatus(e)
                        }} defaultValue={0 as any} value={searchStatus as any} options={[
                            {value: 0, label: '未选择'},
                            {value: status.low, label: '低'},
                            {value: status.medium, label: '中'},
                            {value: status.high, label: '高'},
                        ] as any}/>
                    </Form.Item>
                    <Form.Item style={{paddingLeft: 15}}>
                        <Button onClick={() => {
                            if (search) {
                                search(1, 10)
                            }
                        }
                        } type="primary">搜索</Button>

                        <Button onClick={reset} style={{marginLeft: 15}}>重置</Button>
                    </Form.Item>
                </Form>
            </div>
            <Table style={{width: '100%'}} dataSource={list as any} pagination={false} rowKey={'whId'}>

                <Column title="仓库ID" dataIndex="whId" render={(_, item) => (<div onClick={() => {
                    navigate(`/warehouses/detail`,{state:item})
                }}>WH-{item.whId}</div>)}/>
                <Column title="仓库名称" dataIndex="houseName"/>
                <Column
                    title="库存状态"

                    render={(_, item) => (
                        <>
                            {switchStatus(item.usedNum / item.totalNum)}
                        </>
                    )}
                />
                <Column
                    title="库存"

                    render={(_: any, item) => (
                        <>
                            {item.usedNum}/{item.totalNum}
                        </>
                    )}
                />
                <Column title="横向货架数" dataIndex="xNum"/>
                <Column title="纵向货架数" dataIndex="yNum"/>
                <Column title="货架层数" dataIndex="zNum"/>
                <Column title="数据表名" dataIndex="tableName"/>
                <Column title="操作日志" dataIndex="operationLog"/>

            </Table>
            <br/>
            <Pagination current={searchData.page} onChange={search} showTotal={(total) => `总计 ${total} 条 `}
                        showSizeChanger
                        onShowSizeChange={search} total={totalPage || 0} defaultCurrent={1}
                        style={{alignSelf: 'flex-end', marginRight: '12px'}}>
            </Pagination>
        </div>
    )
}
export default wareHouseList