import React, { Component } from 'react';
import { connect } from 'react-redux';
import preDateSelector from '../selectors/PreDateSelector';

class Result extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    if(!this.props.preDate)
      return <div></div>;

    return (
      <div>
        <h3>Prediction result</h3>
        <div>{this.props.preDate}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { preDate:preDateSelector(state) };
}

export default connect(mapStateToProps)(Result);
