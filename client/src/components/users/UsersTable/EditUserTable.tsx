import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination } from 'api/table.api';
import { EditableCell } from './EditUserCell';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { BasicTableRow, deleteUserData, getUserTableData } from '@app/api/user.api';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { doAllow } from '@app/store/slices/userDataTableSlice';
import { notificationController } from '@app/controllers/notificationController';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Text } from '@app/components/newReport/NewReportForm.styles';
import { getAllTeamNames, getAllGroupNamesFree } from '@app/api/score.api';
import { saveUserData } from '@app/api/user.api';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 100,
};

interface UsersTableProps {

  query: string

}

export const UserTable: React.FC<UsersTableProps> = ({ query }) => {

  const dispatch = useAppDispatch();

  const [form] = BaseForm.useForm();

  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const [searchData, setSearchData] = React.useState<{ data: BasicTableRow[] }>({ data: [] });

  React.useEffect(() => {

    const newData = tableData.data.map((item, index) => { return { ...item, order: index + 1 } })
      .filter((item) => {
        return item.userName?.toLowerCase().includes(query.toLowerCase())
          || item.teamNo?.toLowerCase().includes(query.toLowerCase()) || item.roomNo?.toLowerCase().includes(query.toLowerCase())
          || item.firstName?.toLowerCase().includes(query.toLowerCase()) || item.lastName?.toLowerCase().includes(query.toLowerCase())
          || item.group?.toLowerCase().includes(query.toLowerCase())
      });

    if (newData) {
      setSearchData({ data: newData })
    }

  }, [query, tableData])

  const [editingKey, setEditingKey] = useState('');
  const [loadingKey, setLoadingKey] = useState('');
  const [selectingKey, setSelectingKey] = useState('')
  const [editStatus, setEditStatus] = useState(false)

  const { t } = useTranslation();

  const { isMounted } = useMounted();

  const [teamOptionValue, setTeamOptionValue] = React.useState<string[]>([])

  React.useEffect(() => {
    getAllTeamNames().then((res) => setTeamOptionValue(res.data))
  }, [])

  const teamObject: { value: string }[] = teamOptionValue.map((item) => {
    return { value: item };
  });

  const [groupOptionValue, setGroupOptionValue] = React.useState<string[]>([])

  React.useEffect(() => {
    getAllGroupNamesFree().then((res) => setGroupOptionValue(res.data))
  }, [])

  const groupObject: { value: string }[] = groupOptionValue.map((item) => {
    return { value: item };
  });

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getUserTableData().then((res) => {
        if (isMounted.current) {
          const newData = res.data.map((elem) => { return { ...elem, key: elem._id } })
          setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });
        }
        else {
          setTableData((tableData) => ({ ...tableData, loading: false }));
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const options = [
    { value: t('selects.general') },
    { value: t('selects.teamLeader') },
    { value: t('selects.admin') },
  ];

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
    cancel();
  };

  const isEditing = (record: BasicTableRow) => record._id === editingKey;
  const isLoading = (record: BasicTableRow) => record._id === loadingKey;
  const isSelecting = (record: BasicTableRow) => record._id === selectingKey;

  const edit = (record: Partial<BasicTableRow>) => {
    form.setFieldsValue({ firstName: '', lastName: '', userName: '', role: 'Please select a role', ...record });
    setEditingKey(record._id || '');
    setEditStatus(true);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const allow = async (id: string) => {
    try {

      setLoadingKey(id);

      const row = (await form.validateFields()) as BasicTableRow;

      if (row.role === 'Please select a role') return

      const role = row.role

      dispatch(doAllow({ id, role }))
        .unwrap()
        .then((data) => {
          notificationController.success({
            message: t('common.success'),
          });
          setLoadingKey('');
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          setLoadingKey('');
        });
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleSelect = (key: string) => {

    setSelectingKey(key)

    const roleSelectValue = form.getFieldValue('role');

    const newData = [...tableData.data];

    const index = newData.findIndex(({ _id }) => key === _id)

    // newData[index].role = roleSelectValue;
    newData[index] = { ...newData[index], role: roleSelectValue };

    setTableData({ ...tableData, data: newData })

  }

  const handleSelectTeamName = (key: string) => {

    setSelectingKey(key)

    // const teamSelectValue = form.getFieldValue('team');

    // const newData = [...tableData.data];

    // const index = newData.findIndex(({ _id }) => key === _id)

    // // newData[index].role = roleSelectValue;
    // newData[index] = { ...newData[index], teamNo: teamSelectValue };

    // setTableData({ ...tableData, data: newData })

  }

  const save = async (key: string) => {
    try {

      const row = (await form.validateFields()) as BasicTableRow;

      saveUserData({ row, key }).then((res) => {
        if (isMounted.current) {
          const newData = [...tableData.data];
          const index = newData.findIndex((item) => item._id === res.data._id);
          newData[index] = res.data;
          setTableData({ ...tableData, data: newData, loading: false });

        }
      });

      setEditingKey('');

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDeleteRow = (rowId: string) => {

    deleteUserData({ rowId }).then((res) => {
      if (isMounted.current) {
        const newData = [...tableData.data].filter(({ _id }) => _id !== res.data._id)
        setTableData({ ...tableData, data: newData, loading: false });
      }
    });
  };

  const columns = [
    {
      title: t('common.no'),
      // dataIndex: 'order',
      width: '2%',
      editable: true,
      // accessor: (_row: any, i:number) => i+1
      render: (text: string, record: BasicTableRow, rowIndex: number) => {
        return rowIndex + 1;
      }
    },
    {
      title: t('common.teamName'),
      dataIndex: 'teamName',
      width: '5%',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.teamNo.toLowerCase().localeCompare(b.teamNo.toLowerCase()),
      showSorterTooltip: false,
      render: (text: string, record: BasicTableRow) => {

        return (
          isEditing(record) ?
            <BaseButtonsForm.Item name="teamName">
              <BaseSelect placeholder={t('forms.validationFormLabels.team')} defaultValue={record.teamNo}
                options={teamObject} onChange={() => handleSelectTeamName(record._id)}>
              </BaseSelect>
            </BaseButtonsForm.Item>
            :
            <>{record.teamNo ? record.teamNo : "Please select a team"}</>
        );
      },
    },
    {
      title: t('common.group'),
      dataIndex: 'group',
      width: '10%',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.group?.toLowerCase().localeCompare(b.group?.toLowerCase()),
      showSorterTooltip: false,
      render: (text: string, record: BasicTableRow) => {

        return (
          isEditing(record) ?
            <BaseButtonsForm.Item name="group">
              <BaseSelect placeholder={t('forms.validationFormLabels.team')} defaultValue={record.group}
                options={groupObject} onChange={() => handleSelectTeamName(record._id)}>
              </BaseSelect>
            </BaseButtonsForm.Item>
            :
            <>{record.group ? record.group : "Please select a group"}</>
        );
      },
    },
    {
      title: t('common.fullName'),
      dataIndex: 'fullName',
      sorter: (a: BasicTableRow, b: BasicTableRow) => (a.lastName + ' ' + a.firstName).toLowerCase().localeCompare(b.lastName + ' ' + b.firstName.toLowerCase()),
      showSorterTooltip: false,
      width: '10%',
      editable: false,
      role: ['admin', 'general'],
      render: (text: string, record: BasicTableRow) => {
        return (
          record.firstName && record.lastName &&
          <>{record.lastName + ' ' + record.firstName}</>
        )
      }
    },
    {
      title: t('common.userName'),
      dataIndex: 'userName',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.userName.toLowerCase().localeCompare(b.userName.toLowerCase()),
      showSorterTooltip: false,
      width: '5%',
      editable: true,
    },

    {
      title: "Birthday",
      dataIndex: 'birthday',
      sorter: (a: BasicTableRow, b: BasicTableRow) => parseInt(a.roomNo) - parseInt(b.roomNo),
      showSorterTooltip: false,
      width: '5%',
      editable: true,
      render: (text: string, record: BasicTableRow) => {

        const birthday = record?.birthday
        const formatBirthDay = (new Date(birthday)).toISOString().split('T')[0].replace(/-/g, '/');
        return (
          <>{formatBirthDay}</>
        );
      },
    },
    {
      title: "Room No",
      dataIndex: 'roomNo',
      sorter: (a: BasicTableRow, b: BasicTableRow) => parseInt(a.roomNo) - parseInt(b.roomNo),
      showSorterTooltip: false,
      width: '5%',
      editable: true,
    },
    {
      title: t('common.ipAddress'),
      dataIndex: 'ipAddress',
      width: '8%',
      editable: true,
    },
    {
      title: t('common.ipMsgId'),
      dataIndex: 'ipMsgId',
      width: '5%',
      editable: true,
    },
    {
      title: t('tables.roles'),
      dataIndex: 'role',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.role.toLowerCase().localeCompare(b.role.toLowerCase()),
      showSorterTooltip: false,
      width: '5%',
      render: (text: string, record: BasicTableRow) => {

        return (
          isEditing(record) ?
            <BaseButtonsForm.Item name="role">
              <BaseSelect placeholder={t('forms.validationFormLabels.role')} defaultValue={record.role}
                options={options} onChange={() => handleSelect(record._id)}>
              </BaseSelect>
            </BaseButtonsForm.Item>
            :
            <>{record.role ? record.role : "Please select a role"}</>
        );
      },
    },
    {
      title: t('tables.approve'),
      dataIndex: 'approve',
      width: '1%',
      render: (text: string, record: BasicTableRow) => {

        const approved = record.approve

        return (
          <BaseSpace>
            {approved ? (
              <>
                <BaseButton type="primary" size='small'>
                  {t('common.approved')}
                </BaseButton>
              </>
            ) : (
              <>
                <BaseButton type="ghost" onClick={() => { allow(record._id) }} loading={isLoading(record)} size='small'>
                  {t('common.approve')}
                </BaseButton>
              </>
            )}
          </BaseSpace>
        );
      },
    },

    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '1%',
      render: (text: string, record: BasicTableRow) => {
        const editable = isEditing(record);
        return (
          <BaseSpace>
            {editable ? (
              <>
                <BaseButton type="primary" onClick={() => save(record._id)} size='small'>
                  {t('common.save')}
                </BaseButton>
                <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <BaseButton type="ghost" size='small'>{t('common.cancel')}</BaseButton>
                </BasePopconfirm>
              </>
            ) : (
              <>
                <BaseButton type="ghost" disabled={isEditing(record)} onClick={() => edit(record)} size='small'>
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
        editing: isEditing(record),
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
  );
};
