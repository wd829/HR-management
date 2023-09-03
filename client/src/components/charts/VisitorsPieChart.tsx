import React from 'react';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { useTranslation } from 'react-i18next';
import { PieChart } from '../common/charts/PieChart';

export const VisitorsPieChart: React.FC = () => {
  const { t } = useTranslation();
  const data = [
    { value: 1048, name: t('charts.team1') },
    { value: 735, name: t('charts.team2') },
    { value: 580, name: t('charts.team3') },
    { value: 484, name: t('charts.team4') },
    { value: 300, name: t('charts.team5') },
  ];
  const name = t('charts.visitorsFrom');

  return (
    <BaseCard padding="0 0 1.875rem" title={t('charts.pie')}>
      <PieChart data={data} name={name} showLegend={true} />
    </BaseCard>
  );
};
