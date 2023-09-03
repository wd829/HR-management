import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { DashboardForm } from '@app/components/dashboard/DashboardForm';

const DashboardPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <PageTitle>{t('common.dashboard')}</PageTitle>
            <DashboardForm />
        </>
    );
};

export default DashboardPage;
