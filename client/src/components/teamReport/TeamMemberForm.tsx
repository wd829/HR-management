import React from 'react';
import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

interface TeamMember {
    name: string;
}

interface TeamMemberComponentProps {
    team: string[];
}

const TeamMemberComponent: React.FC<TeamMemberComponentProps> = ({ team }) => {
    
    const { t } = useTranslation(); // Assuming you have the translation hook available

    return (
        <>
            {team.map((item, index) => (
                <Form.Item
                    key={index}
                    name={item}
                    label={item}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Input.TextArea placeholder={t('common.plan')} />
                </Form.Item>
            ))}
        </>
    );
};

export default TeamMemberComponent;
