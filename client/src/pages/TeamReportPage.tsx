import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Reports } from '@app/components/reports/Reports';

const TeamReportPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.teamReport')}</PageTitle>
      <Reports />
    </>
  );
};

export default TeamReportPage;
