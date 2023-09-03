import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { UesrList } from '@app/components/userList/UserList';

const UserListPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.userList')}</PageTitle>
      <UesrList />
    </>
  );
};

export default UserListPage;
