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
  spacingInPixels?: number;
}
const Tooltip: React.FunctionComponent<TooltipProps> = ({
  children,
  content,
  position,
  spacingInPixels = 0,
}) => {
  const wrapperRef = useRef<HTMLDivElement>();
  const tooltipRef = useRef<HTMLDivElement>();
  const [tooltipBounds, setTooltipBounds] = useState<DOMRect>();
  const [wrapperBounds, setWrapperBounds] = useState<DOMRect>();
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [style, setStyle] = useState<React.CSSProperties>({
    visibility: 'hidden',
  });

  const onOver = useCallback(() => {
    setIsActive(true);
    setStyle({
      ...style,
      visibility: 'visible',
    });
  }, [children, style]);

  const onOut = useCallback(() => {
    setIsActive(false);
    setStyle({
      ...style,
      visibility: 'hidden',
    });
  }, [children, style]);

  useEffect(() => {
    if (!tooltipBounds && !wrapperBounds) return;
    const newStyle: React.CSSProperties = { ...style };
    if (
      position === TooltipPosition.top ||
      position === TooltipPosition.bottom
    ) {
      newStyle.left = `${wrapperBounds.width / 2 - tooltipBounds.width / 2}px`;

      if (position === TooltipPosition.top) {
        if (tooltipBounds.height > wrapperBounds.height) {
          newStyle.top = `-${tooltipBounds.height + spacingInPixels}px`;
        } else {
          newStyle.top = `calc(-100% - ${spacingInPixels}px)`;
        }
      } else {
        newStyle.top = `calc(100% + ${spacingInPixels}px)`;
      }
    } else if (
      position === TooltipPosition.left ||
      position === TooltipPosition.right
    ) {
      newStyle.top = `0px`;

      if (position === TooltipPosition.left) {
        newStyle.left = `calc(-100% - ${spacingInPixels}px)`;
      } else if (position === TooltipPosition.right) {
        newStyle.left = `calc(100% + ${spacingInPixels}px)`;
      }
    }
    setStyle(newStyle);
  }, [position, tooltipBounds, wrapperBounds]);

  useEffect(() => {
    if (!tooltipRef.current || !wrapperRef.current) return;
    setTooltipBounds(tooltipRef.current.getBoundingClientRect());
    setWrapperBounds(wrapperRef.current.getBoundingClientRect());
  }, [tooltipRef.current, wrapperRef.current]);


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
        <div className={`tooltip`} style={style} ref={tooltipRef}>
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
      <div className="tooltip-content">
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
