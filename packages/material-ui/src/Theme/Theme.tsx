// @ts-nocheck
import React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import ArrayFieldTemplate from "../ArrayFieldTemplate";
import ErrorList from "../ErrorList";
import Fields from "../Fields";
import FieldTemplate from "../FieldTemplate";
import ObjectFieldTemplate from "../ObjectFieldTemplate";
import Widgets from "../Widgets";

import { ThemeProps } from "@visma/rjsf-core";
import { utils } from "@visma/rjsf-core";
import { useIntl } from "react-intl";

const { getDefaultRegistry } = utils;

const { fields, widgets } = getDefaultRegistry();

const DefaultChildren = () => (
  <Box marginTop={3}>
    <Button type="submit" variant="contained" color="primary">
      {useIntl().formatMessage({ defaultMessage: "Submit" })}
    </Button>
  </Box>
);

const Theme: ThemeProps = {
  children: <DefaultChildren />,
  ArrayFieldTemplate,
  fields: { ...fields, ...Fields },
  FieldTemplate,
  widgets: { ...widgets, ...Widgets },
  ObjectFieldTemplate,
  ErrorList,
};

export default Theme;
