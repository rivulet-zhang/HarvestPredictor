import React, { Component } from 'react';
import { DropdownList, DateTimePicker, SelectList } from 'react-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { predict } from '../actions'
import moment from 'moment';
import DatePicker from 'react-datepicker';

// const VINEYARDS = ['bigRanch', 'tresSabores'];
const VINEYARDS = ['bigRanch'];
const YEARS = ["2014", "2015", "2016", "2017"];
const SEASONS = ['budbreak', 'fruitset', 'April-1', 'veraison'];
const METHODS = ['GDD-daily', 'GDD-hourly', 'HDD-daily'];
const OPTIONS = ['default', 'upperlimit-95'];

class ControlPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vineyard:null,
      hisYear:null,
      curYear:null,
      startDateCurYear:null,
      season:null,
      options:null
    };

    this.predictWrapper = this.predictWrapper.bind(this);
    this.predictWrapperBatch = this.predictWrapperBatch.bind(this);
  }

  predictWrapper() {

    if(!this.state.vineyard ||
      !this.state.hisYear ||
      !this.state.curYear ||
      !this.state.startDateCurYear ||
      !this.state.season ||
      !this.state.method ||
      !this.state.options)
      return;

    this.props.predict(this.state.vineyard, this.state.hisYear, this.state.curYear, this.state.season, this.state.startDateCurYear.format('YYYY-MM-DD'), this.state.method, this.state.options);
  }

  predictWrapperBatch() {

    const seasonInfo = {'2017':{'budbreak': '2017-04-04', 'fruitset': '2017-05-02', 'April-1': '2017-04-01'}};
    const vineyard = 'bigRanch';
    const option = 'upperlimit-95';
    // const option = 'default';

    let i = 0;
    for(const year of YEARS) {
      if(year == '2017') continue;
      for(const season of SEASONS) {
        if(season == 'veraison') continue;
        for(const method of METHODS) {
            setTimeout(() => {
              this.props.predict(vineyard, year, '2017', season, seasonInfo['2017'][season], method, option);
            }, 1000*i);
            i++;
            // this.props.predict(vineyard, year, '2017', season, seasonInfo['2017'][season], method, option);
        }
      }
    }


  }

  render() {

    return (
      <div>
        <h3>Control Panel</h3>
        <div>
          <div>Select vineyard:</div>
          <DropdownList
            style={{height:'30px', width:'100px'}}
            data={VINEYARDS}
            onChange={ value => this.setState({vineyard:value})}
          />
        </div>

        <div>
          <div>Select historical year:</div>
          <DropdownList
            style={{height:'30px', width:'100px'}}
            data={YEARS}
            onChange={ value => this.setState({hisYear:value})}
          />
        </div>

        <div>
          <div>Select current year:</div>
          <DropdownList
            style={{height:'30px', width:'100px'}}
            data={YEARS}
            onChange={ value => this.setState({curYear:value})}
          />
        </div>

        <div>
          <div>Select date and season for current year:</div>
          <DatePicker
            style={{height:'30px', width:'80px'}}
            selected={ this.state.startDateCurYear }
            onChange={ value => this.setState({startDateCurYear:value})}
          />
          <p />
          <SelectList
            style={{height:'130px', width:'100px'}}
            data={SEASONS}
            onChange={value => this.setState({season:value})}
            />
        </div>

        <div>
          <div>Select prediction method:</div>
          <SelectList
            style={{height:'100px', width:'200px'}}
            data={METHODS}
            onChange={value => this.setState({method:value})}
            />
        </div>

        <div>
          <div>Select additional options:</div>
          <SelectList
            style={{height:'60px', width:'200px'}}
            data={OPTIONS}
            onChange={value => this.setState({options:value})}
            />
        </div>

        <div>
          <button onClick={ this.predictWrapper }>
            Submit
          </button>
        </div>

        <div>
          <button onClick={ this.predictWrapperBatch }>
            Batch
          </button>
        </div>

      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({predict}, dispatch);
}

export default connect(null, mapDispatchToProps)(ControlPanel);
