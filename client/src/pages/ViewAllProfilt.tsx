import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { AllScore } from '@app/components/viewAllScore/AllScore';

const ViewAllProfiltPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <PageTitle>{t('common.viewAllProfit')}</PageTitle>
            <AllScore />
        </>
    );
};

export default ViewAllProfiltPage;
