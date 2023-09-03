/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseTag } from '@app/components/common/BaseTag/BaseTag';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

type Size = 'small' | 'middle' | 'large';

const StackItem: React.FC = () => {
  const { t } = useTranslation();
  const [size, setSize] = useState<Size>('middle');
  const options = [
    { value: t('selects.frontend') },
    { value: t('selects.backend') },
    { value: t('selects.SSO') },
    { value: t('selects.cyan') },
  ];
  const children: React.ReactNode[] = [];

  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i} value={i.toString(36) + i}>
        {i.toString(36) + i}
      </Option>,
    );
  }

  const tagRender = (props: {
    label: string | React.ReactNode;
    value: any;
    closable: boolean;
    onClose: () => void;
  }) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <BaseTag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </BaseTag>
    );
  };

  return (
    <>
      <BaseButtonsForm.Item name={t('common.stacks')} label={t('common.stacks')}>
        <BaseSelect
          mode="multiple"
          showArrow
          tagRender={tagRender}
          defaultValue={['gold', 'cyan', 'orange', 'green', 'blue']}
          width={'100%'}
          options={options}
        />
      </BaseButtonsForm.Item>
    </>
  );
};

export default StackItem;
