import React, { Component } from 'react';
import { DropdownList, DateTimePicker } from 'react-widgets';
import { predict } from '../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const VINEYARDS = ['bigRanch', 'tresSabores'];
const YEARS = ["2014", "2015", "2016", "2017"];

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vineyard:'',
      hisYear:'2016',
      curYear:'2017',
      startDateCurYear:''
    };

    this.predictWrapper = this.predictWrapper.bind(this);
  }

  predictWrapper() {
    this.props.predict(this.state.vineyard, this.state.hisYear, this.state.curYear, this.state.startDateCurYear);
  }

  render() {

    console.log(this.state);

    return (
      <div>
        <h3>Control Panel</h3>
        <div>
          <div>Select vineyard:</div>
          <DropdownList
            style={{height:'30px', width:'100px'}}
            data={VINEYARDS}
            onChange={ value => { this.setState({vineyard:value}) } }
          />
        </div>

        <div>
          <div>Select historical year:</div>
          <DropdownList
            style={{height:'30px', width:'100px'}}
            data={YEARS}
            onChange={ value => { this.setState({hisYear:value}) } }
          />
        </div>

        <div>
          <div>Select current year:</div>
          <DropdownList
            style={{height:'30px', width:'100px'}}
            data={YEARS}
            onChange={ value => { this.setState({curYear:value}) } }
          />
        </div>

        <div>
          <div>Select start date for current year:</div>
          <DatePicker
            style={{height:'30px', width:'80px'}}
            selected={ this.state.startDateCurYear }
            onChange={ value => this.setState({startDateCurYear:value}) }
          />
        </div>
        <div>
          <button onClick={ this.predictWrapper }>
            Submit
          </button>
        </div>
        <div>
          Prediction result: {this.props.preDate}
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({predict}, dispatch);
}

function mapStatetoProps(state) {
  return {preDate:state.preDate};
}

export default connect(null, mapDispatchToProps)(ControlPanel);
