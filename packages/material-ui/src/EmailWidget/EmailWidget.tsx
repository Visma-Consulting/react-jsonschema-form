import React from 'react';
import { WidgetProps } from '@visma/rjsf-core';

const EmailWidget = (props: WidgetProps) => {
  const { registry } = props;
  const { TextWidget } = registry.widgets;
  return <TextWidget type="email" {...props} />;
};

export default EmailWidget;
