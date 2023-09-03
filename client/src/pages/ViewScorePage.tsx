import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ViewScore } from '@app/components/viewScore/ViewScoreForm';

const ViewScorePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.view')}</PageTitle>
      <ViewScore />
    </>
  );
};

export default ViewScorePage;
