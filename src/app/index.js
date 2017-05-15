import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ControlPanel from '../containers/control_panel';
import Chart from '../components/chart';

export default class Root extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Harvest Prediction Module</h2>
          Please input parameters in the control panel to get started.
        </div>
        <ControlPanel />
        <Chart />
      </div>
    )
  };
}
