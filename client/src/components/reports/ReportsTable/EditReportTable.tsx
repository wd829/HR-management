import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { EditableCell } from './EditReportCell';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { BasicReportTableRow } from '@app/api/report.api';
import { personalReportData, getReportData } from '@app/api/report.api';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Content } from '../Reports.styles';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { ReportDetailCard } from '../ReportSlide/ReportDetail';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import moment from 'moment';
import { Navigate, useNavigate } from 'react-router-dom';
import { SortOrder } from 'antd/lib/table/interface';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 100,
};

interface ReportsTableProps {

  timeRange: RangeValue<AppDate>;
  query: string;
  selectedTeam: string,
  selectedName: string,
  viewReportItem: string
}

interface SortedInfo {
  column?: BasicReportTableRow;
  order?: SortOrder;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ timeRange, query, selectedTeam, selectedName, viewReportItem }) => {

  const [form] = BaseForm.useForm();

  const { user } = useAppSelector((state) => state.user)

  const [tableData, setTableData] = useState<{ data: BasicReportTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const { isMounted } = useMounted();

  const [searchData, setSearchData] = React.useState<{ data: BasicReportTableRow[] }>({ data: [] });

  const [sildeData, setSlideData] = React.useState<{ data: BasicReportTableRow[] }>({ data: [] })

  const [sortedInfo, setSortedInfo] = React.useState<BasicReportTableRow[]>([])

  const [paginationNumber, setPaginationNumber] = React.useState(0)

  const [sortStatus, setSortStatus] = React.useState('')

  const fetch = useCallback(
    (pagination: Pagination) => {

      setTableData((tableData) => ({ ...tableData, loading: true }));

      if (user) {

        const userId = user?._id;

        if (timeRange) {

          const startTime = moment(timeRange[0]?.toDate().setHours(8, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');

          const endTime = moment(timeRange[1]?.toDate()).add(1, 'day').set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss')

          if (startTime && endTime && (viewReportItem === 'd')) {
            personalReportData({ startTime, endTime, userId })
              .then((res) => {
                if (isMounted.current) {

                  if (selectedTeam !== "All") {
                    if (selectedName === "All") {

                      const newData = res.data.map((elem) => { return { ...elem, key: elem._id } }).filter((elem) => elem.userTeam === selectedTeam);

                      setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });

                    }
                    else {
                      const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
                        .filter((elem) => (elem.userTeam === selectedTeam) && ((elem.lastName + ' ' + elem.firstName) === selectedName));

                      setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                    }
                  }
                  else {
                    const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
                    setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                  }

                } else {
                  setTableData((tableData) => ({ ...tableData, loading: false }));
                }
              })
              .catch((e) => {
                setTableData((tableData) => ({ ...tableData, loading: false }));
              });
          }
        }
        if (viewReportItem && (viewReportItem !== 'd')) {

          setTableData((tableData) => ({ ...tableData, loading: true }));

          getReportData({ viewReportItem, userId })
            .then((res) => {
              if (isMounted.current) {

                if (selectedTeam !== "All") {
                  if (selectedName === "All") {

                    const newData = res.data.map((elem) => { return { ...elem, key: elem._id } }).filter((elem) => elem.userTeam === selectedTeam);

                    setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });

                  }
                  else {
                    const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
                      .filter((elem) => (elem.userTeam === selectedTeam) && ((elem.lastName + ' ' + elem.firstName) === selectedName));

                    setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                  }
                }
                else {
                  const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
                  setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
                }

              } else {
                setTableData((tableData) => ({ ...tableData, loading: false }));
              }
            })
            .catch((e) => {
              setTableData((tableData) => ({ ...tableData, loading: false }));
            });
          setTableData((tableData) => ({ ...tableData, loading: false }));
        }
      }
      else {
        setTableData((tableData) => ({ ...tableData, loading: false }));
      }

    },
    [isMounted, timeRange, selectedTeam, selectedName, viewReportItem],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  React.useEffect(() => {

    const newData = tableData.data.map((item, index) => { return { ...item, order: index + 1 } })
      .filter((item) => {
        return item.UserInfo.firstName?.toLowerCase().includes(query.toLowerCase())
          || item.userTeam?.toLowerCase().includes(query.toLowerCase()) || item.UserInfo.lastName?.toLowerCase().includes(query.toLowerCase())
          || item.ipMsgId?.toLowerCase().includes(query.toLowerCase())
      });

    if (newData) {
      setSearchData({ data: newData });
    }

  }, [query, tableData])

  const [editingKey, setEditingKey] = useState('');

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const { t } = useTranslation();

  const handleTableChange = (pagination: Pagination, filters: any, sorter: any, extra: any) => {
    fetch(pagination);

    if (pagination.current && pagination.pageSize) {
      setPaginationNumber((pagination?.current - 1) * (pagination.pageSize))
    }
    if (extra.action === 'sort') {
      setSortedInfo(extra?.currentDataSource);
      setSortStatus('sort')
    }
    // setSearchData(extra);
    cancel();
  };

  const isEditing = (record: BasicReportTableRow) => record._id === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const showDetail = (recordId: string) => {
    setIsModalOpen(true)

    // const index = searchData.data.findIndex((record) => record._id === recordId);
    if (sortStatus === 'sort') {
      const index = sortedInfo.findIndex((record) => record._id === recordId);

      if (index !== -1) {
        const tempSortedInfo = [...sortedInfo];
        const newData = [...sortedInfo.slice(index), ...sortedInfo.slice(0, index)];
        // const newData = [...searchData.data.slice(index), ...searchData.data.splice(0, index)]
        console.log(sortedInfo);
        console.log('=============newData');
        console.log(newData);
        setSlideData({ data: newData })
      }
    }
    else {
      const index = searchData.data.findIndex((record) => record._id === recordId);

      if (index !== -1) {
        // const tempSortedInfo = [...sortedInfo];
        // const newData = [...sortedInfo.slice(index), ...sortedInfo.slice(0, index)];
        const newData = [...searchData.data.slice(index), ...searchData.data.splice(0, index)]
        console.log(sortedInfo);
        console.log('=============newData');
        console.log(newData);
        setSlideData({ data: newData })
      }
    }


  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSlideData({ data: [] })
  }

  const navigate = useNavigate()

  const handlEditReport = () => {
    navigate('/personal/report', { replace: true });
  }

  const columns = [
    {
      title: t('common.no'),
      width: '2%',
      editable: true,
      render: (text: string, record: BasicReportTableRow, rowIndex: number) => {
        return rowIndex + 1 + paginationNumber;
      }
    },
    {
      title: t('common.team'),
      dataIndex: 'userTeam',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.userTeam.toLowerCase().localeCompare(b.userTeam.toLowerCase()),
      showSorterTooltip: false,
      width: '5%',
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        return (
          record.userTeam &&
          <Content onClick={() => showDetail(record?._id)}>
            {record.userTeam}
          </Content>
        )
      }
    },
    {
      title: t('common.fullName'),
      dataIndex: 'fullName',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => (a.lastName + ' ' + a.firstName).toLowerCase().localeCompare(b.lastName + ' ' + b.firstName.toLowerCase()),
      showSorterTooltip: false,
      width: '10%',
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        return (
          record.firstName && record.lastName &&
          <>
            <Content onClick={() => showDetail(record?._id)}>
              {record.lastName + ' ' + record.firstName}
            </Content>

          </>
        )
      }
    },
    {
      title: t('common.ipMsgId'),
      dataIndex: 'ipMsgId',
      width: '10%',
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        return (
          record.ipMsgId &&
          <Content onClick={() => showDetail(record?._id)}>
            {record.ipMsgId}
          </Content>
        )
      }
    },
    {
      title: t('common.done'),
      dataIndex: 'performed',
      width: '5%',
      editable: true,
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.performed.toLowerCase().localeCompare(b.performed.toLowerCase()),
      showSorterTooltip: false,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Done';
        const content = <div dangerouslySetInnerHTML={{ __html: record.performed?.split('\n').join('<br>') }} />

        return (
          record.performed &&
          <div onClick={() => showDetail(record?._id)}>
            <BasePopover content={content} title={title}>
              <Content >
                <ExclamationCircleOutlined rev="default value" />
              </Content>
            </BasePopover>
          </div>
        )
      }
    },
    {
      title: t('common.issue'),
      dataIndex: 'issue',
      width: '5%',
      editable: true,
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.issue.toLowerCase().localeCompare(b.issue.toLowerCase()),
      showSorterTooltip: false,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Issue';
        const content = <div dangerouslySetInnerHTML={{ __html: record.issue?.split('\n').join('<br>') }} />

        return (
          record.issue &&
          <div onClick={() => showDetail(record._id)}>
            <BasePopover content={content} title={title}>
              <Content>
                <ExclamationCircleOutlined rev="default value" />
              </Content>
            </BasePopover >
          </div>
        )
      }
    },
    {
      title: t('common.achieved'),
      dataIndex: 'achieved',
      width: '5%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.achieved.toLowerCase().localeCompare(b.achieved.toLowerCase()),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Achieved';
        const content = <div dangerouslySetInnerHTML={{ __html: record.achieved?.split('\n').join('<br>') }} />

        return (
          record.achieved &&
          <div onClick={() => showDetail(record._id)}>
            <BasePopover content={content} title={title}>
              <Content>
                <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
              </Content>
            </BasePopover>
          </div>
        )
      }
    },
    {
      title: t('common.skillImprove'),
      dataIndex: 'skillImprovement',
      width: '5%',
      editable: true,
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.skillImprovement.toLowerCase().localeCompare(b.skillImprovement.toLowerCase()),
      showSorterTooltip: false,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Skill Improve';
        const content = <div dangerouslySetInnerHTML={{ __html: record.skillImprovement?.split('\n').join('<br>') }} />

        return (
          record.skillImprovement &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.plan'),
      dataIndex: 'plan',
      width: '5%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.plan.toLowerCase().localeCompare(b.plan.toLowerCase()),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Plan';
        const content = <div dangerouslySetInnerHTML={{ __html: record.plan?.split('\n').join('<br>') }} />

        return (
          record.plan &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.request'),
      dataIndex: 'request',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.request.toLowerCase().localeCompare(b.request.toLowerCase()),
      showSorterTooltip: false,
      width: '5%',
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Request';
        const content = <div dangerouslySetInnerHTML={{ __html: record.request?.split('\n').join('<br>') }} />

        return (
          record.request &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.other'),
      dataIndex: 'other',
      width: '5%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.other?.toLowerCase().localeCompare(b.other?.toLowerCase()),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Other';
        const content = <div dangerouslySetInnerHTML={{ __html: record.other?.split('\n').join('<br>') }} />

        return (
          record.other &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.newJobEarned'),
      dataIndex: 'newJobEarned',
      width: '5%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.newJobEarned?.toLowerCase().localeCompare(b.newJobEarned?.toLowerCase()),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = t('common.newJobEarned');
        const content = <div dangerouslySetInnerHTML={{ __html: record.newJobEarned?.split('\n').join('<br>') }} />

        return (
          record.newJobEarned &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.estimated'),
      dataIndex: 'estimated',
      width: '5%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.estimated?.toLowerCase().localeCompare(b.estimated?.toLowerCase()),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Estimated';
        const content = <div dangerouslySetInnerHTML={{ __html: record.estimated?.split('\n').join('<br>') }} />

        return (
          record.estimated &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.note'),
      dataIndex: 'note',
      width: '5%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => a.note?.toLowerCase().localeCompare(b.note?.toLowerCase()),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const title = 'Note';
        const content = <div dangerouslySetInnerHTML={{ __html: record.note?.split('\n').join('<br>') }} />

        return (
          record.note &&
          <BasePopover content={content} title={title}>
            <Content>
              <ExclamationCircleOutlined onClick={() => showDetail(record._id)} rev="default value" />
            </Content>
          </BasePopover>
        )
      }
    },
    {
      title: t('common.edit'),
      dataIndex: 'edit',
      width: '5%',
      editable: false,
      render: (text: string, record: BasicReportTableRow) => {

        return (
          <>
            {(record.userName === user?.userName && viewReportItem === 'a') && <EditOutlined onClick={handlEditReport} style={{ color: 'black' }}
              onMouseEnter={event => (event.target as HTMLElement).style.color = 'red'}
              onMouseLeave={event => (event.target as HTMLElement).style.color = 'black'}
            />}
          </>
        )
      }
    },
    {
      title: t('common.createdAt'),
      dataIndex: 'createdAt',
      width: '15%',
      sorter: (a: BasicReportTableRow, b: BasicReportTableRow) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      showSorterTooltip: false,
      editable: true,
      render: (text: string, record: BasicReportTableRow) => {

        const datePbj = new Date(record.updatedAt);
        const formattedDate = datePbj.toISOString().replace("T", " ").slice(0, 16);

        const newDate = moment(record.updatedAt).format('YYYY-MM-DD hh:mm');

        return (
          record.updatedAt &&
          <>
            {
              formattedDate
            }
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

      {
        isModalOpen &&
        <BaseModal
          centered
          open={isModalOpen}
          onOk={handleModalCancel}
          onCancel={handleModalCancel}
          size="large"
          closable={false}
          footer={null}
        >
          <ReportDetailCard reportData={sildeData.data} />
          {/* <CustomSlide content={sildeData.data}/> */}
        </BaseModal>}
    </>
  );
};
