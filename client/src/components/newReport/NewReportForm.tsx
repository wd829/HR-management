import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import * as S from './NewReportForm.styles'
import { BasicReportTableRow } from '@app/api/report.api';
import { doPersonalReport, getPersonalReportData } from '@app/api/report.api';
import { Navigate, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined, FrownOutlined } from '@ant-design/icons';
import { MehOutlined } from '@ant-design/icons';
import { SmileOutlined } from '@ant-design/icons';
import { BaseRate } from '@app/components/common/BaseRate/BaseRate';


export interface ReportFormData {
  performed: string;
  issue: string;
  achieved: string;
  plan: string;
  request: string;
  other: string;
  skillImprovement: string;
  newJobEarned: string,
  estimated: string,
  UserInfo: {
    firstName: string,
    lastName: string
  },
  note: string
}

const initialReportValues: BasicReportTableRow = {
  userName: '',
  _id: '',
  request: '',
  firstName: '',
  lastName: '',
  plan: '',
  achieved: '',
  issue: '',
  userTeam: '',
  performed: '',
  ipMsgId: '',
  other: '',
  key: '',
  updatedAt: '',
  date: '',
  createdAt: new Date,
  skillImprovement: '',
  newJobEarned: '',
  estimated: '',
  UserInfo: {
    firstName: '',
    lastName: ''
  },
  note: ''
};

export const NewReportForm: React.FC = () => {

  const { user } = useAppSelector((state) => state.user);

  const userId = user?._id;

  const [isFieldsChanged, setFieldsChanged] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const date = Date.now()

  React.useEffect(() => {
    getPersonalReportData({ userId: userId ? userId : '', date })
      .then(({ data }) => { if (data) form.setFieldsValue(data) })
      .catch(e => { console.log(e) })
  }, [])

  const navigate = useNavigate();
  const handleSubmit = (values: ReportFormData) => {

    const currentTime = Date.now()
    setLoading(true);
    const stringTime = moment(new Date(currentTime)).format('YYYY-MM-DD HH:mm:ss');

    const { performed, achieved, issue, plan, request, skillImprovement, other, newJobEarned, estimated } = values;

    if (performed.trim() === "" && achieved.trim() === "" && issue.trim() === "" && plan.trim() === ""
      && request.trim() === "" && skillImprovement.trim() === "" && other.trim() === "" && newJobEarned.trim() === "" && estimated.trim() === "") {
      notificationController.warning({ message: "Each field can't consist of spaces. Please try again." });
      setLoading(false);

      return;
    }

    doPersonalReport({ values, userId: userId ? userId : '', stringTime })
      .then(({ data }) => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({ message: t('common.success') });
        navigate('/personal/view', { replace: true });
        // <Navigate to="/personal/reports" replace />


      })
      .catch(error => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.error({ message: t(`common.error: ${error}`) });
      })
  }

  const customIcons = [
    <SmileOutlined key={1} />,
    <CheckCircleOutlined key={2} />,
    <ClockCircleOutlined key={3} />,
    <FireOutlined key={4}
      onMouseEnter={event => (event.target as HTMLElement).style.color = 'red'}
      onMouseLeave={event => (event.target as HTMLElement).style.color = 'grey'}
      onClick={event => (event.target as HTMLElement).style.color = 'red'} />,
  ];

  return (
    <BaseCard>
      <BaseButtonsForm
        form={form}
        name="info"
        loading={isLoading}
        initialValues={initialReportValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={handleSubmit}
      >
        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{marginBottom:'2rem'}}>
          <BaseCol span={12}>

            {/* <S.DoctorCard> */}
            <BaseRow gutter={{ xs: 10, md: 15, xl: 15 }}>
              <BaseCol span={24}>
                <BaseButtonsForm.Item>
                  <BaseButtonsForm.Title>{t('common.today')}</BaseButtonsForm.Title>
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="performed" label={t('common.done')}>
                  <BaseInput.TextArea placeholder='Write all things you have done today.' />
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="issue" label={t('common.issue')}>
                  <BaseInput.TextArea placeholder='Problems you have met.' />
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="achieved" label={t('common.achieved')}>
                  <BaseInput.TextArea placeholder='What you have solved or earn money. All things you solved' />
                </BaseButtonsForm.Item>
              </BaseCol>
              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="skillImprovement" label={t('common.skillImprove')}>
                  <BaseInput.TextArea placeholder='What have you done to improve your skills such as learning new language.' />
                </BaseButtonsForm.Item>
              </BaseCol>
              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="newJobEarned" label={t('common.newJobEarned')}>
                  <BaseInput.TextArea placeholder='Especially, write down about the jobs you acquired' />
                </BaseButtonsForm.Item>
              </BaseCol>

              {/* <BaseCol>
                <BaseSpace direction="vertical" size={10}>
                  <BaseRate defaultValue={3} character={({ index }) => customIcons[(index as number)]} />
                </BaseSpace>
              </BaseCol> */}

            </BaseRow>
            {/* </S.DoctorCard> */}
          </BaseCol>
          <BaseCol span={12}>
            {/* <S.DoctorCard> */}
            <BaseRow gutter={{ xs: 10, md: 15, xl: 15 }}>
              <BaseCol span={24}>
                <BaseButtonsForm.Item>
                  <BaseButtonsForm.Title>{t('common.tomorrow')}</BaseButtonsForm.Title>
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="plan" label={t('common.plan')}>
                  <BaseInput.TextArea placeholder='What are you going to do?' />
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="request" label={t('common.request')}>
                  <BaseInput.TextArea placeholder='What do you want?' />
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="estimated" label={t('common.estimated')}>
                  <BaseInput.TextArea placeholder='What is your expected salary?' />
                </BaseButtonsForm.Item>

              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="other" label={t('common.other')}>
                  <BaseInput.TextArea placeholder='Write your opinions such as your feeling about our site or some discussions.' />
                </BaseButtonsForm.Item>
              </BaseCol>

              <BaseCol xs={24}>
                <BaseButtonsForm.Item name="note" label={t('common.note')}>
                  <BaseInput.TextArea placeholder='Write anything you want or about yours. For example, Today was very good' />
                </BaseButtonsForm.Item>
              </BaseCol>
            </BaseRow>
            {/* </S.DoctorCard> */}
          </BaseCol>
        </BaseRow>
      </BaseButtonsForm>
    </BaseCard>
  );
};
