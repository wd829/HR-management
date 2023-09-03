import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { ConfirmItemPassword } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/ConfirmPasswordItem/ConfirmPasswordItem';
import { CurrentPasswordItem } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/CurrentPasswordItem/CurrentPasswordItem';
import { NewPasswordItem } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/NewPasswordItem/NewPasswordItem';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './PasswordForm.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { doResetPassword } from '@app/store/slices/authSlice';

export interface ConfirmPasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const PasswordForm: React.FC = () => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);

  const userId = user?._id

  const dispatch = useAppDispatch()

  const onFinish = (values: ConfirmPasswordFormValues) => {
    setLoading(true);

    dispatch(doResetPassword({ values, userId: userId || '' })).unwrap()
      .then(() => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({ message: t('common.success') });
      })
      .catch((err) => {
        console.log(err.message)
        notificationController.error({ message: "An error occured." });
        setLoading(false);
      });
    // setTimeout(() => {
    //   setLoading(false);
    //   setFieldsChanged(false);
    //   notificationController.success({ message: t('common.success') });
    //   console.log(values);
    // }, 1000);
  };

  return (
    <BaseButtonsForm
      name="newPassword"
      requiredMark="optional"
      isFieldsChanged={isFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      footer={
        <S.Btn loading={isLoading} type="primary" htmlType="submit">
          {t('common.confirm')}
        </S.Btn>
      }
      onFinish={onFinish}
    >
      <BaseRow gutter={{ md: 15, xl: 30 }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('profile.nav.securitySettings.changePassword')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol xs={24} md={12} xl={24}>
          <CurrentPasswordItem />
        </BaseCol>

        <BaseCol xs={24} md={12} xl={24}>
          <NewPasswordItem />
        </BaseCol>

        <BaseCol xs={24} md={12} xl={24}>
          <ConfirmItemPassword />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
