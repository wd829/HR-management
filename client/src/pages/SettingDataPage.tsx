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
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { SettingRoleInput } from '@app/components/setting/SettingRoleInput';
import * as Add from '@app/components/setting/SettingDataPage.style';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { saveNewTeamName } from '@app/api/user.api';
import { saveNewGroupName, saveNewBillType, saveUserStatus } from '@app/api/user.api';


export interface SettingsInfoData {
    teams: Array<String>;
}

const initialSettingsInfoData: SettingsInfoData = {
    teams: [],
};

const SettingDataPage: React.FC = () => {

    const { user } = useAppSelector((state) => state.user);

    //const userId = user._id

    const [isFieldsChanged, setFieldsChanged] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [teamNames, setTeamNames] = React.useState([])

    const [teamName, setTeamName] = React.useState('')

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
                : initialSettingsInfoData,
        [user],
    );

    const [form] = BaseButtonsForm.useForm();

    const { t } = useTranslation();

    const [multipleDataValue, setMulitpleDataValue] = React.useState('')

    const handleAddTeamName = () => {

        const newTeamName = form.getFieldValue('newTeam');

        if (!newTeamName || newTeamName.length === 0) {
            notificationController.error({ message: t('common.error: Empty value') });
            return
        }

        setTeamName(newTeamName);
        setLoading(true);
        form.setFieldValue('Teams', newTeamName)

        saveNewTeamName(newTeamName).then(({ data }) => {
            if (data) {
                setLoading(false);
                setFieldsChanged(false);
                notificationController.success({ message: t('common.success') });
            }
        }).catch(e => {
            setLoading(false);
            setFieldsChanged(false);
            notificationController.error({ message: t(`common.error: ${e}`) });
        })

    }

    const handleTeamNames = () => {

        const teamNames = form.getFieldValue('Teams');

        setTeamNames(teamNames)

    }

    const options = [
        { value: t('common.admin') },
        { value: t('common.general') },
        { value: t('common.teamLeader') },
        { value: t('common.manager') },
    ];

    const handleSubmit = () => { }

    const handleAddNewGroup = () => {

        const newGroupName = form.getFieldValue('newGroup');

        if (!newGroupName || newGroupName.length === 0) {
            notificationController.error({ message: t('common.error: Empty value') });
            return
        }
        setLoading(true);
        saveNewGroupName(newGroupName).then(({ data }) => {
            if (data) {
                setLoading(false);
                setFieldsChanged(false);
                notificationController.success({ message: t('common.success') });
            }
        }).catch(e => {
            setLoading(false);
            setFieldsChanged(false);
            notificationController.error({ message: t(`common.error: ${e}`) });
        })

    }

    const handleAddNewBillType = () => {
        const newBillType = form.getFieldValue('newBillType');

        if (!newBillType || newBillType.length === 0) {
            notificationController.error({ message: t('common.error: Empty value') });
            return
        }
        setLoading(true);
        saveNewBillType(newBillType).then(({ data }) => {
            if (data) {
                setLoading(false);
                setFieldsChanged(false);
                notificationController.success({ message: t('common.success') });
            }
        }).catch(e => {
            setLoading(false);
            setFieldsChanged(false);
            notificationController.error({ message: t(`common.error: ${e}`) });
        })

    }

    const handleAddUserStatus = () => {
        const userStatus = form.getFieldValue('userStatus');
        if (!userStatus || userStatus.length === 0) {
            notificationController.error({ message: t('common.error: Empty value') });
            return
        }
        setLoading(true);
        saveUserStatus(userStatus).then(({ data }) => {
            if (data) {
                setLoading(false);
                notificationController.success({ message: t('common.success') });
            }
        }).catch(e => {
            setLoading(false);
            notificationController.error({ message: t(`common.error: ${e}`) });
        })
    }

    return (

        <BaseCard>
            <PageTitle>{t('common.settings')}</PageTitle>

            <BaseButtonsForm
                form={form}
                name="info"
                loading={isLoading}
                initialValues={userFormValues}
                isFieldsChanged={false}
                setFieldsChanged={setFieldsChanged}
                onFieldsChange={() => setFieldsChanged(true)}
                onFinish={handleSubmit}
            >
                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                    <BaseCol span={24}>
                        <BaseButtonsForm.Item>
                            <BaseButtonsForm.Title>{t('common.roles')}</BaseButtonsForm.Title>
                        </BaseButtonsForm.Item>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseRow justify={'space-evenly'} align={'middle'}>
                            <SettingRoleInput />
                            <Add.AddButton type="primary" loading={isLoading} >
                                {t('common.add')}
                            </Add.AddButton>
                        </BaseRow>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseButtonsForm.Item name={t('common.roles')} label={t('common.roles')}>
                            <BaseSelect
                                mode="multiple"
                                //tagRender={tagRender}
                                defaultValue={[]}
                                width={'100%'}
                                options={options}
                            />
                        </BaseButtonsForm.Item>
                    </BaseCol>

                </BaseRow>

                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                    <BaseCol span={24}>
                        <BaseButtonsForm.Item>
                            <BaseButtonsForm.Title>{t('common.teams')}</BaseButtonsForm.Title>
                        </BaseButtonsForm.Item>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseRow justify={'space-evenly'} align={'middle'}>
                            <BaseButtonsForm.Item name="newTeam" label={t('common.newTeam')}>
                                <BaseInput />
                            </BaseButtonsForm.Item>
                            <Add.AddButton type="primary" loading={isLoading} onClick={handleAddTeamName}>
                                {t('common.add')}
                            </Add.AddButton>
                        </BaseRow>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseButtonsForm.Item name="Teams" label={t('common.teams')}>
                            <BaseSelect
                                mode="multiple"
                                //tagRender={tagRender}
                                defaultValue={teamNames}
                                width={'100%'}

                                onChange={handleTeamNames}
                            />
                        </BaseButtonsForm.Item>
                    </BaseCol>

                </BaseRow>

                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                    <BaseCol span={24}>
                        <BaseButtonsForm.Item>
                            <BaseButtonsForm.Title>{t('common.group')}</BaseButtonsForm.Title>
                        </BaseButtonsForm.Item>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseRow justify={'space-evenly'} align={'middle'}>
                            <BaseButtonsForm.Item name="newGroup" label={t('common.newGroup')}>
                                <BaseInput />
                            </BaseButtonsForm.Item>
                            <Add.AddButton type="primary" loading={isLoading} onClick={handleAddNewGroup}>
                                {t('common.add')}
                            </Add.AddButton>
                        </BaseRow>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseButtonsForm.Item name="Teams" label={t('common.group')}>
                            <BaseSelect
                                mode="multiple"
                                //tagRender={tagRender}
                                defaultValue={teamNames}
                                width={'100%'}

                                onChange={handleTeamNames}
                            />
                        </BaseButtonsForm.Item>
                    </BaseCol>

                </BaseRow>

                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                    <BaseCol span={24}>
                        <BaseButtonsForm.Item>
                            <BaseButtonsForm.Title>{t('common.bill')}</BaseButtonsForm.Title>
                        </BaseButtonsForm.Item>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseRow justify={'space-evenly'} align={'middle'}>
                            <BaseButtonsForm.Item name="newBillType" label={t('common.newBillType')}>
                                <BaseInput />
                            </BaseButtonsForm.Item>
                            <Add.AddButton type="primary" loading={isLoading} onClick={handleAddNewBillType}>
                                {t('common.add')}
                            </Add.AddButton>
                        </BaseRow>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseButtonsForm.Item name="billTypes" label={t('common.bill')}>
                            <BaseSelect
                                mode="multiple"
                                //tagRender={tagRender}
                                defaultValue={teamNames}
                                width={'100%'}

                                onChange={handleTeamNames}
                            />
                        </BaseButtonsForm.Item>
                    </BaseCol>

                </BaseRow>

                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                    <BaseCol span={24}>
                        <BaseButtonsForm.Item>
                            <BaseButtonsForm.Title>{t('common.userStatus')}</BaseButtonsForm.Title>
                        </BaseButtonsForm.Item>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        <BaseRow justify={'space-evenly'} align={'middle'}>
                            <BaseButtonsForm.Item name="userStatus" label={t('common.userStatus')}>
                                <BaseInput />
                            </BaseButtonsForm.Item>
                            <Add.AddButton type="primary" loading={isLoading} onClick={handleAddUserStatus}>
                                {t('common.add')}
                            </Add.AddButton>
                        </BaseRow>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        {/* <BaseButtonsForm.Item name="userStatus" label={t('common.userStatus')}>
                            <BaseSelect
                                mode="multiple"
                                //tagRender={tagRender}
                                defaultValue={teamNames}
                                width={'100%'}

                                onChange={handleTeamNames}
                            />
                        </BaseButtonsForm.Item> */}
                    </BaseCol>

                </BaseRow>

            </BaseButtonsForm>
        </BaseCard>
    );
};

export default SettingDataPage;
