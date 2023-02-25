import React, {useEffect, useState} from "react";
import Column from "antd/es/table/Column";
import {Button, Form, Input, message, Modal, Pagination, Popconfirm, Select, Table} from "antd";
import {getUserDataList, updateUserInfo, deleteUser, registerUser} from "@/request/api";
import timestampToTime from "@/utils";
import ButtonGroup from "antd/es/button/button-group";


type DataListType = {
    userId: number;
    userName: string;
    roleId: number;
    email: string;
}

enum Role {
    '未选择' = -1,
    '管理员' = 0,
    '员工' = 1
}

const userList: React.FC = () => {
    const [dataList, setDataList] = useState<Array<DataListType>>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [searchData, setSearchData] = useState({page: 1, limit: 10})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowInfo, setRowInfo] = useState({})

    useEffect(() => {
        getData()
    }, [])
    const getData = async (data?) => {
        let params = data || {...searchData, userId, userName, roleId}
        const res = await getUserDataList(params)
        setTotalCount(res.data.totalNum)
        setDataList(res.data.list)
    }
    const handleEditClick = (row?) => {
        if (row) {
            setRowInfo({...row, ...{newPassword: ''}})
        } else {
            setRowInfo({userName: '', roleId: 1, email: '', newPassword: ''})
        }
        setIsModalOpen(true);
    }
    const handleOk = async () => {
        if (rowInfo.password) {
            const res = await updateUserInfo(rowInfo)
            if (res.code == 0) {
                setIsModalOpen(false);
                message.success('修改成功')
                getData()
            }
        } else {
            const res = await registerUser({
                userName: rowInfo.userName,
                password: rowInfo.newPassword,
                email: rowInfo.email,
                roleId: rowInfo.roleId
            })
            if (res.code == 0) {
                setIsModalOpen(false);
                message.success('新增成功')
                getData()
            }
        }
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }

    const [userId, setUserId] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const [roleId, setRoleId] = useState<number>(-1)

    const reset = () => {
        setRoleId(-1)
        setUserName('')
        setUserId('')
        getData({page: 1, limit: 10})
    }
    const confirm = async (userId) => {
        const res = await deleteUser({userId})
        if (res.code === 0) {
            getData()
            message.success('删除成功');
        } else {
            message.error('删除失败');
        }
    };

    const cancel = () => {
    };
    return (
        <div>
            <Modal title={rowInfo.password ? '编辑用户' : '新增用户'} open={isModalOpen} onOk={handleOk}
                   onCancel={handleCancel} okText={'确认'}
                   cancelText={'取消'}>

                <Form>
                    <Form.Item label={'名称'}><Input placeholder={'请输入名称'} value={rowInfo.userName}
                                                     onChange={e => {
                                                         setRowInfo({...rowInfo, ...{userName: e.target.value}})
                                                     }}></Input> </Form.Item>
                    <Form.Item label={'角色'}><Select
                        placeholder={'请选择'}
                        onChange={(value) => {
                            setRowInfo({...rowInfo, ...{roleId: value}})
                        }
                        }
                        value={rowInfo.roleId}
                        options={[{value: 1, label: '用户'}, {
                            value: 0,
                            label: '管理员'
                        }] as any}></Select></Form.Item>
                    <Form.Item label={'邮箱'}><Input placeholder={'请输入邮箱'} value={rowInfo.email} onChange={(e) => {
                        setRowInfo({...rowInfo, ...{email: e.target.value}})
                    }}></Input></Form.Item>
                    <Form.Item label={'密码'}><Input placeholder={'请输入密码'} type={'password'}
                                                     value={rowInfo.newPassword} onChange={(e) => {
                        setRowInfo({...rowInfo, ...{newPassword: e.target.value}})
                    }}></Input></Form.Item>
                </Form>
            </Modal>
            <div>
                <Form style={{display: 'flex', alignItems: 'center', paddingLeft: 15, paddingTop: 15}}>
                    <Form.Item style={{width: 200}} label={'用户ID'}>
                        <Input value={userId} placeholder="请输入ID" onChange={(e) => {
                            setUserId(e.target.value)
                        }} onPressEnter={() => {
                            getData()
                        }}></Input>
                    </Form.Item>
                    <Form.Item style={{width: 200, paddingLeft: 15}} label={'用户名称'}>
                        <Input value={userName} placeholder="请输入名称" onChange={(e) => {
                            setUserName(e.target.value)
                        }} onPressEnter={() => {
                            getData()
                        }}></Input>
                    </Form.Item>
                    <Form.Item style={{width: 180, paddingLeft: 15}} label={'角色'}>
                        <Select onChange={(e) => {
                            setRoleId(e)
                        }} value={roleId as any} options={[
                            {value: Role.未选择, label: '未选择'},
                            {value: Role.员工, label: '员工'},
                            {value: Role.管理员, label: '管理员'},
                        ] as any}/>
                    </Form.Item>
                    <Form.Item style={{paddingLeft: 15}}>
                        <Button onClick={() => {
                            getData()
                        }
                        } type="primary">搜索</Button>

                        <Button onClick={reset} style={{marginLeft: 15}}>重置</Button>
                        <Button onClick={handleEditClick} style={{marginLeft: 15}}>新增</Button>
                    </Form.Item>
                </Form>
            </div>
            <Table bordered={true} style={{width: '98%', margin: '10px auto', userSelect: 'text'}}
                   dataSource={dataList as any}
                   rowKey={'userId'}
                   pagination={false}>
                <Column title="用户ID" dataIndex="userId"/>
                <Column title="用户名称" dataIndex="userName"/>
                <Column title="角色" render={(_, item) => {
                    return (
                        <span>{item.roleId === 0 ? '管理员' : '员工'}</span>
                    )
                }}/>
                <Column title="邮箱" dataIndex="email"/>

                <Column title="操作" render={(_, item) => {
                    return (
                        <ButtonGroup>
                            <Button type={'text'} onClick={() => {
                                handleEditClick(item)
                            }}>编辑</Button>

                            <Popconfirm
                                title="删除用户"
                                description="你确定要删除该用户吗？"
                                onConfirm={() => {
                                    confirm(item.userId)
                                }
                                }
                                onCancel={cancel}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type={'text'} onClick={() => {

                                }}>删除</Button>
                            </Popconfirm>
                        </ButtonGroup>
                    )
                }}/>
                <Column title="创建时间" render={(_, item) => {
                    return (
                        <span>{timestampToTime(Date.parse(item.createTime))}</span>
                    )
                }}/>
                <Column title="修改时间" render={(_, item) => {
                    return (
                        <span>{item.operateTime ? timestampToTime(Date.parse(item.operateTime)) : '暂未修改'}</span>
                    )
                }}/>
            </Table>
            <Pagination style={{display: 'flex', justifyContent: 'flex-end', marginRight: 10, marginBottom: 10}}
                        showSizeChanger
                        showTotal={(total) => `总计 ${total} 条 `}
                        pageSize={searchData.limit}
                        current={searchData.page}
                        total={totalCount} onChange={(page, pageSize) => {
                setSearchData({page, limit: pageSize})
                getData({page, limit: pageSize})
            }}></Pagination>
        </div>
    )
}
export default userList