import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { SexItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/SexItem/SexItem';
import { BirthdayItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { doSaveUserProfile, doGetUserProfile } from '@app/store/slices/userSlice';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { getAllTeamNames, getAllGroupNamesFree } from '@app/api/score.api';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { getUserStatusType } from '@app/api/user.api';

export interface PersonalInfoFormValues {
  birthday?: string;
  lastName: string;
  website: string;
  userName: string;
  sex?: string;
  firstName: string;
  stacks: string;
  role: string;
  ipAddress: string;
  ipMsgId: string;
  netKeyId: string;
  roomNo: string;
  teamNo: string;
  status: string,
  note: string
}

const initialPersonalInfoValues: PersonalInfoFormValues = {
  firstName: '',
  lastName: '',
  userName: '',
  sex: undefined,
  birthday: undefined,
  website: '',
  stacks: '',
  role: '',
  ipAddress: '',
  ipMsgId: '',
  netKeyId: '',
  roomNo: '',
  teamNo: '',
  status: '',
  note: ''
};

export const PersonalInfo: React.FC = () => {

  const { user } = useAppSelector((state) => state.user);

  const userId = user?._id;

  const { teamOptionValue, groupOptionValue, userStatusType } = useAppSelector((state) => state.dropDownValue)

  const [isFieldsChanged, setFieldsChanged] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const userFormValues = useMemo(
    () =>
      user
        ? {
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          sex: user.sex,
          birthday: Dates.getDate(user.birthday),
          stacks: user.stacks,
          role: user.role,
          ipAddress: user.ipAddress,
          ipMsgId: user.ipMsgId,
          netKeyId: user.netKeyId,
          roomNo: user.roomNo,
          teamNo: user.teamNo,
          status: user.status,
          note: user.note
        }
        : initialPersonalInfoValues,
    [user],
  );

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const dispatch = useAppDispatch()

  React.useEffect(() => {

    dispatch(doGetUserProfile({ userId }))

  }, [dispatch])

  // const [teamOptionValue, setTeamOptionValue] = React.useState<string[]>([])

  // React.useEffect(() => {
  //   getAllTeamNames().then((res) => setTeamOptionValue(res.data))
  // }, [])

  const teamObject: { value: String }[] = teamOptionValue.map((item) => {
    return { value: item };
  });


  // const [groupOptionValue, setGroupOptionValue] = React.useState<string[]>([])

  // React.useEffect(() => {
  //   getAllGroupNamesFree().then((res) => setGroupOptionValue(res.data))
  // }, [])

  const groupObject: { value: String }[] = groupOptionValue.map((item) => {
    return { value: item };
  });

  // const [statusOptionValue, setStatusOptionValue] = React.useState<string[]>([])

  // React.useEffect(() => {
  //   getUserStatusType().then((res) => setStatusOptionValue(res.data))
  // }, [])

  const statusObject: { value: String }[] = userStatusType.map((item) => {
    return { value: item };
  });

  const handleSubmit = (values: PersonalInfoFormValues) => {

    setLoading(true);
    dispatch(doSaveUserProfile({ values, userId }))
      .then(() => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({ message: t('common.success') });
      })
      .catch(error => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.error({ message: t(`common.error: ${error}`) });
      })
  }


  return (
    <BaseCard>
      <BaseButtonsForm
        form={form}
        name="info"
        loading={isLoading}
        initialValues={userFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={handleSubmit}
      >
        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.title')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="firstName" label={t('common.firstName')}>
              <BaseInput />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="lastName" label={t('common.lastName')}>
              <BaseInput />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="userName" label={t('common.userName')}>
              <BaseInput />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <SexItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BirthdayItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="group" label={t('common.group')}>
              <BaseSelect placeholder={"Please select a group"}
                defaultValue={user?.group}
                options={groupObject} >
              </BaseSelect>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.other')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="role" label={t('common.role')}>
              <BaseInput defaultValue='General' placeholder='General' disabled />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="ipAddress" label={t('common.ipAddress')} >
              <BaseInput disabled />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="ipMsgId" label={t('common.ipMsgId')} >
              <BaseInput />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="netKeyId" label={t('common.netKeyId')}>
              <BaseInput />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="teamNo" label={t('common.teamNo')}>
              <BaseSelect placeholder={"Please select a team"}
                options={teamObject}
                defaultValue={user?.teamNo}>
              </BaseSelect>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="roomNo" label={t('common.roomNo')}>
              <BaseInput />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BaseButtonsForm.Item name="userStatus" label={t('common.userStatus')}>
              <BaseSelect placeholder={"Please select a status"}
                options={statusObject}
                defaultValue={user?.status}>
              </BaseSelect>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={24}>
            <BaseButtonsForm.Item name={'note'} label={t('common.note')} >
              <BaseInput.TextArea placeholder='You can write about yours or anything you want.' />
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={24}>
            <BaseButtonsForm.Item name={'stacks'} label={t('common.stacks')} >
              <BaseInput.TextArea />
            </BaseButtonsForm.Item>
          </BaseCol>

        </BaseRow>
      </BaseButtonsForm>
    </BaseCard>
  );
};
