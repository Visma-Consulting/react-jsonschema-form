import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { utils, WidgetProps } from '@visma/rjsf-core';
import prettyBytes from "pretty-bytes";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles({
  inputLabel: {
    position: "absolute",
    left: "-10000px",
    top: "auto",
    width: "1px",
    height: "1px",
    overflow: "hidden",
  },
});

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

interface Props {
  filesInfo?: FileInfo[];
}

function dataURItoBlob(dataURI: string) {
  // Split metadata from data
  const splitted = dataURI.split(",");
  // Split params
  const params = splitted[0].split(";");
  // Get mime-type from params
  const type = params[0].replace("data:", "");
  // Filter the name property from params
  const properties = params.filter(param => {
    return param.split("=")[0] === "name";
  });
  // Look for the name and use unknown if no name property.
  let name;
  if (properties.length !== 1) {
    name = "unknown";
  } else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split("=")[1];
  }

  // Built the Uint8Array Blob parameter from the base64 string.
  const binary = atob(splitted[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Create the blob object
  const blob = new window.Blob([new Uint8Array(array)], { type });

  return { blob, name };
}

function addNameToDataURL(dataURL: any, name: any) {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
}

function processFile(file: any) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = event => {
      resolve({
        dataURL: addNameToDataURL(event.target!.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files: any) {
  return Promise.all([].map.call(files, processFile));
}

function extractFileInfo(dataURLs: any[]) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== "undefined")
    .map(dataURL => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

const NOT_ALLOWED_FILE_NAME_CHARACTERS = ['*', '"', '/', '\\', '<', '>', ':', '|', '?'];

const FileWidget = ({
  id,
  options,
  value,
  disabled,
  readonly,
  multiple,
  autofocus,
  onChange,
  label,
  required,
  uiSchema,
  rawErrors
}: WidgetProps) => {
  const [state, setState] = useState<FileInfo[]>();
  const inputRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();
  const classes = useStyles();
  const { locale } = intl;

  useEffect(() => {
    if (value === null) {
      setState(undefined);
    } else {
      const values = Array.isArray(value) ? value : [value];
      const initialFilesInfo: FileInfo[] = extractFileInfo(values);
      if (initialFilesInfo.length > 0) {
        setState(initialFilesInfo);
      } else {
        setState(undefined);
      }
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files).then((filesInfo: any) => {
      // @ts-ignore
      const maxFileSizeMb = (uiSchema["ui:options"]?.element as any)?.maxFileSizeMb;

      if (maxFileSizeMb) {
        const maxFileSize = maxFileSizeMb * Math.pow(1000, 2);
        filesInfo = filesInfo.filter((fileInfo: any) => {
          const isAccepted = fileInfo.size <= maxFileSize;
          if (!isAccepted) {
            alert(
              intl.formatMessage(
                {
                  defaultMessage:
                    'File "{name}" is not accepted. Maximum file size is {size}.',
                },
                {
                  name: fileInfo.name,
                  size: prettyBytes(maxFileSize, { locale }),
                }
              )
            );
          }
          return isAccepted;
        });
      }

      if (options.accept) {
        const accept = (options.accept as string).split(",");
        filesInfo = filesInfo.filter((fileInfo: any) => {
          const isAccepted = accept.some(accept =>
            fileInfo.name.endsWith(accept)
          );
          if (!isAccepted) {
            alert(
              intl.formatMessage(
                {
                  defaultMessage:
                    'File "{name}" is not accepted. Accepted file extensions are: {accept}.',
                },
                { name: fileInfo.name, accept: options.accept }
              )
            );
          }
          return isAccepted;
        });
      }

      filesInfo = filesInfo.filter((fileInfo: any) => {
        const isAccepted = !NOT_ALLOWED_FILE_NAME_CHARACTERS.some(char => fileInfo.name.includes(char));
        if (!isAccepted) {
          alert(
            intl.formatMessage(
              {
                defaultMessage: 'File "{name}" is not accepted. Filename cannot contain following characters: {characters}'
              },
              { name: fileInfo.name, characters: NOT_ALLOWED_FILE_NAME_CHARACTERS.join(' ') }
            )
          )
        }
        return isAccepted;
      })

      setState(filesInfo);
      const values = filesInfo.map((fileInfo: any) => fileInfo.dataURL);
      if (multiple) {
        onChange(values);
      } else {
        onChange(values[0]);
      }
    });
  };

  const RemoveButton = ({ index }: any) => {
    const onRemoveClick = () => {
      if (multiple) {
        const newValues = value.splice(index, 1);
        onChange(newValues);
      } else {
        onChange(undefined);
      }
    };

    return (
      <IconButton
        aria-label={intl.formatMessage({ defaultMessage: "Remove file" })}
        onClick={onRemoveClick}>
        <HighlightOffIcon />
      </IconButton>
    );
  };

  const FilesInfo = ({ filesInfo }: Props) => {
    if (!filesInfo || filesInfo.length === 0) {
      return null;
    }
    return (
      <List id="file-info">
        {filesInfo.map((fileInfo: any, key: any) => {
          const { name, size, type } = fileInfo;
          let nameDecoded = name;
          try {
            nameDecoded = decodeURIComponent(name);
          } catch {}
          return (
            <ListItem key={key}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={nameDecoded}
                secondary={`${type}, ${prettyBytes(size, { locale })}`}
              />
              <RemoveButton index={key} />
            </ListItem>
          );
        })}
      </List>
    );
  };

  const ariaLabel = utils.generateAriaLabel(label, options, required);

  return (
    <>
      {
        ariaLabel && ariaLabel !== ""
          ? <label htmlFor={`file-input-${id}`} className={classes.inputLabel}>
            {ariaLabel}
          </label>
          : null
      }
      <input
        ref={inputRef}
        id={`file-input-${id}`}
        type="file"
        disabled={readonly || disabled}
        onChange={handleChange}
        autoFocus={autofocus}
        multiple={multiple}
        aria-hidden={true}
        accept={options.accept as string}
        style={{ display: "none" }}
      />
      <Button
        aria-label={
          ariaLabel &&
          `${ariaLabel}: ${intl.formatMessage({
            defaultMessage: "Choose file",
          })}`
        }
        aria-describedby={utils.ariaDescribedBy(id, uiSchema, rawErrors)}
        variant="outlined"
        onClick={() => inputRef.current!.click()}>
        {intl.formatMessage({ defaultMessage: "Choose file" })}
      </Button>
      <FilesInfo filesInfo={state} />
    </>
  );
};

export default FileWidget;
