import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './TeamReportForm.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { getTeamMember } from '@app/store/slices/teamMemberSlice';
import TeamMemberComponent from './TeamMemberForm';
import { doTeamReport } from '@app/store/slices/reportSlice';
import { getLatestReport } from '@app/store/slices/teamReportSlice';
import { Dates } from '@app/constants/Dates';
import { message } from 'antd';

export interface TeamReportData {
  performed: string;
  issue: string;
  achieved: string;
  plan: string;
  requests: string;
  other: string;
  memberAchieved: string
}

const initValues: TeamReportData = {
  performed: '',
  issue: '',
  achieved: '',
  plan: '',
  requests: '',
  other: '',
  memberAchieved: ''
};

export const TeamReportForm: React.FC = () => {

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);

  const { t } = useTranslation();

  const { user } = useAppSelector((state) => state.user);

  const { team } = useAppSelector((state) => state.teamMember)

  //const { teamReport } = useAppSelector((state) => state.teamReport)

  const [report, setReport] = useState<string[]>([])

  React.useEffect(() => {
    if (user) {
      dispatch(getTeamMember({ id: user._id }))
    }
  }, [dispatch])

  // React.useEffect(() => {
  //   dispatch(getLatestReport(user?._id))
  // }, [dispatch])

  //setReport(teamReport)

  const userFormValues = useMemo(
    () =>
      user
        ? {
          firstName: user.firstName,
          lastName: user.lastName,
          nickname: user.userName,
          sex: user.sex,
          birthday: Dates.getDate(user.birthday),
          stacks: user.stacks
        }
        : initValues,
    [user],
  );

  const handleSubmit = (values: TeamReportData) => {
    setLoading(true);
    const userId = user?._id
    dispatch(doTeamReport({ userId, values }))
      .unwrap()
      .then(() => {
        notificationController.success({
          message: t('common.success'),
        });
        setLoading(false);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <BaseCard>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={report}>
        <S.Title>{t('common.teamReport')}</S.Title>
        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
          <BaseCol xs={24} md={12}>
            <S.FormItem
              name="performed"
              label={t('common.performed')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <S.FormInput.TextArea placeholder={t('common.performed')} />
            </S.FormItem>

            <S.FormItem
              name="issue"
              label={t('common.issue')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <S.FormInput.TextArea placeholder={t('common.issue')} />
            </S.FormItem>

            <S.FormItem
              name="achieved"
              label={t('common.achieved')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <S.FormInput.TextArea placeholder={t('common.achieved')} />
            </S.FormItem>

            <S.FormItem
              name="plan"
              label={t('common.plan')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <S.FormInput.TextArea placeholder={t('common.plan')} />
            </S.FormItem>

            <S.FormItem
              name="request"
              label={t('common.request')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <S.FormInput.TextArea placeholder={t('common.request')} />
            </S.FormItem>

            <S.FormItem
              name="other"
              label={t('common.other')}
              rules={[{ required: true, message: t('common.requiredField') }]}
            >
              <S.FormInput.TextArea placeholder={t('common.other')} />
            </S.FormItem>

          </BaseCol>

        </BaseRow>
      </BaseForm>
    </BaseCard>
  );
};
