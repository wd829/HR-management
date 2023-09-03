import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Reports } from '@app/components/reports/Reports';

const ReportPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.reports')}</PageTitle>
      <Reports />
    </>
  );
};

export default ReportPage;
