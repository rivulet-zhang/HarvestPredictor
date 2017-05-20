import React, { Component } from 'react';
import { connect } from 'react-redux';
import vineyardDataSelector from '../selectors/vineyardDataSelector';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import _ from 'lodash';

class Chart extends Component {
  render() {

    if(!this.props.time_series)
      return <div><h3>Temperature Chart</h3></div>

    const validKeys = _.filter(_.keys(this.props.time_series[0]), value => { return !_.isEqual('time', value) });
    const colors = ['#8884d8', '#82ca9d'];

    // lineEle.push(<Line dataKey={value} dot={false} stroke="#82ca9d" />);

    return (

      <div>
        <h3>Temperature Chart</h3>
        <LineChart width={800} height={300} data={this.props.time_series}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="time" />
          <YAxis />
          <CartesianGrid strokeDasharray="2 2" />
          <Tooltip />
          <Legend />
          {_.map(validKeys, (value, index) => { return <Line key={value} dataKey={value} dot={false} stroke={colors[index]} />})}
        </LineChart>
      </div>
    )
  };
}

function mapStateToProps(state) {
  return {
    time_series: vineyardDataSelector(state)
  }
}

export default connect(mapStateToProps)(Chart);
