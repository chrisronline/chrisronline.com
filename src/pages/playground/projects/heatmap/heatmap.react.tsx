import React from 'react';
import { Heatmap } from './heatmap.data';
import { MOCK_DATA } from './heatmap.mock.data';
import { HeatmapDataSet } from './types';
import './heatmap.scss';

interface HeatmapReactProps {
  data?: HeatmapDataSet;
}
export const HeatmapReact: React.FunctionComponent<HeatmapReactProps> = ({
  data = MOCK_DATA,
}) => {
  const heatmap = new Heatmap(data, '#000000', '#AAAAAA');
  return (
    <article className="heat-map-wrapper">
      <div className="heat-map-grid">
        {data.map((points, index) => (
          <div className="heat-map-row" key={index}>
            {points.map((point, _index) => (
              <div
                className="heat-map-point"
                style={{ backgroundColor: heatmap.getColor(point) }}
                key={_index}
              >
                <span className="heat-map-point-data">{point}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </article>
  );
};
