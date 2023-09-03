import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { EditableCell } from './EditReportCell';
import { BasicAllScoreData } from '@app/api/score.api';
import { BasicReportTableRow } from '@app/api/report.api';
import moment from 'moment';

const initialPagination: Pagination = {
    current: 1,
    pageSize: 100,
};

interface ScoreTableProps {

    newJobEarnedData: BasicReportTableRow[]
}

export const NewJobEarnedTable: React.FC<ScoreTableProps> = ({ newJobEarnedData }) => {

    const [form] = BaseForm.useForm();

    const [tableData, setTableData] = React.useState<{ data: BasicReportTableRow[]; pagination: Pagination }>({ data: newJobEarnedData, pagination: initialPagination });

    const { t } = useTranslation();

    const columns = [
        {
            title: t('common.no'),
            width: '1%',
            editable: true,
            render: (text: string, record: BasicReportTableRow, rowIndex: number) => {
                return rowIndex + 1;
            }
        },
        {
            title: t('common.team'),
            dataIndex: 'userTeam',
            width: '1%',
            sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.userTeam.toLowerCase().localeCompare(b.userTeam.toLowerCase()),
            showSorterTooltip: false,
            editable: true,
        },
        {
            title: t('common.userName'),
            dataIndex: 'userName',
            width: '5%',
            sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => (a.lastName + ' ' + a.firstName).toLowerCase().localeCompare(b.lastName + ' ' + b.firstName.toLowerCase()),
            showSorterTooltip: false,
            editable: true,
            render: (text: string, record: BasicReportTableRow) => {

                return (
                    record.firstName && record.lastName &&
                    <>
                        {record.lastName + ' ' + record.firstName}

                    </>
                )
            }
        },
        {
            title: t('common.newJob'),
            dataIndex: 'newJobEarned',
            width: '15%',
            editable: true,
            sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.newJobEarned?.toLowerCase().localeCompare(b.newJobEarned?.toLowerCase()),
            showSorterTooltip: false,
            render: (text: string, record: BasicReportTableRow) => {

                return (
                    record.newJobEarned &&
                    <div dangerouslySetInnerHTML={{ __html: record.newJobEarned?.split('\n').join('<br>') }} />
                )
            }
        },
        {
            title: t('common.date'),
            dataIndex: 'date',
            width: '5%',
            sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            showSorterTooltip: false,
            editable: true,
            render: (text: string, record: BasicReportTableRow) => {
                const formatedDate = moment(record.date).format('YYYY-MM-DD')
                return (
                    record.date &&
                    <>
                        {formatedDate}
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
            onCell: (record: BasicReportTableRow) => ({
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
