import React from 'react';
import { Form, Field, Input, Balloon, Icon } from '@bone/bone-web-ui';
import ItemPreviewSelect from '../Commons/ItemPreviewSelect';
import Dialog from '@boneweb/iot-dialog';
import { connect } from 'react-redux';
import {DataViewActions as Actions} from '../../actions/DataViewActions';
import { checkViewName } from './RegCheckUtils';

const KEY_SOURCE_NAME = 'sourceName';
const KEY_NAME = 'name';
const KEY_DESC = 'desc';
const Tooltip = Balloon.Tooltip;
class CreateViewDialog extends React.Component {
  constructor(props) {
    super(props);
    this.field = new Field(this);
  }

  componentWillMount() {
    this.props.getBizModelList && this.props.getBizModelList();
  }

  render() {
    return (<Dialog visible={this.props.isShowCreateViewDialog} title={'添加/管理'}
                    onCancel={this.onClose.bind(this)}
                    onClose={this.onClose.bind(this)}
                    onOk={this.onOk.bind(this)} locale={{ok:'下一步'}}>
      {this.renderForm()}
    </Dialog>)
  }

  onClose() {
    this.field.reset();
    this.field.remove();
    this.props.hideCreateViewDialog && this.props.hideCreateViewDialog();
  }

  onOk() {
    this.field.validate((errors)=> {
      if (!errors) {
        let sourceName = this.field.getValue(KEY_SOURCE_NAME);
        const items = this.props.bizModelList[this.props.env].filter((item)=> {
          let sourceTableName = item.desc && item.desc.length > 0 ? item.genEnName + '(' + item.desc + ')' : item.genEnName;
          return sourceName === sourceTableName;
        });
        const desc = this.field.getValue(KEY_DESC);
        this.props.showEditViewPanel({
          edittingView: {
            id: -1,
            type: 'view',
            version: 1,
            name: this.field.getValue(KEY_NAME).trim(),
            desc: desc ? desc.trim() : '',//NOTICE: 'desc' must exist, can be empty string.
            structedView: JSON.stringify({
              primaryTableId:items[0].id,
              primaryTableType:items[0].type,
              primaryTableName:items[0].genEnName
            })
          }
        });
        this.props.hideCreateViewDialog && this.props.hideCreateViewDialog();
        this.field.reset();
        this.field.remove();
      }
    });
  }

  renderForm() {
    const { init } = this.field;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16
      }
    };
    const bizModeOptions = this.props.bizModelList[this.props.env];

    return <div>
      <div style={{margin: '0 20px'}}>
        <Form field={this.field}>
          <Form.Item
            label="视图名称："
            {...formItemLayout}
            required>
            <Input placeholder="请输入视图名称，不超过20个字符。" style={{width: 280}}
                   {...init(KEY_NAME, {
                     rules: [
                        { validator: checkViewName }
                     ]
                   }) } />
            <Tooltip
                trigger={<Icon size='small' className='theme-color' style={{ marginLeft: 8 }} type='yiwen' />}
                align="t"
                text='支持中文、英文大小写、数字和下划线，不超过20个字符。'
            />
          </Form.Item>
          <Form.Item label="数据源：" {...formItemLayout} required style={{margin: 0}}>
            <ItemPreviewSelect style={{width: 280}} placeholder="请选择数据源" dataSource={bizModeOptions} {...init(KEY_SOURCE_NAME,
                  {rules: [{ required: true, message: '数据源不能为空。' }]})
                } onSelect={(item)=> {
                  let selectedTableName = item.desc && item.desc.length > 0 ? item.genEnName + '(' + item.desc + ')' : item.genEnName;
                  this.field.setValue(KEY_SOURCE_NAME, selectedTableName);
                  this.field.validate(KEY_SOURCE_NAME);
              }}/>
          </Form.Item>
          <Form.Item
            label="视图描述："
            {...formItemLayout}
            style={{marginTop: '16px'}}
          >
            <Input placeholder="请输入视图描述"
                   style={{width: 280}}
                   cutString={false}
                   maxLength={200}
                   multiple
                   hasLimitHint
                   {...init(KEY_DESC, {
                     rules: [
                       // { validator: checkGenDesc }
                       {max:200, message: '视图描述不能超过200字符'}
                     ]
                   }) } />
          </Form.Item>
        </Form>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    isShowCreateViewDialog: state.dataview.dataviews.isShowCreateViewDialog,
    bizModelList: state.dataview.dataviews.bizModelList,
    env: state.dataview.dataviews.env
  }
}
export default connect(mapStateToProps, Actions)(CreateViewDialog)
