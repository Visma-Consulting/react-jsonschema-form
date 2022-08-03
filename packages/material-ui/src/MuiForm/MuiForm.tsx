import { FunctionComponent } from 'react';
import { withTheme, FormProps } from '@visma/rjsf-core';

import Theme from '../Theme';

const MuiForm: React.ComponentClass<FormProps<any>> | FunctionComponent<FormProps<any>> = withTheme(Theme);

export default MuiForm;
