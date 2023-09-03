import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { EditableCell } from './EditScoreCell';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { getDaysInRange } from './CalculateDays';
import { getAllScores } from '@app/api/score.api';
import { BasicAllScoreData } from '@app/api/score.api';
import { Dayjs } from 'dayjs';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 100,
};

interface ReportsTableProps {

  selectedMonth: Dayjs | undefined;
  query: string

}

export const ScoresTable: React.FC<ReportsTableProps> = ({ selectedMonth, query }) => {

  const [form] = BaseForm.useForm();

  const { user } = useAppSelector((state) => state.user)

  const [tableData, setTableData] = useState<{ data: BasicAllScoreData[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const [searchData, setSearchData] = React.useState<{ data: BasicAllScoreData[] }>({ data: [] });

  const month = selectedMonth && selectedMonth?.month();

  const days = month && getDaysInRange(month);

  React.useEffect(() => {

    const newData = tableData.data.filter((item) => {
      return item.userName?.toLowerCase().includes(query.toLowerCase())
        || item.teamName?.toLowerCase().includes(query.toLowerCase())
    });

    if (newData) {
      setSearchData({ data: newData })
    }

  }, [query])

  //setTableData({ ...tableData, data: searchData.data });

  const [editingKey, setEditingKey] = useState('');

  const { t } = useTranslation();

  const { isMounted } = useMounted();

  React.useEffect(() => {

    setSearchData({ data: tableData.data })

  }, [tableData])

  const fetch = useCallback(
    (pagination: Pagination) => {

      setTableData((tableData) => ({ ...tableData, loading: true }));

      if (user) {

        if (selectedMonth) {

          const selectedMonthString = selectedMonth.format('YYYY-MM-DD');

          getAllScores({ selectedMonthString }).then((res) => {
            if (isMounted.current) {

              const newData = res.data.map((elem) => { return { ...elem, key: elem._id } });
              setTableData({ data: newData, pagination: pagination, loading: false });
            }
          })
        } else {
          setTableData((tableData) => ({ ...tableData, loading: false }));

        }
      }
      else {
        setTableData((tableData) => ({ ...tableData, loading: false }));
      }

    },
    [isMounted, selectedMonth],
  );


  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
    cancel();
  };

  const isEditing = (record: BasicAllScoreData) => record._id === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const columns = [
    {
      title: t('common.no'),
      // dataIndex: 'order',
      width: '2%',
      editable: true,
      // accessor: (_row: any, i:number) => i+1
      render: (text: string, record: BasicAllScoreData, rowIndex: number) => {
        return rowIndex + 1;
      }
    },
    {
      title: t('common.team'),
      dataIndex: 'teamName',
      width: '3%',
      editable: true,
    },
    {
      title: t('common.fullName'),
      dataIndex: 'userName',
      width: '3%',
      editable: true,
    },
  ];

  let dateStore = ['']

  if (tableData.data) {
    const excludedKeys = ["userName", "teamName", "rank", "annual", "monthlyProfit", "groupName"];

    for (let i = 0; i < tableData.data.length; i++) {
      const keys = Object.keys(tableData.data[i]).filter(key => !excludedKeys.includes(key));
      for (let j = 1; j <= 31; j++) {
        if (keys.includes(j.toString()) && !dateStore.includes(j.toString())) {
          dateStore.push(j.toString())
        }
      }
    }
  }

  const dateColumns: {
    title: string;
    dataIndex: string;
    width: string;
    editable: boolean;
  }[] = []

  if (days) {

    const filteredDays = days?.filter((day: number) => dateStore.includes(day.toString()));

    filteredDays?.map((day: number) => {
      let title = '';
      if (day >= 21) {
        title = '0' + (month).toString()
      } else {
        title = '0' + (month + 1).toString()
      }

      const temp = {
        title: `${title}/${day >= 10 ? day.toString() : '0' + day.toString()}`,
        dataIndex: `${day.toString()}`,
        width: "1%",
        editable: true
      }
      dateColumns.push(temp);
    })

    columns.push(...dateColumns)
  }

  const right = [
    {
      title: t('common.thisMonth'),
      dataIndex: 'monthlyProfit',
      width: '1%',
      editable: true,
    },
    {
      title: t('common.currentMonthRank'),
      dataIndex: 'rank',
      width: '1%',
      editable: true,
    },
    {
      title: t('common.annual'),
      dataIndex: 'annual',
      width: '1%',
      editable: true,
    },
  ];

  columns.push(...right)

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: BasicAllScoreData) => ({
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
