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
import { RangeValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import { getScoreData } from '@app/api/score.api';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 4,
};

interface ScoreTableData {
    timeRange: RangeValue<AppDate>;
    selectedName: string;
    selectedTeamName: string;
    selectedGroupName: string
}

export const EditScoreTable: React.FC<ScoreTableData> = ({ timeRange, selectedName, selectedTeamName, selectedGroupName }) => {

    const [form] = BaseForm.useForm();

    const [tableData, setTableData] = useState<{ data: GetBasicScoreRequest[]; pagination: Pagination; loading: boolean }>({
        data: [],
        pagination: initialPagination,
        loading: false,
    });

    const [editingKey, setEditingKey] = useState('');

    const { t } = useTranslation();

    // useEffect(() => {
    //     setTableData({ ...tableData, data: data })
    // }, [personalReport])

    const { isMounted } = useMounted();

    const fetch = useCallback(
        (pagination: Pagination) => {

            setTableData((tableData) => ({ ...tableData, loading: true }));

            if ((timeRange && selectedTeamName) || (timeRange && selectedTeamName && selectedName) || (timeRange && selectedGroupName)) {

                const startTime = timeRange[0]?.toDate();

                const endTime = timeRange[1]?.toDate();

                if (startTime && endTime) {

                    setTableData((tableData) => ({ ...tableData, loading: true }));

                    getScoreData({ startTime, endTime, selectedTeamName, selectedName, selectedGroupName}).then(res => {
                        if (isMounted.current) {
                            let i = 0;
                            const newData = res.data.map((elem, index) => { return { ...elem, key: index.toString(), order: ++i } })

                            console.log('-------------before');
                            console.log(newData);
                            setTableData({ data: newData, pagination: res.pagination, loading: false });
                        }
                    })
                }
            }
            else {
                setTableData((tableData) => ({ ...tableData, loading: false }));
            }

        },
        [isMounted, timeRange, selectedTeamName, selectedName, selectedGroupName],
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

    const columns = [
        {
            title: t('common.no'),
            dataIndex: 'order',
            width: '3%',
            editable: false,
        },
        {
            title: t('common.userName'),
            dataIndex: 'userName',
            width: '15%',
            editable: false,
        },
        {
            title: t('common.group'),
            dataIndex: 'groupName',
            width: '15%',
            editable: false,
        },
        {
            title: t('common.inCome'),
            dataIndex: 'inCome',
            width: '15%',
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
            title: t('common.expense'),
            dataIndex: 'expense',
            width: '15%',
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
            title: t('common.profit'),
            dataIndex: 'profit',
            width: '15%',
            editable: true,
            render: (text: string, record: GetBasicScoreRequest) => {
                return (
                    record.profit &&
                    <Content>
                        <>{record.profit}</>
                    </Content>
                )
            }
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
                    dataSource={tableData.data}
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
