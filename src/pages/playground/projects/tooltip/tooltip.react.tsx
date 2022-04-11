import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import './tooltip.scss';

enum TooltipPosition {
  right = 'right',
  left = 'left',
  top = 'top',
  bottom = 'bottom',
}

interface TooltipProps {
  content: React.ReactChild;
  position: TooltipPosition;
  children: React.ReactChild;
}
const Tooltip: React.FunctionComponent<TooltipProps> = ({
  children,
  content,
  position,
}) => {
  const wrapperRef = useRef<HTMLDivElement>();
  const tooltipRef = useRef<HTMLDivElement>();
  const [tooltipBounds, setSetTooltipBounds] = useState<DOMRect>();
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [style, setStyle] = useState({});

  const onOver = useCallback(() => {
    // setIsActive(true);
  }, [children]);

  const onOut = useCallback(() => {
    // setIsActive(false);
  }, [children]);

  const onResize = useCallback(() => {
    const bounds = wrapperRef.current.getBoundingClientRect();
    console.log('resizse', JSON.stringify(bounds));
  }, [wrapperRef.current])

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    console.log('layout effect', JSON.stringify(bounds));
    setTimeout(
      () =>
        console.log('timeout', JSON.stringify(wrapperRef.current.getBoundingClientRect())),
      1000
    );
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [wrapperRef.current]);

  // useEffect(() => {
  //   setSetTooltipBounds(tooltipRef.current.getBoundingClientRect());
  //   setIsLoading(false);
  // }, []);

  return (
    <div
      className="tooltip-wrapper"
      id="foo"
      onMouseOver={onOver}
      onMouseOut={onOut}
      ref={wrapperRef}
    >
      {children}
      {(isActive || isLoading) && (
        <div
          className={`tooltip tooltip-position-${position}`}
          style={style}
          ref={tooltipRef}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export const TooltipReact = () => {
  return (
    <article>
      <header>
        <h4>Tooltip examples</h4>
      </header>
      <div className="content">
        <h3>The Problem</h3>
        <p>
          I recently fixed a navigation issue at work that involved a tiered,
          CSS-driven dropdown/flyout menu. The menu worked properly using the
          CSS :hover selector but it{' '}
          <strong>did not support localization well</strong> and because of
          that, the CSS used "worse-case" hard-coded widths to ensure all
          locales were supported. In languages where the navigation text was
          much shorter than the "worse-case", the second tier of the menu used a
          width much too large for the text.
        </p>

        <h3>The Solution</h3>
        <p
          data-height="268"
          data-theme-id="0"
          data-slug-hash="AkJze"
          data-default-tab="result"
          className="codepen"
        >
          See the Pen{' '}
          <a href="http://codepen.io/chrisronline/pen/AkJze/">AkJze</a> by Chris
          Roberson (<a href="http://codepen.io/chrisronline">@chrisronline</a>)
          on <a href="http://codepen.io">CodePen</a>.
        </p>
        <div>
          I designed a fluid-width,{' '}
          <Tooltip content="Chris is cool" position={TooltipPosition.top}>
            CSS-based tertiary (tooltip TOP)
          </Tooltip>{' '}
          menu system that contains no hard-coded widths or assumptions about
          sizing.
        </div>
        <h3>Build</h3>
        <p>
          Let's go through the process of building this menu from scratch but
          first, let's define some goals
        </p>

        <h4>Goals</h4>
        <ol>
          <li>No explicit widths</li>
          <li>Support in IE8, Chrome, Safari and Firefox</li>
          <li>No javascript</li>
        </ol>

        <h3>All Done</h3>
        <p>
          Whew...finally done! We now have a fluid, CSS-only navigation bar that
          supports secondary and tertiary levels of navigation!
        </p>
      </div>
    </article>
  );
};
