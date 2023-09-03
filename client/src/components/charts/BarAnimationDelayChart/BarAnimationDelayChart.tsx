import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { BasicAllScoreData } from '@app/api/score.api';

interface ScoreChartsProps {

  scoredData: BasicAllScoreData[];
  annualScoreData: BasicAllScoreData[];
}

export const BarAnimationDelayChart: React.FC<ScoreChartsProps> = ({ scoredData, annualScoreData }) => {
  const { t } = useTranslation();
  const { theme } = useAppSelector((state) => state.theme);

  if (!scoredData) {
    return
  }
  const chartsData = [...scoredData];
  const chartsAnnualData = [...annualScoreData];

  chartsData.sort((a, b) => a?.teamName?.localeCompare(b?.teamName));
  chartsAnnualData.sort((a, b) => a?.teamName?.localeCompare(b?.teamName));

  const [data, setData] = useState<{
    data1: number[];
    // data2: number[];
    xAxisData: string[]
  }>({
    data1: [],
    // data2: [],
    xAxisData: [],
  });

  useEffect(() => {
    const xAxisData: string[] = [];
    const data1: number[] = [];
    const data2: number[] = [];

    if (chartsData) {
      for (let i = 0; i < chartsData.length; i++) {
        xAxisData.push(`${chartsData[i].userName}`);
        data1.push(parseFloat(chartsData[i].annual.replace(/,/g, "")));
        data2.push(parseFloat(chartsAnnualData[i].monthlyProfit.replace(/,/g, "")))
      }
      // setData({ data1, data2, xAxisData });
      setData({ data1, xAxisData });

    }

  }, [scoredData]);

  const option = {
    legend: {
      // data: [t('common.thisMonth'), t('common.annual')],
      data: [t('common.thisMonth')],
     
      left: 20,
      top: 0,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 0,
      top: 70,
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      data: data?.xAxisData,
      splitLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      name: t('charts.averageValue'),
      nameTextStyle: {
        padding: [0, -24],
        align: 'left',
      },
    },
    series: [
      {
        name: t('common.thisMonth'),
        type: 'bar',
        data: data?.data1,
        color: themeObject[theme].chartColor2,
        emphasis: {
          focus: 'series',
        },
        animationDelay: (idx: number) => idx * 10,
      },
      // {
      //   name: t('common.annual'),
      //   type: 'bar',
      //   data: data?.data2,
      //   color: themeObject[theme].chartColor3,
      //   emphasis: {
      //     focus: 'series',
      //   },
      //   animationDelay: (idx: number) => idx * 10,
      // },

    ],
    animationEasing: 'elasticOut',
  };
  return (
    <BaseCard padding="0 0 2rem" title={t('charts.rank')} style={{ marginLeft: '1rem', marginRight: '1rem' }} >
      <BaseChart option={option} />
    </BaseCard>
  );
};
