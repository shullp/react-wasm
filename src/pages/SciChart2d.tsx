import { useRef, useEffect, useState } from 'react';
import { useWasm } from '../hooks';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import BandSeriesChart from '../components/Charts/2d/BandSeries';
import BubbleChart from '../components/Charts/2d/BubbleChart';
import HeatMapChart from '../components/Charts/2d/HeatMapChart';
import OhlcChart from '../components/Charts/2d/OhlcChart';

const ChartContainer = styled.div`
  padding: 20px;
  border: 1px solid #e2e2e2;
`;
const ChartTitle = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function SciChart2d() {
  return (
    <div className="scichart">
      <ChartContainer>
        <ChartTitle>BandSeriesChart</ChartTitle>
        <BandSeriesChart />
      </ChartContainer>
      <ChartContainer>
        <ChartTitle>BubbleChart</ChartTitle>
        <BubbleChart />
      </ChartContainer>
      <ChartContainer>
        <ChartTitle>OHLC Chart</ChartTitle>
        <OhlcChart />
      </ChartContainer>
      <ChartContainer>
        <ChartTitle>HeatMapChart</ChartTitle>
        <HeatMapChart />
      </ChartContainer>
    </div>
  );
}

export default SciChart2d;
