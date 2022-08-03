import React from 'react';

import { AddButtonProps } from '@visma/rjsf-core';

import { useMuiComponent } from '../MuiComponentContext';
import { useIntl } from 'react-intl';

const AddButton: React.FC<AddButtonProps> = props => {
  const { AddIcon, Button } = useMuiComponent();

  return (
    <Button {...props} color="secondary">
      <AddIcon /> {useIntl().formatMessage({ defaultMessage: 'Add Item' })}
    </Button>
  );
};

export default AddButton;
