import React from 'react';
import { WidgetProps } from '@visma/rjsf-core';

const DateWidget = (props: WidgetProps) => {
  const { registry } = props;
  const { TextWidget } = registry.widgets;
  return (
    <TextWidget
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  );
};

export default DateWidget;
