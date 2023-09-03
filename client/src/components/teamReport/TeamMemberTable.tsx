import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { getEditableTableData, BasicTableRow, Pagination } from 'api/table.api';
import { EditableCell } from '../tables/editableTable/EditableCell';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 10,
};

export const TeamMemberTable: React.FC = () => {

    const [form] = BaseForm.useForm();
    const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
        data: [],
        pagination: initialPagination,
        loading: false,
    });
    const [editingKey, setEditingKey] = useState(0);
    const { t } = useTranslation();
    const { isMounted } = useMounted();

    const fetch = useCallback(
        (pagination: Pagination) => {
            setTableData((tableData) => ({ ...tableData, loading: true }));
            getEditableTableData(pagination).then((res) => {
                if (isMounted.current) {
                    setTableData({ data: res.data, pagination: res.pagination, loading: false });
                }
            });
        },
        [isMounted],
    );

    useEffect(() => {
        fetch(initialPagination);
    }, [fetch]);

    const handleTableChange = (pagination: Pagination) => {
        fetch(pagination);
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as BasicTableRow;

            const newData = [...tableData.data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
            } else {
                newData.push(row);
            }
            setTableData({ ...tableData, data: newData });
            setEditingKey(0);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDeleteRow = (rowId: number) => {
        setTableData({ ...tableData, data: tableData.data.filter((item) => item.key !== rowId) });
    };

    const columns = [
        {
            title: t('common.name'),
            dataIndex: 'name',
            width: '50%',
            editable: false,
        },
        {
            title: t('common.plan'),
            dataIndex: 'plan',
            width: '50%',
            editable: true,
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: BasicTableRow) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: true,
            }),
        };
    });

    return (
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
                }}
                onChange={handleTableChange}
                loading={tableData.loading}
                scroll={{ x: 800 }}
            />
        </BaseForm>
    );
};
