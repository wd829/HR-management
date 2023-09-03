import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { EditableCell } from './EditReportCell';
import { BasicAllScoreData } from '@app/api/score.api';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 100,
};

interface ScoreTableProps {

    scoredData: BasicAllScoreData[]
}

export const DashboardTable: React.FC<ScoreTableProps> = ({ scoredData }) => {

    const [form] = BaseForm.useForm();

    const [tableData, setTableData] = React.useState<{ data: BasicAllScoreData[]; pagination: Pagination }>({ data: scoredData, pagination: initialPagination });

    const { t } = useTranslation();

    const columns = [
        {
            title: t('common.rank'),
            dataIndex: 'rank',
            width: '1%',
            editable: true,
        },
        {
            title: t('common.userName'),
            dataIndex: 'userName',
            width: '1%',
            sorter: (a: BasicAllScoreData, b: BasicAllScoreData) => a.userName.toLowerCase().localeCompare(b.userName.toLowerCase()),
            showSorterTooltip: false,
            editable: true,
        },
        {
            title: t('common.annual'),
            dataIndex: 'annual',
            width: '1%',
            editable: true,
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: BasicAllScoreData) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
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
                    pagination={{
                        ...tableData.pagination,
                    }}
                    rowClassName="editable-row"
                    scroll={{ x: 800 }}
                />
            </BaseForm>

        </>
    );
};
