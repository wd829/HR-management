import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { EditableCell } from './EditReportCell';
import { BasicAllScoreData } from '@app/api/score.api';
import { BasicReportTableRow } from '@app/api/report.api';
import moment from 'moment';
import { BasicTableRow } from 'api/user.api';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 100,
};

interface ScoreTableProps {

    reportMissingUser: BasicTableRow[]
}

export const ReportMissingUserTable: React.FC<ScoreTableProps> = ({ reportMissingUser }) => {

    const [form] = BaseForm.useForm();

    const [tableData, setTableData] = React.useState<{ data: BasicTableRow[]; pagination: Pagination }>({ data: reportMissingUser, pagination: initialPagination });

    const { t } = useTranslation();

    const columns = [
        {
            title: t('common.no'),
            width: '5%',
            editable: true,
            render: (text: string, record: BasicTableRow, rowIndex: number) => {
                return rowIndex + 1;
            }
        },
        {
            title: t('common.team'),
            dataIndex: 'teamNo',
            sorter: (a: BasicTableRow, b: BasicTableRow) => a.teamNo.localeCompare(b.teamNo),
            showSorterTooltip: false,
            width: '5%',
            editable: true,
        },
        {
            title: t('common.userName'),
            dataIndex: 'userName',
            width: '45%',
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
        {
            title: t('common.ipMsgId'),
            dataIndex: 'ipMsgId',
            width: '45%',
            editable: true,
            render: (text: string, record: BasicTableRow) => {

                return (
                    record.ipMsgId &&
                    <>
                        {record.ipMsgId}
                    </>
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
