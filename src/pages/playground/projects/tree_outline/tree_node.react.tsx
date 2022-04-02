import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { TreeOutlineContext } from './tree_outline.context';
import { Tree } from './types';

const OPEN_ICON = solid('angle-down');
const COLLAPASED_ICON = solid('angle-right');

interface TreeNodeProps {
  node: Tree;
  isParentOpen: boolean;
}
export const TreeNode: React.FunctionComponent<TreeNodeProps> = ({ node }) => {
  const { toggleNode, isOpen } = useContext(TreeOutlineContext);
  const children = node.children?.map((child, index) => (
    <ul className="node-children" key={index}>
      <TreeNode isParentOpen={isOpen(node.id)} node={child} />
    </ul>
  ));

  return (
    <li>
      <div
        className="node-name-wrapper"
        onClick={toggleNode.bind(null, node.id)}
      >
        <div className="node-status-icon">
          <FontAwesomeIcon
            icon={node.icon ?? (isOpen(node.id) ? OPEN_ICON : COLLAPASED_ICON)}
            size="xs"
          />
        </div>
        <div className="node-label">{node.label}</div>
      </div>
      {isOpen(node.id) && children}
    </li>
  );
};
