import React from "react";
import { WidgetProps } from "@visma/rjsf-core";

const DateWidget = (props: WidgetProps) => {
  const { registry } = props;
  const { TextWidget } = registry.widgets;
  return <TextWidget {...props} type="date" />;
};

export default DateWidget;
