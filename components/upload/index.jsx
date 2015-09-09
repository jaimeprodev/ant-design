import React from 'react';
import Upload from 'rc-upload';
import assign from 'object-assign';
import UploadList from './uploadList';
import getFileItem from './getFileItem';
const prefixCls = 'ant-upload';

function noop() {
}

const AntUpload = React.createClass({
  getInitialState() {
    return {
      fileList: this.props.fileList || this.props.defaultFileList || []
    };
  },
  onStart(file) {
    file.status = 'uploading';
    this.onChange({
      file: file,
      add: true
    });
  },
  removeFile(file) {
    file.status = 'removed';
    let fileList = this.state.fileList.concat();
    let targetItem = getFileItem(file, fileList);
    let index = fileList.indexOf(targetItem);
    if (index !== -1) {
      fileList.splice(index, 1);
      return fileList;
    }
    return null;
  },
  onSuccess(response, file) {
    let fileList = this.state.fileList.concat();
    let targetItem = getFileItem(file, fileList);
    // 之前已经删除
    if (targetItem) {
      targetItem.status = 'done';
      targetItem.response = response;
      this.onChange({
        file: targetItem,
        fileList: this.state.fileList
      });
    }
  },
  onProgress(e, file) {
    let fileList = this.state.fileList;
    let targetItem = getFileItem(file, fileList);
    if (targetItem) {
      this.onChange({
        event: e,
        file: file,
        fileList: this.state.fileList
      });
    }
  },
  onError(error, response, file) {
    file.error = error;
    file.response = response;
    this.handleRemove(file);
  },
  handleRemove(file) {
    let fileList = this.removeFile(file);
    if (fileList) {
      this.onChange({
        file: file,
        fileList: fileList
      });
    }
  },
  onChange(info) {
    // 1. 有设置外部属性时不改变 fileList
    // 2. 上传中状态（info.event）不改变 fileList
    if (!('fileList' in this.props) && !info.event) {
      // 新增文件时，使用 multiple 属性会造成同时 setState
      if (info.add) {
        this.setState((prevState) => {
          return {
            fileList: prevState.fileList.concat(info.file)
          };
        }, function() {
          info.fileList = this.state.fileList;
          this.props.onChange(info);
        });
      } else {
        this.setState({
          fileList: info.fileList
        }, function() {
          info.fileList = this.state.fileList;
          this.props.onChange(info);
        });
      }
    }
  },
  getDefaultProps() {
    return {
      type: 'select',
      name: '',
      multipart: false,
      action: '',
      data: {},
      accept: '',
      onChange: noop,
    };
  },
  componentWillReceiveProps(nextProps) {
    if ('fileList' in nextProps) {
      this.setState({
        fileList: nextProps.fileList
      });
    }
  },
  render() {
    let type = this.props.type || 'select';
    let props = assign({}, this.props, {
      onStart: this.onStart,
      onError: this.onError,
      onProgress: this.onProgress,
      onSuccess: this.onSuccess,
    });
    if (type === 'drag') {
      return (
        <div className={prefixCls + ' ' + prefixCls + '-drag'}>
          <Upload {...props}>
            <div className={prefixCls + '-drag-container'}>
              {this.props.children}
            </div>
          </Upload>
        </div>
      );
    } else if (type === 'select') {
      return (
        <div>
          <div className={prefixCls + ' ' + prefixCls + '-select'}>
            <Upload {...props}>
              {this.props.children}
            </Upload>
          </div>
          <UploadList items={this.state.fileList}
                      onRemove={this.handleRemove}/>
        </div>
      );
    }
  }
});

AntUpload.Dragger = React.createClass({
  render() {
    return <AntUpload {...this.props} type="drag" style={{height: this.props.height}}/>;
  }
});

export default AntUpload;
