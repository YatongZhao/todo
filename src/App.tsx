import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from './store/store';
import { DataByTimeRange } from './Data';
import moment from 'moment';
import { useObserver } from 'mobx-react-lite';
import {
  Box
} from '@material-ui/core';
import { AddProject } from './components/AddProject';
import { Today } from './components/Today';

const App = () => {
  const store = useContext(StoreContext);
  const [days, setDays] = useState([Date.now()]);
  const [dataByTimeRanges, setDataByTimeRanges] = useState([] as DataByTimeRange[]);

  useEffect(() => {
    setDataByTimeRanges(days.map(day => new DataByTimeRange(
      store,
      moment(day).startOf('day').valueOf(),
      moment(day).endOf('day').valueOf()
    )));
  }, [days, store]);

  function addBackDay() {
    setDays([
      days[0] - 1000 * 60 * 60 * 24,
      ...days
    ]);
  }

  function addFrontDay() {
    setDays([
      ...days,
      days[days.length - 1] + 1000 * 60 * 60 * 24
    ]);
  }

  return useObserver(() => (
  <Box>
    <AddProject />
    {dataByTimeRanges.length > 0 && (
    <Today data={dataByTimeRanges[0]} />
    )}
    {dataByTimeRanges.map((dataByTimeRange, index) => {
      if (index === 0) return '';
      return (
        <Box key={`${dataByTimeRange.maxTime}-${dataByTimeRange.minTime}`}>
          {dataByTimeRange.pendingData.map(item => (
            <Box key={item.head.data.projectId}>
              {item.head.data.title}
            </Box>
          ))}
        </Box>
      );
    })}
  </Box>
  ));
}

export default App;
