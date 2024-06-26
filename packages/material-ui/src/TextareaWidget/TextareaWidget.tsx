import React from "react";

import { utils, WidgetProps } from "@visma/rjsf-core";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

type CustomWidgetProps = WidgetProps & {
  options: any;
};

const useStyles = makeStyles({
  inputLabelRoot: {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
  },
  inputFormControl: {
    "label + &": {
      marginTop: 0
    }
  }
});

const TextareaWidget = ({
  id,
  placeholder,
  value,
  label,
  required,
  disabled,
  autofocus,
  readonly,
  onBlur,
  onFocus,
  onChange,
  options,
  schema,
  rawErrors = [],
}: CustomWidgetProps) => {
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = (value === "" ? options.emptyValue : value);
    onChange(rawValue ?
      schema.maxLength ? rawValue.substring(0, schema.maxLength) : rawValue
        : "")
  };
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const classes = useStyles();

  return (
    <>
      <TextField
        id={id}
        placeholder={placeholder}
        disabled={disabled || readonly}
        value={value}
        label={utils.generateAriaLabel(label, options, required)}
        required={required}
        autoFocus={autofocus}
        multiline={true}
        rows={options.rows || 5}
        rowsMax={1000}
        error={rawErrors.length > 0}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        InputProps={{ "aria-describedby": utils.ariaDescribedBy(id, options, rawErrors), classes: {
            formControl: classes.inputFormControl
          }
        }}
        InputLabelProps={{shrink: false, className: classes.inputLabelRoot}}
      />
      {options.showCharacterCounter &&
      <div>
        <Typography component="span" variant="subtitle2" style={{float: "right"}}>
          {(value ? value.length : 0)} {schema.maxLength !== undefined && " / " + schema.maxLength}
        </Typography>
      </div>
      }
    </>
  );
};

export default TextareaWidget;
