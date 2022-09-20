import classNames from 'classnames';
import type { UploadProps as RcUploadProps } from 'rc-upload';
import RcUpload from 'rc-upload';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import * as React from 'react';
import { flushSync } from 'react-dom';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import warning from '../_util/warning';
import type {
  RcFile,
  ShowUploadListInterface,
  UploadChangeParam,
  UploadFile,
  UploadListType,
  UploadLocale,
  UploadType,
} from './interface';
import { UploadProps } from './interface';
import UploadList from './UploadList';
import { file2Obj, getFileItem, removeFileItem, updateFileList } from './utils';

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`;

export { UploadProps };

const InternalUpload: React.ForwardRefRenderFunction<unknown, UploadProps> = (props, ref) => {
  const {
    fileList,
    defaultFileList,
    onRemove,
    showUploadList,
    listType,
    onPreview,
    onDownload,
    onChange,
    onDrop,
    previewFile,
    disabled: customDisabled,
    locale: propLocale,
    iconRender,
    isImageUrl,
    progress,
    prefixCls: customizePrefixCls,
    className,
    type,
    children,
    style,
    itemRender,
    maxCount,
  } = props;

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const [mergedFileList, setMergedFileList] = useMergedState(defaultFileList || [], {
    value: fileList,
    postState: list => list ?? [],
  });

  const [dragState, setDragState] = React.useState<string>('drop');

  const upload = React.useRef<any>();

  warning(
    'fileList' in props || !('value' in props),
    'Upload',
    '`value` is not a valid prop, do you mean `fileList`?',
  );

  warning(
    !('transformFile' in props),
    'Upload',
    '`transformFile` is deprecated. Please use `beforeUpload` directly.',
  );

  // Control mode will auto fill file uid if not provided
  React.useMemo(() => {
    const timestamp = Date.now();

    (fileList || []).forEach((file, index) => {
      if (!file.uid && !Object.isFrozen(file)) {
        file.uid = `__AUTO__${timestamp}_${index}__`;
      }
    });
  }, [fileList]);

  const onInternalChange = (
    file: UploadFile,
    changedFileList: UploadFile[],
    event?: { percent: number },
  ) => {
    let cloneList = [...changedFileList];

    // Cut to match count
    if (maxCount === 1) {
      cloneList = cloneList.slice(-1);
    } else if (maxCount) {
      cloneList = cloneList.slice(0, maxCount);
    }

    // Prevent React18 auto batch since input[upload] trigger process at same time
    // which makes fileList closure problem
    flushSync(() => {
      setMergedFileList(cloneList);
    });

    const changeInfo: UploadChangeParam<UploadFile> = {
      file: file as UploadFile,
      fileList: cloneList,
    };

    if (event) {
      changeInfo.event = event;
    }

    onChange?.(changeInfo);
  };

  const mergedBeforeUpload = async (file: RcFile, fileListArgs: RcFile[]) => {
    const { beforeUpload, transformFile } = props;

    let parsedFile: File | Blob | string = file;
    if (beforeUpload) {
      const result = await beforeUpload(file, fileListArgs);

      if (result === false) {
        return false;
      }

      // Hack for LIST_IGNORE, we add additional info to remove from the list
      delete (file as any)[LIST_IGNORE];
      if ((result as any) === LIST_IGNORE) {
        Object.defineProperty(file, LIST_IGNORE, {
          value: true,
          configurable: true,
        });
        return false;
      }

      if (typeof result === 'object' && result) {
        parsedFile = result as File;
      }
    }

    if (transformFile) {
      parsedFile = await transformFile(parsedFile as any);
    }

    return parsedFile as RcFile;
  };

  const onBatchStart: RcUploadProps['onBatchStart'] = batchFileInfoList => {
    // Skip file which marked as `LIST_IGNORE`, these file will not add to file list
    const filteredFileInfoList = batchFileInfoList.filter(info => !(info.file as any)[LIST_IGNORE]);

    // Nothing to do since no file need upload
    if (!filteredFileInfoList.length) {
      return;
    }

    const objectFileList = filteredFileInfoList.map(info => file2Obj(info.file as RcFile));

    // Concat new files with prev files
    let newFileList = [...mergedFileList];

    objectFileList.forEach(fileObj => {
      // Replace file if exist
      newFileList = updateFileList(fileObj, newFileList);
    });

    objectFileList.forEach((fileObj, index) => {
      // Repeat trigger `onChange` event for compatible
      let triggerFileObj: UploadFile = fileObj;

      if (!filteredFileInfoList[index].parsedFile) {
        // `beforeUpload` return false
        const { originFileObj } = fileObj;
        let clone;

        try {
          clone = new File([originFileObj], originFileObj.name, {
            type: originFileObj.type,
          }) as any as UploadFile;
        } catch (e) {
          clone = new Blob([originFileObj], {
            type: originFileObj.type,
          }) as any as UploadFile;
          clone.name = originFileObj.name;
          clone.lastModifiedDate = new Date();
          clone.lastModified = new Date().getTime();
        }

        clone.uid = fileObj.uid;
        triggerFileObj = clone;
      } else {
        // Inject `uploading` status
        fileObj.status = 'uploading';
      }

      onInternalChange(triggerFileObj, newFileList);
    });
  };

  const onSuccess = (response: any, file: RcFile, xhr: any) => {
    try {
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }
    } catch (e) {
      /* do nothing */
    }

    // removed
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.status = 'done';
    targetItem.percent = 100;
    targetItem.response = response;
    targetItem.xhr = xhr;

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInternalChange(targetItem, nextFileList);
  };

  const onProgress = (e: { percent: number }, file: RcFile) => {
    // removed
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.status = 'uploading';
    targetItem.percent = e.percent;

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInternalChange(targetItem, nextFileList, e);
  };

  const onError = (error: Error, response: any, file: RcFile) => {
    // removed
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.error = error;
    targetItem.response = response;
    targetItem.status = 'error';

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInternalChange(targetItem, nextFileList);
  };

  const handleRemove = (file: UploadFile) => {
    let currentFile: UploadFile;
    Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then(ret => {
      // Prevent removing file
      if (ret === false) {
        return;
      }

      const removedFileList = removeFileItem(file, mergedFileList);

      if (removedFileList) {
        currentFile = { ...file, status: 'removed' };
        mergedFileList?.forEach(item => {
          const matchKey = currentFile.uid !== undefined ? 'uid' : 'name';
          if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
            item.status = 'removed';
          }
        });
        upload.current?.abort(currentFile);

        onInternalChange(currentFile, removedFileList);
      }
    });
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragState(e.type);

    if (e.type === 'drop') {
      onDrop?.(e);
    }
  };

  // Test needs
  React.useImperativeHandle(ref, () => ({
    onBatchStart,
    onSuccess,
    onProgress,
    onError,
    fileList: mergedFileList,
    upload: upload.current,
  }));

  const { getPrefixCls, direction } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('upload', customizePrefixCls);

  const rcUploadProps = {
    onBatchStart,
    onError,
    onProgress,
    onSuccess,
    ...(props as RcUploadProps),
    prefixCls,
    disabled: mergedDisabled,
    beforeUpload: mergedBeforeUpload,
    onChange: undefined,
  };

  delete rcUploadProps.className;
  delete rcUploadProps.style;

  // Remove id to avoid open by label when trigger is hidden
  // !children: https://github.com/ant-design/ant-design/issues/14298
  // disabled: https://github.com/ant-design/ant-design/issues/16478
  //           https://github.com/ant-design/ant-design/issues/24197
  if (!children || mergedDisabled) {
    delete rcUploadProps.id;
  }

  const renderUploadList = (button?: React.ReactNode, buttonVisible?: boolean) =>
    showUploadList ? (
      <LocaleReceiver componentName="Upload" defaultLocale={defaultLocale.Upload}>
        {(locale: UploadLocale) => {
          const {
            showRemoveIcon,
            showPreviewIcon,
            showDownloadIcon,
            removeIcon,
            previewIcon,
            downloadIcon,
          } =
            typeof showUploadList === 'boolean' ? ({} as ShowUploadListInterface) : showUploadList;
          return (
            <UploadList
              prefixCls={prefixCls}
              listType={listType}
              items={mergedFileList}
              previewFile={previewFile}
              onPreview={onPreview}
              onDownload={onDownload}
              onRemove={handleRemove}
              showRemoveIcon={!mergedDisabled && showRemoveIcon}
              showPreviewIcon={showPreviewIcon}
              showDownloadIcon={showDownloadIcon}
              removeIcon={removeIcon}
              previewIcon={previewIcon}
              downloadIcon={downloadIcon}
              iconRender={iconRender}
              locale={{ ...locale, ...propLocale }}
              isImageUrl={isImageUrl}
              progress={progress}
              appendAction={button}
              appendActionVisible={buttonVisible}
              itemRender={itemRender}
            />
          );
        }}
      </LocaleReceiver>
    ) : (
      button
    );

  if (type === 'drag') {
    const dragCls = classNames(
      prefixCls,
      {
        [`${prefixCls}-drag`]: true,
        [`${prefixCls}-drag-uploading`]: mergedFileList.some(file => file.status === 'uploading'),
        [`${prefixCls}-drag-hover`]: dragState === 'dragover',
        [`${prefixCls}-disabled`]: mergedDisabled,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
      className,
    );
    return (
      <span>
        <div
          className={dragCls}
          onDrop={onFileDrop}
          onDragOver={onFileDrop}
          onDragLeave={onFileDrop}
          style={style}
        >
          <RcUpload {...rcUploadProps} ref={upload} className={`${prefixCls}-btn`}>
            <div className={`${prefixCls}-drag-container`}>{children}</div>
          </RcUpload>
        </div>
        {renderUploadList()}
      </span>
    );
  }

  const uploadButtonCls = classNames(prefixCls, {
    [`${prefixCls}-select`]: true,
    [`${prefixCls}-select-${listType}`]: true,
    [`${prefixCls}-disabled`]: mergedDisabled,
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  const renderUploadButton = (uploadButtonStyle?: React.CSSProperties) => (
    <div className={uploadButtonCls} style={uploadButtonStyle}>
      <RcUpload {...rcUploadProps} ref={upload} />
    </div>
  );

  const uploadButton = renderUploadButton(children ? undefined : { display: 'none' });

  if (listType === 'picture-card') {
    return (
      <span className={classNames(`${prefixCls}-picture-card-wrapper`, className)}>
        {renderUploadList(uploadButton, !!children)}
      </span>
    );
  }

  return (
    <span className={className}>
      {uploadButton}
      {renderUploadList()}
    </span>
  );
};

const Upload = React.forwardRef<unknown, UploadProps>(InternalUpload);
if (process.env.NODE_ENV !== 'production') {
  Upload.displayName = 'Upload';
}

Upload.defaultProps = {
  type: 'select' as UploadType,
  multiple: false,
  action: '',
  data: {},
  accept: '',
  showUploadList: true,
  listType: 'text' as UploadListType, // or picture
  className: '',
  supportServerRender: true,
};

export default Upload;
