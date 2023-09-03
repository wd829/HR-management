import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { EditableCell } from './EditScoreCell';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Text } from '@app/components/newReport/NewReportForm.styles';
import { Content } from '../NewScoreForm.style';
import { GetBasicScoreRequest } from '@app/api/score.api';
import { getScoreResult } from '@app/api/score.api';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { updateScore } from '@app/api/score.api';
import { deleteScoreRow } from '@app/api/score.api';
import { AppDate } from '@app/constants/Dates';
import { EventValue } from 'rc-picker/lib/interface.d';
import moment from 'moment';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { getAllPayTypeNames } from '@app/api/score.api';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 100,
};


const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};


interface ScoreTableDataProps {

    query: string,
    saveStatus: boolean,
    date: EventValue<AppDate>,
    setSaveStatus: React.Dispatch<React.SetStateAction<boolean>>
    selectedName: string,
    selectedTeamName: string,
}

export const EditScoreTable: React.FC<ScoreTableDataProps> = ({ saveStatus, query, date, setSaveStatus, selectedTeamName, selectedName }) => {

    const [form] = BaseForm.useForm();

    const [editStatus, setEditStatus] = useState(false)


    const [tableData, setTableData] = useState<{ data: GetBasicScoreRequest[]; pagination: Pagination; loading: boolean }>({
        data: [],
        pagination: initialPagination,
        loading: false,
    });

    const [searchData, setSearchData] = React.useState<{ data: GetBasicScoreRequest[] }>({ data: [] });

    const [editingKey, setEditingKey] = useState('');

    const { t } = useTranslation();

    const { isMounted } = useMounted();

    React.useEffect(() => {

        const newData = tableData.data.map((item, index) => { return { ...item, order: index + 1 } })
            .filter((item) => {
                return item.userName?.toLowerCase().includes(query.toLowerCase()) || item.date?.toString().includes(query)
                    || item.teamName?.toLowerCase().includes(query.toLowerCase())
            });

        if (newData) {
            console.log(newData);
            setSearchData({ data: newData })
        }

    }, [query, tableData])

    const [payTypeOptionValue, setPayTypeOptionValue] = React.useState<string[]>([])

    React.useEffect(() => {
        getAllPayTypeNames().then((res) => setPayTypeOptionValue(res.data))
    }, [])

    const payTypeObject: { value: string }[] = payTypeOptionValue.map((item) => {
        return { value: item };
    });

    const fetch = useCallback(
        (pagination: Pagination) => {

            setTableData((tableData) => ({ ...tableData, loading: true }));

            // const currentDate = date?.toDate()
            // currentDate?.setHours(0, 0, 0, 0)
            const currentDate = moment(date?.toDate().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            if (currentDate) {

                getScoreResult(currentDate).then((res) => {
                    if (isMounted.current) {

                        if (selectedTeamName !== "All") {
                            if (selectedName === "All") {
                                const newData = res.data.map((elem) => { return { ...elem, key: elem._id } }).filter((elem) => elem.teamName === selectedTeamName);
                                // setTableData({ data: newData, pagination: res.pagination, loading: false });
                                setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                            }
                            else {
                                console.log(res.data);
                                console.log(selectedTeamName);
                                const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
                                    .filter((elem) => (elem.teamName === selectedTeamName) && (elem.userName === selectedName));

                                console.log(newData);
                                // setTableData({ data: newData, pagination: res.pagination, loading: false });
                                setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                            }
                        }
                        else {
                            const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
                            // setTableData({ data: newData, pagination: res.pagination, loading: false });
                            setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                        }
                        setSaveStatus(false)
                    }
                });
            }
            if (!saveStatus || currentDate) {
                setTableData((tableData) => ({ ...tableData, loading: false }));
            }

        },
        [isMounted, date, saveStatus, selectedName, selectedTeamName],
    );

    useEffect(() => {
        fetch(initialPagination);
    }, [fetch]);

    const handleTableChange = (pagination: Pagination) => {
        fetch(pagination);
        cancel();
    };

    const isEditing = (record: GetBasicScoreRequest) => record._id === editingKey;


    const cancel = () => {
        setEditingKey('');
    };

    const handleSelect = (key: string) => {

        const roleSelectValue = form.getFieldValue('inComePayType');

        const newData = [...tableData.data];

        const index = newData.findIndex(({ _id }) => key === _id)

        // newData[index].role = roleSelectValue;
        newData[index] = { ...newData[index], inComePayType: roleSelectValue };

        setTableData({ ...tableData, data: newData })

    }


    const edit = (record: Partial<GetBasicScoreRequest>) => {
        form.setFieldsValue({ userName: '', inCome: '', outCome: '', ...record });
        setEditingKey(record._id || '');
        setEditStatus(true);
    };

    const update = async (key: string | null) => {
        try {

            const row = (await form.validateFields()) as GetBasicScoreRequest;

            updateScore({ row, key }).then(({ data }) => {
                const newData = [...tableData.data];
                const updateIndex = newData.findIndex((item) => item._id === data._id);
                newData[updateIndex] = data;
                setTableData({ ...tableData, data: newData });
            })
            setEditingKey('');

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDeleteRow = (rowId: string | null) => {
        // dispatch(doDeleteUserRow({ rowId }))
        deleteScoreRow({ rowId })
            .then((res) => {
                if (isMounted.current) {
                    console.log('==========res');
                    console.log(res);
                    console.log(tableData.data);
                    const newData = [...tableData.data].filter(({ _id }) => _id !== res.data._id)
                    console.log(newData);
                    setTableData({ ...tableData, data: newData, loading: false });
                }
            });
    }

    const columns = [
        {
            title: t('common.no'),
            // dataIndex: 'order',
            width: '2%',
            editable: false,
            render: (text: string, record: GetBasicScoreRequest, rowIndex: number) => {
                return rowIndex + 1;
            }
        },
        {
            title: t('common.teamName'),
            dataIndex: 'teamName',
            width: '5%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => a.teamName.toLowerCase().localeCompare(b.teamName.toLowerCase()),
            showSorterTooltip: false,
            editable: false,
        },
        {
            title: t('common.userName'),
            dataIndex: 'userName',
            width: '10%',
            editable: false,
        },
        {
            title: t('common.ipMsgId'),
            dataIndex: 'ipMsgId',
            width: '8%',
            editable: false,
        },
        {
            title: t('common.inCome'),
            dataIndex: 'inCome',
            width: '5%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => parseInt(a.inCome.replace(/,/g, ""), 10) - parseInt(b.inCome.replace(/,/g, ""), 10),
            showSorterTooltip: false,
            editable: true,
            render: (text: string, record: GetBasicScoreRequest) => {
                return (
                    record.inCome &&
                    <Content>
                        <>{record.inCome}</>
                    </Content>
                )
            }
        },
        {
            title: t('common.inComePayType'),
            dataIndex: 'inComePayType',
            width: '5%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => a.inComePayType?.toLowerCase().localeCompare(b.inComePayType?.toLowerCase()),
            showSorterTooltip: false,
            render: (text: string, record: GetBasicScoreRequest) => {

                return (
                    isEditing(record) ?
                        <BaseButtonsForm.Item name="inComePayType">
                            <BaseSelect placeholder={t('forms.validationFormLabels.role')} defaultValue={record.inComePayType}
                                options={payTypeObject} onChange={() => handleSelect(record._id)}>
                            </BaseSelect>
                        </BaseButtonsForm.Item>
                        :
                        <>{record.inComePayType ? record.inComePayType : "Please select a inComePayType"}</>

                )
            }
        },
        {
            title: t('common.expense'),
            dataIndex: 'expense',
            width: '5%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => parseInt(a.expense.replace(/,/g, ""), 10) - parseInt(b.expense.replace(/,/g, ""), 10),
            showSorterTooltip: false,
            editable: true,
            render: (text: string, record: GetBasicScoreRequest) => {
                return (
                    record.expense &&
                    <Content>
                        <>{record.expense}</>
                    </Content>
                )
            }
        },
        {
            title: t('common.expensePayType'),
            dataIndex: 'expensePayType',
            width: '5%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => a.expensePayType?.toLowerCase().localeCompare(b.expensePayType?.toLowerCase()),
            showSorterTooltip: false,
            render: (text: string, record: GetBasicScoreRequest) => {
                return (
                    isEditing(record) ?
                        <BaseButtonsForm.Item name="expensePayType">
                            <BaseSelect placeholder={t('forms.validationFormLabels.role')} defaultValue={record.expensePayType}
                                options={payTypeObject} onChange={() => handleSelect(record._id)}>
                            </BaseSelect>
                        </BaseButtonsForm.Item>
                        :
                        <>{record.expensePayType ? record.expensePayType : "Please select a expensePayType"}</>
                )
            }
        },
        {
            title: t('common.description'),
            dataIndex: 'description',
            width: '15%',
            editable: true,
        },
        {
            title: t('common.date'),
            dataIndex: 'date',
            width: '5%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            showSorterTooltip: false,
            editable: false,
            render: (text: string, record: GetBasicScoreRequest) => {

                return (
                    record.date &&
                    <>
                        {record.date.replace('T', ' ')}
                    </>
                )
            }
        },
        {
            title: t('common.createdAt'),
            dataIndex: 'createdAt',
            width: '8%',
            sorter: (a: GetBasicScoreRequest, b: GetBasicScoreRequest) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            showSorterTooltip: false,
            editable: true,
            render: (text: string, record: GetBasicScoreRequest) => {

                return (
                    record.createdAt &&
                    <>
                        {moment(record.createdAt).format('YYYY/MM/DD HH:mm')}
                    </>
                )
            }
        },
        {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '10%',
            render: (text: string, record: GetBasicScoreRequest) => {
                const editable = isEditing(record);
                return (
                    <BaseSpace>
                        {editable ? (
                            <>
                                <BaseButton type="primary" onClick={() => update(record._id)} size='small'>
                                    {t('common.save')}
                                </BaseButton>
                                <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                                    <BaseButton type="ghost" size='small'>{t('common.cancel')}</BaseButton>
                                </BasePopconfirm>
                            </>
                        ) : (
                            <>
                                <BaseButton type="ghost" disabled={isEditing(record)} onClick={() => edit(record)} size='small'>
                                    {t('common.update')}
                                </BaseButton>
                                <BasePopconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(record?._id)}>
                                    <BaseButton type="default" danger size='small'>
                                        {t('tables.delete')}
                                    </BaseButton>
                                </BasePopconfirm>
                            </>
                        )}
                    </BaseSpace>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: GetBasicScoreRequest) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <BaseForm form={form} component={false}>
                <BaseTable
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={searchData.data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        ...tableData.pagination,
                        onChange: cancel,
                    }}
                    onChange={handleTableChange}
                    loading={tableData.loading}
                    scroll={{ x: 800 }}
                />
            </BaseForm>
        </>
    );
};
