import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import './slider.scss';

export const SliderReact = () => {
  const slider = useRef<HTMLDivElement>();
  const bounds = useRef<DOMRect>();
  const offset = useRef(0);
  const sliding = useRef(false);

  function start() {
    sliding.current = true;
  }

  function move(event: React.MouseEvent<HTMLDivElement>) {
    if (sliding.current) {
      offset.current += event.movementX;
      event.currentTarget.style.left = `${offset.current}px`;
    }
  }

  function moveTo(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget.classList.contains('slider-background')) {
      offset.current =
        event.clientX - bounds.current.x - bounds.current.width / 2;
      slider.current.style.left = `${offset.current}px`;
    }
  }

  function stop() {
    sliding.current = false;
  }

  useEffect(() => {
    bounds.current = slider.current.getBoundingClientRect();
  }, [slider.current]);

  return (
    <div className="slider-component">
      <div className="slider-left-icon">
        <FontAwesomeIcon icon={solid('volume-low')} />
      </div>
      <div className="slider-wrapper">
        <div className="slider-background" onClick={moveTo} />
        <div
          className="slider-element"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          ref={slider}
        />
      </div>
      <div className="slider-right-icon">
        <FontAwesomeIcon icon={solid('volume-high')} />
      </div>
    </div>
  );
};
