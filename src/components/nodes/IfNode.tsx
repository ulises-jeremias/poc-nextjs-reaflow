import React, { Fragment } from 'react';
import { NodeChildProps } from 'reaflow';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BasePortData from '../../types/BasePortData';
import { IfNodeData } from '../../types/nodes/IfNodeData';
import NodeType from '../../types/NodeType';
import { createPort } from '../../utils/ports';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<IfNodeData>;

const nodeType: NodeType = 'if';
const defaultWidth = 200;
const defaultHeight = 200;

/**
 * If/Else node.
 *
 * Used to split the workflow depending on the result of comparison between 2 variables.
 *
 * Displays inputs and select to defined how the variable1 should be compared to the variable2.
 * Has one west port and two east ports.
 * The west port allows unlimited links to other nodes.
 * The east port allows only one link to another node. (TODO not enforced yet)
 */
const IfNode: BaseNodeComponent<Props> = (props) => {
  const {
    patchCurrentNode,
    id,
    lastCreatedNode,
    node,
  } = props;

  return (
    <BaseNode
      nodeType={nodeType}
      {...props}
    >
      {
        ({ nodeProps }: { nodeProps: NodeChildProps }) => {

          /**
           * Updates the current node "variable1" value.
           *
           * @param event
           */
          const onSelectedVariable1Change = (event: any) => {
            const newValue = event.target.value;

            // Updates the value in the Recoil store
            patchCurrentNode({
              data: {
                variable1: newValue,
              },
            } as IfNodeData);
          };

          return (
            <Fragment>
              <div
                className={`node-header ${nodeType}-header`}
              >
                If
              </div>

              <div
                className={`node-content ${nodeType}-content`}
              >
                Else
              </div>
            </Fragment>
          );
        }
      }
    </BaseNode>
  );
};

IfNode.getDefaultPorts = (): BasePortData[] => {
  return [
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'WEST',
    }),
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'EAST',
      className: 'port-if-true'
    }),
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'EAST',
      className: 'port-if-false'
    }),
  ];
};

IfNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    type: nodeType,
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
    // @ts-ignore
    ports: IfNode.getDefaultPorts(),
  };
};

export default IfNode;