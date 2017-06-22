import React, { Component } from 'react';
import { connect } from 'react-redux';
import preDateSelector from '../selectors/PreDateSelector';

class Result extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const rst = this.props.preDate;

    return (
      <div>
        <h3>Prediction Result</h3>
        { this.props.preDate &&
          <div>
          <div>The {rst.startSeason} date in {rst.hisYear} is {rst.hisStart}</div>
          <div>The harvest date in {rst.hisYear} is {rst.hisEnd}</div>
          <br />
          <div>The {rst.startSeason} date in {rst.curYear} is {rst.curStart}</div>
          <div>The harvest date in {rst.curYear} is <span color={'#f00'}>{rst.curEnd}</span></div>
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
