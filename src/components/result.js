import React, { Component } from 'react';
import { connect } from 'react-redux';
import preDateSelector from '../selectors/PreDateSelector';
import {fromJS} from 'immutable';

class Result extends Component {

  constructor(props) {
    super(props);
    // for store batch results
    // const template = {
    //   '2014': {'budbreak':{}, 'fruitset':{}, 'April-1':{}},
    //   '2015': {'budbreak':{}, 'fruitset':{}, 'April-1':{}},
    //   '2016': {'budbreak':{}, 'fruitset':{}, 'April-1':{}}
    // }
    // this.state = {template: fromJS(template)};
  }

  // update() {
  //   const rst = this.props.preDate;
  //
  //   if(!rst) return;
  //
  //   const {template} = this.state;
  //   const state = template.setIn([rst.hisYear, rst.startSeason, rst.model], rst.curEnd);
  //   this.setState({template:state});
  //
  //   console.log(state);
  // }

  render() {

    const rst = this.props.preDate;

    if(!rst) return <div />;

    console.log([rst.hisYear, rst.curYear, rst.startSeason, rst.model, rst.curEnd].join(' '));

    return (
      <div>
        <h3>Prediction Result {rst ? `using ${rst.model}` : ``}</h3>
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
