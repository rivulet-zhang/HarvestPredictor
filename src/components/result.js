import React, { Component } from 'react';
import { connect } from 'react-redux';
import preDateSelector from '../selectors/PreDateSelector';

class Result extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <h3>Prediction Result</h3>
        { this.props.preDate &&
          <div>
          <div>Budbreak in {this.props.preDate.hisYear} is {this.props.preDate.hisBudbreak}</div>
          <div>Veraison in {this.props.preDate.hisYear} is {this.props.preDate.hisVeraison}</div>
          <div>Harvest in {this.props.preDate.hisYear} is {this.props.preDate.hisHarvest}</div>
          <br />
          <div>Budbreak in {this.props.preDate.curYear} is {this.props.preDate.curBudbreak}</div>
          <div>Veraison in {this.props.preDate.curYear} is {this.props.preDate.curVeraison}</div>
          <div>Harvest in {this.props.preDate.curYear} is <span color={'#f00'}>{this.props.preDate.curHarvest}</span></div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { preDate:preDateSelector(state) };
}

export default connect(mapStateToProps)(Result);
