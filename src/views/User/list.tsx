import React, {useEffect, useState} from "react";
import Column from "antd/es/table/Column";
import list from "@/views/Warehouse/list";
import {Button, Form, Input, Modal, Pagination, Select, Table} from "antd";
import {getUserDataList, updateUserInfo, deleteUser} from "@/request/api";
import timestampToTime from "@/utils";
import ButtonGroup from "antd/es/button/button-group";

type DataListType = {
    userId: number;
    userName: string;
    roleId: number;
    email: string;
}
const userList: React.FC = () => {
    const [dataList, setDataList] = useState<Array<DataListType>>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [searchData, setSearchData] = useState({page: 1, limit: 10})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowInfo, setRowInfo] = useState({})

    useEffect(() => {
        getData({page: 1, limit: 10})
    }, [])
    const getData = async (data) => {
        let params = data || searchData
        const res = await getUserDataList(params)
        setTotalCount(res.data.totalNum)
        setDataList(res.data.list)
    }
    const handleEditClick = (row) => {
        setRowInfo({...row, ...{newPassword: ''}})
        setIsModalOpen(true);
    }
    const handleOk = () => {
        updateUserInfo(rowInfo)
        setIsModalOpen(false);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }
    const handleDelete = (userId) => {
        deleteUser({userId})
    }
    return (
        <div>
            <Modal title="编辑用户" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={'确认'}
                   cancelText={'取消'}>

                <Form>
                    <Form.Item label={'名称'}><Input value={rowInfo.userName} onChange={e => {
                        setRowInfo({...rowInfo, ...{userName: e.target.value}})
                    }}></Input> </Form.Item>
                    <Form.Item label={'角色'}><Select
                        onChange={(value) => {
                            setRowInfo({...rowInfo, ...{roleId: value}})
                        }
                        }
                        value={rowInfo.roleId}
                        options={[{value: 1, label: '用户'}, {
                            value: 0,
                            label: '管理员'
                        }]}></Select></Form.Item>
                    <Form.Item label={'邮箱'}><Input value={rowInfo.email} onChange={(e) => {
                        setRowInfo({...rowInfo, ...{email: e.target.value}})
                    }}></Input></Form.Item>
                    <Form.Item label={'密码'}><Input value={rowInfo.newPassword} onChange={(e) => {
                        setRowInfo({...rowInfo, ...{newPassword: e.target.value}})
                    }}></Input></Form.Item>
                </Form>
            </Modal>
            <Table bordered={true} style={{width: '98%', margin: '10px auto'}} dataSource={dataList} rowKey={'userId'}
                   pagination={false}>
                <Column title="用户ID" dataIndex="userId"/>
                <Column title="用户名称" dataIndex="userName"/>
                <Column title="角色" render={(_, item) => {
                    return (
                        <span>{item.roleId === 0 ? '管理员' : '员工'}</span>
                    )
                }}/>
                <Column title="操作" render={(_, item) => {
                    return (
                        <ButtonGroup>
                            <Button type={'text'} onClick={() => {
                                handleEditClick(item)
                            }}>编辑</Button>
                            <Button type={'text'} onClick={() => {
                                handleDelete(item.userId)
                                getData(searchData)
                            }}>删除</Button>
                        </ButtonGroup>
                    )
                }}/>
                <Column title="创建时间" render={(_, item) => {
                    return (
                        <span>{timestampToTime(Date.parse(item.createTime))}</span>
                    )
                }}/>

            </Table>
            <Pagination style={{display: 'flex', justifyContent: 'flex-end', marginRight: 10}}
                        showSizeChanger
                        showTotal={(total) => `总计 ${total} 条 `}
                        defaultCurrent={1}
                        pageSize={searchData.limit}
                        total={totalCount} onChange={(page, pageSize) => {
                setSearchData({...searchData, ...page, ...{limit: pageSize}})
                getData({page, limit: pageSize})
            }}></Pagination>
        </div>
    )
}
export default userList