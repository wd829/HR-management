import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { EditableCell } from './EditReportCell';
import { BasicAllScoreData } from '@app/api/score.api';
import { BasicTableRow } from '@app/api/user.api';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 100,
};

interface ScoreTableProps {

    alarmVisitUserData: { userId: string; indexUser: BasicTableRow; visitedTime: string }[]
}

interface visitedTime {
    visitedTime: string
}

export const AlarmVisitUserShowModal: React.FC<ScoreTableProps> = ({ alarmVisitUserData }) => {

    const [form] = BaseForm.useForm();

    const basicTableRows: BasicTableRow[] = alarmVisitUserData.map(item => item.indexUser);

    const visitedTime = alarmVisitUserData.map(item => item.visitedTime);

    const [tableData, setTableData] = React.useState<{ data: BasicTableRow[]; pagination: Pagination }>({ data: basicTableRows, pagination: initialPagination });

    const newData = tableData.data.map((item, index) => { return { ...item, order: index + 1 } });

    const { t } = useTranslation();

    const columns = [
        {
            title: t('common.no'),
            width: '1%',
            editable: true,
            render: (text: string, record: BasicTableRow, rowIndex: number) => {
                return rowIndex + 1;
            }
        },
        {
            title: t('common.team'),
            dataIndex: 'teamNo',
            sorter: (a: BasicTableRow, b: BasicTableRow) => a.teamNo.toLowerCase().localeCompare(b.teamNo.toLowerCase()),
            showSorterTooltip: false,
            width: '1%',
            editable: true,
        },
        {
            title: t('common.fullName'),
            dataIndex: 'fullName',
            width: '1%',
            sorter: (a: BasicTableRow, b: BasicTableRow) => (a.lastName + ' ' + a.firstName).toLowerCase().localeCompare(b.lastName + ' ' + b.firstName.toLowerCase()),
            showSorterTooltip: false,
            editable: true,
            render: (text: string, record: BasicTableRow) => {

                return (
                    record.firstName && record.lastName &&
                    <>
                        {record.lastName + ' ' + record.firstName}

                    </>
                )
            }
        },
        // {
        //     title: t('common.visitedTime'),
        //     dataIndex: 'visitedTime',
        //     width: '1%',
        //     editable: true,
        //     render: (text: string, record: visitedTime) => {

        //         return (
        //            record &&
        //             <>
        //                 {record.visitedTime}

        //             </>
        //         )
        //     }
        // },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: BasicTableRow) => ({
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
                    dataSource={newData}
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
