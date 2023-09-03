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
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { BasicTableRow, getUserTableData } from '@app/api/user.api';
import { updateUserStacks } from '@app/api/user.api';
import { deleteUserData, getUserStatusType } from '@app/api/user.api';
import { notificationController } from '@app/controllers/notificationController';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { getAllGroupNamesFree } from '@app/api/score.api';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 100,
};

interface UserListTableProps {

  query: string

}

export const UserListTable: React.FC<UserListTableProps> = ({ query }) => {

  const [form] = BaseForm.useForm();

  const { user: authUser } = useAppSelector((state) => state.user);

  const { userStatusType } = useAppSelector((state) => state.dropDownValue);

  const [searchData, setSearchData] = React.useState<{ data: BasicTableRow[] }>({ data: [] });
  const [selectingKey, setSelectingKey] = useState('')
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const [editingKey, setEditingKey] = useState('');

  const { t } = useTranslation();

  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination) => {

      setTableData((tableData) => ({ ...tableData, loading: true }));

      getUserTableData().then((res) => {
        if (isMounted.current) {

          const newData = res.data.map((elem) => { return { ...elem, key: elem._id } });

          setTableData({ ...tableData, data: newData, pagination: pagination, loading: false });

        }
        else {
          setTableData((tableData) => ({ ...tableData, loading: false }));
        }
      })
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  React.useEffect(() => {

    const newData = tableData.data.map((item, index) => { return { ...item, order: index + 1 } })
      .filter((item) => {
        return item.userName?.toLowerCase().includes(query.toLowerCase())
          || item.teamNo?.toLowerCase().includes(query.toLowerCase()) || item.stacks?.toLowerCase().includes(query.toLowerCase())
          || item.firstName?.toLowerCase().includes(query.toLowerCase()) || item.lastName?.toLowerCase().includes(query.toLowerCase())
          || item.status?.toLowerCase().includes(query.toLowerCase())
      });

    if (newData) {

      setSearchData({ data: newData });

    }
  }, [query, tableData])

  const handleTableChange = (pagination: Pagination) => {

    fetch(pagination);

    cancel();

  };

  const isEditing = (record: BasicTableRow) => record._id === editingKey;

  const edit = (record: Partial<BasicTableRow>) => {

    form.setFieldsValue({ firstName: '', lastName: '', userName: '', stacks: '', ...record });

    setEditingKey(record._id || '');

  };

  const cancel = () => {
    setEditingKey('');
  };

  const statusObject: { value: String }[] = userStatusType.map((item) => {
    return { value: item };
  });

  const save = async (key: string) => {

    try {

      const row = (await form.validateFields()) as BasicTableRow;

      updateUserStacks({ row, key })
        .then(res => {
          if (isMounted.current) {
            const newData = [...tableData.data];
            const index = newData.findIndex((item) => item._id === res.data._id);
            newData[index] = res.data;
            setTableData({ ...tableData, data: newData, loading: false });
          }
        })

      setEditingKey('');

    } catch (errInfo) {

      console.log('Validate Failed:', errInfo);

    }
  };

  const handleDeleteRow = (rowId: string) => {

    deleteUserData({ rowId }).then((res) => {
      if (isMounted.current) {
        const newData = [...tableData.data].filter(({ _id }) => _id !== res.data._id);
        setTableData({ ...tableData, data: newData, loading: false });
      }
    })
      .catch(e => {

        console.log('An error has occured', e)

      });
  };

  const handleSelecStatus = (key: string) => {

    setSelectingKey(key)

    // const teamSelectValue = form.getFieldValue('team');

    // const newData = [...tableData.data];

    // const index = newData.findIndex(({ _id }) => key === _id)

    // // newData[index].role = roleSelectValue;
    // newData[index] = { ...newData[index], teamNo: teamSelectValue };

    // setTableData({ ...tableData, data: newData })

  }

  const columns = [
    {
      title: "No",
      // dataIndex: 'order',
      width: '1%',
      editable: false,
      role: ['admin', 'general'],
      render: (text: string, record: BasicTableRow, rowIndex: number) => {
        return rowIndex + 1;
      }
    },
    {
      title: t('common.teamName'),
      dataIndex: 'teamNo',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.teamNo.toLowerCase().localeCompare(b.teamNo.toLowerCase()),
      showSorterTooltip: false,
      width: '1%',
      role: ['admin', 'general'],
    },
    {
      title: t('common.fullName'),
      dataIndex: 'fullName',
      sorter: (a: BasicTableRow, b: BasicTableRow) => (a.lastName + ' ' + a.firstName).toLowerCase().localeCompare(b.lastName + ' ' + b.firstName.toLowerCase()),
      showSorterTooltip: false,
      width: '5%',
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
      title: t('common.group'),
      dataIndex: 'group',
      width: '1%',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.group?.toLowerCase().localeCompare(b.group?.toLowerCase()),
      showSorterTooltip: false,
      role: ['admin', 'general'],
    },
    {
      title: t('common.username'),
      dataIndex: 'userName',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.userName.toLowerCase().localeCompare(b.userName.toLowerCase()),
      showSorterTooltip: false,
      width: '1%',
      editable: false,
      role: ['admin', 'general']
    },
    {
      title: t('common.ipMsgId'),
      dataIndex: 'ipMsgId',
      width: '1%',
      editable: false,
      role: ['admin', 'general']
    },
    {
      title: t('common.stacks'),
      dataIndex: 'stacks',
      width: '55%',
      editable: true,
      role: ['admin', 'general']
    },
    {
      title: t('common.note'),
      dataIndex: 'note',
      width: '20%',
      editable: true,
      role: ['admin', 'general']
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: '15%',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a?.status?.toLowerCase().localeCompare(b?.status?.toLowerCase()),
      showSorterTooltip: false,
      role: ['admin', 'general'],
      render: (text: string, record: BasicTableRow) => {

        let component = <></>;
        if (record.status === "Do Not Disturb") {
          component = <div style={{
            height: '2rem', width: '132.83px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'rgb(255, 82, 82)', border: '#ff0049', borderRadius: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'
          }}>{record.status}</div>
        }
        if (record.status === "Busy") {
          component = <div style={{
            height: '2rem', width: '56px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#FF525233', border: '#FF5252', borderRadius: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FF5252'
          }}>{record.status}</div>
        }
        if (record.status === "Available") {
          component = <div style={{
            height: '2rem', width: '120px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#30AF5B33', border: '#30AF5B', borderRadius: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#30AF5B'
          }}>{record.status}</div>
        }
        if (record.status === 'Idle') {
          component = <div style={{
            height: '2rem', width: '56px', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#01509A33', border: '#01509A', borderRadius: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#01509A'
          }}>{record.status}</div>
        }
        return (
          isEditing(record) ?
            <BaseButtonsForm.Item name="status">
              <BaseSelect placeholder={t('forms.validationFormLabels.status')} defaultValue={record.status}
                options={statusObject} onChange={() => handleSelecStatus(record._id)}>
              </BaseSelect>
            </BaseButtonsForm.Item>

            :
            <>
              {record.status ? (component) : "Please select a status"}
            </>
        )
      }
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      role: ['admin'],
      render: (text: string, record: BasicTableRow) => {
        const editable = isEditing(record);
        return (
          <BaseSpace>
            {editable ?
              (
                <>
                  <BaseButton type="primary" onClick={() => save(record._id)} size='small'>
                    {t('common.save')}
                  </BaseButton>
                  <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                    <BaseButton type="ghost" size='small'>{t('common.cancel')}</BaseButton>
                  </BasePopconfirm>
                </>
              )
              :
              (
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

  const mergedColumns = columns
    .filter(col => authUser && col.role.includes(authUser.role?.toLowerCase()))
    .map((col) => {
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
