import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

export const GroupItem: React.FC = () => {
    const { t } = useTranslation();

    React.useEffect(() => {

    }, [])

    return (
        <BaseButtonsForm.Item name="role">
            {/* <BaseSelect placeholder={t('forms.validationFormLabels.role')} defaultValue={record.role}
                options={options} onChange={() => handleSelect(record._id)}>
            </BaseSelect> */}
        </BaseButtonsForm.Item>
    );
};
