import React, { Component } from 'react';
import { connect } from 'react-redux';
import vineyardDataSelector from '../selectors/vineyardDataSelector';

class LineChart extends Component {
  render() {

    if(!this.props.time_series)
      return <div><h3>Temperature Chart</h3></div>

    return (
      <div>
        <h3>Temperature Chart</h3>
      </div>
    )
  };
}

function mapStateToProps(state) {
  return {
    time_series: vineyardDataSelector(state)
  }
}

export default connect(mapStateToProps)(LineChart);
