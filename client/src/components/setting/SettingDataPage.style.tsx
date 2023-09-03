import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const AddButton = styled(BaseButton)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 20%;
  margin-top:1rem
`;