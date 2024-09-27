import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
//import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }

  function updateStateWithNewData(years, view, office, stateSettingCallback) {
    const url = `https://hrf-asylum-be-b.herokuapp.com/cases`;
  
    // Prepare the axios requests for both endpoints
    const requests = [
      axios.get(`${url}/fiscalSummary`, {
        params: {
          from: years[0],
          to: years[1],
          office: office,
        },
      }),
      axios.get(`${url}/citizenshipSummary`, {
        params: {
          from: years[0],
          to: years[1],
          office: office,
        },
      }),
    ];

    Promise.all(requests)
      .then(([fiscalResponse, citizenshipResponse]) => {

        const fiscalData = fiscalResponse.data || {};
        const yearResults = fiscalData.yearResults || [];
        //console.log(yearResults); ensures the yearResults data is proper , nested array in fiscal 

        //ensure the data is an array to be rendered properly 
        const summaryArray = [ 
          {
            adminClosed: fiscalData.adminClosed, //fiscal
            asylumTerminated: fiscalData.asylumTerminated, //fiscal
            closedNacaraGrant: fiscalData.closedNacaraGrant, //fiscal
            denied: fiscalData.denied, //fiscal
            granted: fiscalData.granted, //fiscal
            totalCases: fiscalData.totalCases, //fiscal
            totalGranted: fiscalData.totalGranted, //fiscal
            yearResults: yearResults, //array nested in fiscal
            citizenshipResults: citizenshipResponse.data, //citizenship
          },
        ];
        

       // console.log(summaryArray); ensure the data from fiscal and citizenship are being fetched properly
  
        // Call the state setting callback with the combined data
        stateSettingCallback(view, office, summaryArray);
    })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }

    /*
          _                                                                             _
        |                                                                                 |
        |   Example request for once the `/summary` endpoint is up and running:           |
        |                                                                                 |
        |     `${url}/summary?to=2022&from=2015&office=ZLA`                               |
        |                                                                                 |
        |     so in axios we will say:                                                    |
        |                                                                                 |     
        |       axios.get(`${url}/summary`, {                                             |
        |         params: {                                                               |
        |           from: <year_start>,                                                   |
        |           to: <year_end>,                                                       |
        |           office: <office>,       [ <-- this one is optional! when    ]         |
        |         },                        [ querying by `all offices` there's ]         |
        |       })                          [ no `office` param in the query    ]         |
        |                                                                                 |
          _                                                                             _
                                   -- Mack 
    
    */

  

  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
