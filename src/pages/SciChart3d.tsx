import styled from 'styled-components';

import BubbleChart from '../components/Charts/3d/BubbleChart';
import SurfaceMesh from '../components/Charts/3d/SurfaceMesh';

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
      {/* <ChartContainer>
        <ChartTitle>BubbleChart</ChartTitle>
        <BubbleChart />
      </ChartContainer> */}
      <ChartContainer>
        <ChartTitle>SurfaceMesh</ChartTitle>
        <SurfaceMesh />
      </ChartContainer>
    </div>
  );
}

export default SciChart2d;
