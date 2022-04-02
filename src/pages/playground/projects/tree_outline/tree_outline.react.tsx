import React, { useEffect, useState } from 'react';
import './tree_outline.scss';
import { Tree } from './types';
import { SAMPLE_ROOT } from './tree_outline.mock.data';
import { TreeNode } from './tree_node.react';
import { TreeOutlineContext } from './tree_outline.context';

interface TreeOutlineReactProps {
  root?: Tree;
}
export const TreeOutlineReact: React.FunctionComponent<
  TreeOutlineReactProps
> = ({ root = SAMPLE_ROOT }) => {
  const [stateByNodeId, setStateByNodeId] = useState<Map<number, boolean>>(
    new Map()
  );

  function isOpen(id: number) {
    return stateByNodeId.has(id) && stateByNodeId.get(id);
  }

  function toggleNode(id: number) {
    const newMap = new Map(stateByNodeId);
    if (!stateByNodeId.has(id)) {
      newMap.set(id, true);
    } else {
      newMap.set(id, !stateByNodeId.get(id));
    }
    setStateByNodeId(newMap);
  }

  useEffect(() => {
    const stateFromProps = new Map<number, boolean>();
    initState(root);
    setStateByNodeId(stateFromProps);
    function initState(node: Tree) {
      stateFromProps.set(node.id, false);
      if (node.children) node.children.forEach(initState);
    }
  }, [root]);

  return (
    <TreeOutlineContext.Provider value={{ toggleNode, isOpen }}>
      <article>
        <ul>
          <TreeNode node={root} isParentOpen={true} />
        </ul>
      </article>
    </TreeOutlineContext.Provider>
  );
};
