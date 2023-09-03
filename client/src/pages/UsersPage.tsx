import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Users } from '@app/components/users/Users';

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.users')}</PageTitle>
      <Users />
    </>
  );
};

export default UsersPage;
