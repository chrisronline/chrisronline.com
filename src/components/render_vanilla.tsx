import React, { useEffect, useRef } from 'react';

export type RenderVanillaProps = {
  render: Function;
}
export const RenderVanilla: React.FunctionComponent<RenderVanillaProps> = ({ render }) => {
  const node = useRef();
  useEffect(() => {
    render(node.current);
  }, [node.current])
  return (
    <div id="vanilla" ref={node}></div>
  )
}