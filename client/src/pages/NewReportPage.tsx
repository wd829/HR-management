import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { NewReportForm } from '@app/components/newReport/NewReportForm';

const NewReportPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.new')}</PageTitle>
      <NewReportForm />
    </>
  );
};

export default NewReportPage;
