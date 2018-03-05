/**
 * Created by liuchao on 17/7/20.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@bone/bone-web-ui';
import SubTitle from '../Commons/SubTitle';
import { DataViewActions as Actions } from '../../actions/DataViewActions';
import './ConditionGroup.scss';
import ConditionGroupDialog from './ConditionGroupDialog';
import { Enviroment } from './Contract';
import { compareOptions } from './Utils';

class ConditionGroup extends React.Component {
  constructor() {
    super(...arguments);
    this.onAddCondition = this.onAddCondition.bind(this);
    this.onDeleteCondition = this.onDeleteCondition.bind(this);
    this.state = {
      selectedItems: [1]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.edittingView.structedView.primaryTableId !== nextProps.edittingView.structedView.primaryTableId) {
      this.props.saveConditionGroup && this.props.saveConditionGroup({ conditionGroup: null });
    }
  }

  onDeleteCondition(item, index) {
    return () => {
      this.props.deleteConditionGroup({ index: index });
    };
  }

  onAddCondition() {
    return () => {
      this.props.showConditionGroupDialog();
    };
  }

  render() {
    const edittable = this.props.env === Enviroment.DEV && this.props.scene !== 'preview-view';
    const condition = this.props.conditionGroup;
    return <div id="ConditionGroup">
        <SubTitle text={I18n.get("filter.condition")} btnInvisible={!edittable} btnText={I18n.get("add.manage")} onClick={this.onAddCondition()} />
        <div className="group">
          {condition && condition.filters.length > 0 ? '' : <div className="empty-title">{I18n.get("no.filter.condition")}</div>}
          {condition && condition.filters.map((item, index) => {
          return <div key={index} style={{ fontSize: '12px' }}>
                  <div style={{ margin: '8px 0' }}>{index === 0 ? '' : condition.op.toLowerCase() === 'and' ? I18n.get("and") : I18n.get("or")}</div>
                  <div>
                    <Button shape="text" style={{ color: '#00C1DE', textAlign: 'left', maxWidth: '148px', height: 'unset' }} disabled={!edittable} onClick={this.onAddCondition()}>
                      <div style={{ maxWidth: '148px', wordWrap: 'break-word' }}>
                        {item.col + ' '}
                        <span style={{
                    padding: '0 6px',
                    background: '#e6f9fc',
                    borderRadius: '12px',
                    border: '1px solid #e6f9fc'
                  }}>
                          {compareOptions.filter(option => option.value === item.comp)[0].label}
                          </span>
                        {' ' + item.val}
                      </div>
                    </Button>
                  </div>
                </div>;
        })}
        </div>
        <ConditionGroupDialog />
      </div>;
  }
}

function mapStateToProps(state) {
  return {
    edittingView: state.dataview.dataviews.edittingView,
    conditionGroup: state.dataview.dataviews.conditionGroup,
    env: state.dataview.dataviews.env,
    scene: state.dataview.dataviews.scene
  };
}
export default connect(mapStateToProps, Actions)(ConditionGroup);