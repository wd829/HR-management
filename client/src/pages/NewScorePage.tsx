import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { NewScore } from '@app/components/newScore/NewScoreForm';

const NewScorePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.new')}</PageTitle>
      <NewScore />
    </>
  );
};

export default NewScorePage;
