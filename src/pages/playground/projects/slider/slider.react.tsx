import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import './slider.scss';

export const SliderReact = () => {
  const slider = useRef<HTMLDivElement>();
  const sliderBounds = useRef<DOMRect>();
  const wrapperBounds = useRef<DOMRect>();
  const wrapper = useRef<HTMLDivElement>();
  const offset = useRef(0);
  const sliding = useRef(false);

  function start() {
    sliding.current = true;
  }

  function move(event: React.MouseEvent<HTMLDivElement>) {
    if (sliding.current) {
      offset.current = enforceBounds(offset.current + event.movementX);
      slider.current.style.left = `${offset.current}px`;
    }
  }

  function enforceBounds(left: number) {
    const largestLeft = wrapperBounds.current.width - (sliderBounds.current.width / 2);
    if (left > largestLeft) {
      left = largestLeft;
    } else if (left < 0) {
      left = 0;
    }
    return left;
  }

  function moveTo(event: React.MouseEvent<HTMLDivElement>) {
    offset.current = enforceBounds(event.clientX - sliderBounds.current.x - (sliderBounds.current.width / 2));
    slider.current.style.left = `${offset.current}px`;
  }

  function stop() {
    sliding.current = false;
  }

  useEffect(() => {
    sliderBounds.current = slider.current.getBoundingClientRect();
  }, [slider.current]);

  useEffect(() => {
    wrapperBounds.current = wrapper.current.getBoundingClientRect();
  }, [wrapper.current]);

  return (
    <div
      className="slider-component-wrapper"
      onMouseDown={start}
      onMouseMove={move}
      onMouseUp={stop}
      onMouseLeave={stop}
    >
      <div className="slider-component">
        <div className="slider-left-icon">
          <FontAwesomeIcon icon={solid('volume-low')} />
        </div>
        <div className="slider-wrapper" onClick={moveTo} ref={wrapper}>
          <div className="slider-background"/>
          <div className="slider-element" ref={slider} />
        </div>
        <div className="slider-right-icon">
          <FontAwesomeIcon icon={solid('volume-high')} />
        </div>
      </div>
    </div>
  );
};
