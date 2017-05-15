import React, { Component } from 'react';
import { connect } from 'react-redux';

class LineChart extends Component {
  render() {

    if(!this.props.vineyard)
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
    vineyard: state.selectedVineyard
  }
}

export default connect(mapStateToProps)(LineChart);
