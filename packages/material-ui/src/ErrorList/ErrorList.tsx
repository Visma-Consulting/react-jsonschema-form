import React from 'react';
import { useIntl } from 'react-intl';
import { ErrorListProps } from '@visma/rjsf-core';
import { useMuiComponent } from '../MuiComponentContext';

const ErrorList = ({ errors }: ErrorListProps) => {
  const intl = useIntl();
  const { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, ErrorIcon } = useMuiComponent();
  return (
    <Paper elevation={2}>
      <Box mb={2} p={2}>
        <Typography variant="h6">
          {intl.formatMessage({defaultMessage: 'From validation failed'})}
        </Typography>
        <List dense={true}>
          {errors.map((error, i: number) => {
            return (
              <ListItem key={i}>
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={error.stack} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
};

export default ErrorList;
