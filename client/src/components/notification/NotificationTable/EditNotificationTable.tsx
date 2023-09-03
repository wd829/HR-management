import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { EditableCell } from './EditNotificationCell';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { RangeValue } from 'rc-picker/lib/interface.d';
import { AppDate, Dates } from '@app/constants/Dates';
import moment from 'moment';
import { LoadingOutlined, RedoOutlined, ChromeOutlined } from '@ant-design/icons';
import { getNotificationData, getNotificationDatawithViewItem } from '@app/api/user.api';
import { NotificationData } from '@app/api/user.api';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { updateAlarm, deleteAlarm } from '@app/api/user.api';
import { notificationController } from '@app/controllers/notificationController';
import { BaseCard } from '../../common/BaseCard/BaseCard';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 100,
};

interface NotificationTableProps {
  timeRange: RangeValue<AppDate>;
  query: string;
  viewReportItem: string,
  newAlarmStatus: boolean,
}

export const NotificationTable: React.FC<NotificationTableProps> = ({ timeRange, query, viewReportItem, newAlarmStatus }) => {

  const [form] = BaseForm.useForm();
  const { theme } = useAppSelector((state) => state.theme)
  const { user: authUser } = useAppSelector((state) => state.user);

  const [tableData, setTableData] = useState<{ data: NotificationData[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const { isMounted } = useMounted();

  const [searchData, setSearchData] = React.useState<{ data: NotificationData[] }>({ data: [] });

  const [sildeData, setSlideData] = React.useState<{ data: NotificationData[] }>({ data: [] })

  const [sortedInfo, setSortedInfo] = React.useState<NotificationData[]>([])

  const [paginationNumber, setPaginationNumber] = React.useState(0)
  const [isAlarmModalOpen, setAlarmModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [selectedRecordId, setSelectedRecordId] = React.useState('')
  const [sortStatus, setSortStatus] = React.useState('')

  const fetch = useCallback(
    (pagination: Pagination) => {

      setTableData((tableData) => ({ ...tableData, loading: true }));

      if (authUser) {

        const userId = authUser?._id;

        if (timeRange) {

          const startTime = moment(timeRange[0]?.toDate().setHours(8, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');

          const endTime = moment(timeRange[1]?.toDate()).add(1, 'day').set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss')

          if (startTime && endTime && (viewReportItem === 'd')) {
            getNotificationData({ startTime, endTime, userId })
              .then((res) => {
                if (isMounted.current) {

                  const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })

                  setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });


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

          getNotificationDatawithViewItem({ viewReportItem, userId })
            .then((res) => {
              if (isMounted.current) {

                const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })

                setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });


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
    [isMounted, timeRange, viewReportItem, newAlarmStatus],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  React.useEffect(() => {

    const newData = tableData.data.map((item, index) => { return { ...item, order: index + 1 } })
      .filter((item) => {
        return item.userName?.toLowerCase().includes(query.toLowerCase()) || item.title?.toLowerCase().includes(query.toLowerCase())
          || item.content?.toLowerCase().includes(query.toLowerCase())
      });

    if (newData) {
      setSearchData({ data: newData });
    }

  }, [query, tableData])

  const handleAlarmModalCancel = () => {
    setAlarmModalOpen(false);
    setEditButtonChange(false);
  }

  const handleAlarmButton = () => {
    setAlarmModalOpen(true);
  }

  const handleAlarmModalOk = () => {

    const userName = authUser?.lastName + ' ' + authUser?.firstName;

    setEditButtonChange(false);

    const currentTime = Date.now();

    const createdAt = moment(new Date(currentTime)).format('YYYY-MM-DD HH:mm:ss');

    if (title && content && selectedRecordId) {
      const row = { title, content };
      const key = selectedRecordId;
      updateAlarm({ row, key }).then(res => {
        const newData = [...tableData.data].filter(({ _id }) => _id !== res.data._id);

        newData.unshift(res.data);

        setTableData({ ...tableData, data: newData });

        setEditingKey('');
      }).catch(e => {
        notificationController.error({ message: e.message })
      })

      setEditingKey('');

    }
    setAlarmModalOpen(false)
  }

  const [editingKey, setEditingKey] = useState('');

  const [editButtonChange, setEditButtonChange] = useState(false)

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleDeleteRow = (rowId: string) => {

    deleteAlarm({ rowId }).then((res) => {
      if (isMounted.current) {
        const newData = [...tableData.data].filter(({ _id }) => _id !== res.data._id);
        setTableData({ ...tableData, data: newData, loading: false });
      }
    })
      .catch(e => {

        console.log('An error has occured', e)

      });
  };

  const { t } = useTranslation();

  const edit = (record: Partial<NotificationData>) => {

    // const row = (await form.validateFields()) as NotificationData;

    // form.setFieldsValue({ firstName: '', lastName: '', userName: '', stacks: '', ...record });

    const { title, content, _id } = record;

    console.log('===title and content===============', record._id)

    setEditButtonChange(true)

    setEditingKey(record._id || '');

    setAlarmModalOpen(true);

    if (title && content && _id) {
      setTitle(title);
      setSelectedRecordId(_id);
      setContent(content);
    }
  };

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

  const isEditing = (record: NotificationData) => record._id === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const handleInputChange = (event: any) => {
    setTitle(event.target.value)
  }

  const handleContentChange = (event: any) => {
    setContent(event.target.value)
  }

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

  const save = async (key: string) => {

    try {

      const row = (await form.validateFields()) as NotificationData;

      updateAlarm({ row, key }).then(res => {
        const newData = [...tableData.data].filter(({ _id }) => _id !== res.data._id);

        newData.unshift(res.data);

        setTableData({ ...tableData, data: newData });

        setEditingKey('');
      }).catch(e => {
        notificationController.error({ message: e.message })
      })

      setEditingKey('');

    } catch (errInfo) {

      console.log('Validate Failed:', errInfo);

    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSlideData({ data: [] })
  }

  const columns = [
    {
      title: t('common.no'),
      width: '1%',
      editable: false,
      role: ['admin', 'general'],
      render: (text: string, record: NotificationData, rowIndex: number) => {
        return rowIndex + 1 + paginationNumber;
      }
    },

    {
      title: t('common.fullName'),
      dataIndex: 'userName',
      sorter: (a: NotificationData, b: NotificationData) => (a.userName).toLowerCase().localeCompare(b.userName.toLowerCase()),
      showSorterTooltip: false,
      width: '10%',
      editable: false,
      role: ['admin', 'general'],
      render: (text: string, record: NotificationData) => {

        return (
          record.userName &&
          <>
            {record.userName}

          </>
        )
      }
    },
    {
      title: t('common.title'),
      dataIndex: 'title',
      width: '25%',
      role: ['admin', 'general'],
      sorter: (a: NotificationData, b: NotificationData) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      showSorterTooltip: false,
      editable: false,
      render: (text: string, record: NotificationData) => {

        return (
          record.title &&
          <>{record.title}</>
        )
      }
    },
    {
      title: t('common.content'),
      dataIndex: 'content',
      width: '55%',
      role: ['admin', 'general'],
      editable: false,
      sorter: (a: NotificationData, b: NotificationData) => a.content.toLowerCase().localeCompare(b.content.toLowerCase()),
      showSorterTooltip: false,
      render: (text: string, record: NotificationData) => {

        const content = <div dangerouslySetInnerHTML={{ __html: record.content?.split('\n').join('<br>') }} />

        return (
          record.content &&
          <>{content}</>
        )
      }
    },
    {
      title: t('common.createdAt'),
      dataIndex: 'createdAt',
      width: '15%',
      role: ['admin', 'general'],
      sorter: (a: NotificationData, b: NotificationData) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      showSorterTooltip: false,
      editable: false,
      render: (text: string, record: NotificationData) => {

        const datePbj = moment(record.updatedAt);
        const formattedDate = datePbj.format('YYYY-MM-DD hh:mm');

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
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '5%',
      role: ['admin'],
      render: (text: string, record: NotificationData) => {
        const editable = isEditing(record);
        const antIcon2 = <RedoOutlined style={{ fontSize: 24 }} spin />;

        return (
          <BaseSpace>
            {editButtonChange ?
              (
                <>
                  <BaseSpin spinning={editButtonChange}>
                    <BaseButton type="primary" onClick={() => save(record._id)} size='small'>
                      {t('common.save')}
                    </BaseButton>
                  </BaseSpin>
                  <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                    <BaseButton type="ghost" size='small'>{t('common.cancel')}</BaseButton>
                  </BasePopconfirm>
                </>
              )
              :
              (
                <>
                  <BaseButton type="ghost" onClick={() => edit(record)} size='small'>
                    {t('common.edit')}
                  </BaseButton>
                  <BasePopconfirm title={t('tables.deleteInfo')} onConfirm={() => handleDeleteRow(record._id)}>
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

  const mergedColumns = columns.filter(col => authUser && col.role.includes(authUser.role?.toLowerCase())).map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: NotificationData) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const backgroundColor = {
    backgroundColor: theme === 'dark' ? '#25284B' : '#ffffff', borderRadius: '7px'
  };

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

      {isAlarmModalOpen &&
        <div id="AlarmModarlOpenDialog">
          <BaseModal
            centered
            open={isAlarmModalOpen}
            onOk={handleAlarmModalOk}
            onCancel={handleAlarmModalCancel}
            size="large"
            closable={false}
            style={backgroundColor}
          >
            <BaseCard title={t('common.notification')} style={{ boxShadow: 'none' }}>
              <BaseForm form={form} component={false}>
                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                  <BaseCol span={24}>
                    <BaseButtonsForm.Item name="title" label={t('common.title')}>
                      <BaseInput defaultValue={title} onChange={handleInputChange} />
                    </BaseButtonsForm.Item>
                  </BaseCol>

                  <BaseCol span={24}>
                    <BaseButtonsForm.Item name="content" label={t('common.content')} id={'notificationTextAreaSize'}>
                      <BaseInput.TextArea defaultValue={content} size='large' onChange={handleContentChange} />
                    </BaseButtonsForm.Item>
                  </BaseCol>
                </BaseRow>
              </BaseForm>
            </BaseCard>
          </BaseModal>
        </div>
      }
    </>
  );
};
