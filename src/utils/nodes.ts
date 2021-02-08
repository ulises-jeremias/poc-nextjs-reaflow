import filter from 'lodash.filter';
import { PortData } from 'reaflow';
import { v1 as uuid } from 'uuid';
import BaseEdgeData from '../types/BaseEdgeData'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/
import BaseNodeData from '../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../types/BaseNodeDefaultProps';

/**
 * Creates a new node and returns it.
 *
 * @param nodeData
 */
export const createNode = (nodeData?: Partial<BaseNodeData>): BaseNodeData => {
  let { id = uuid() } = nodeData || {};

  const newNode = {
    ...nodeData,
    id,
  };
  console.log('newNode', newNode);

  return newNode;
};

/**
 * Creates a new node from the default props and returns it.
 *
 *
 * @param defaultProps
 */
export const createNodeFromDefaultProps = (defaultProps: BaseNodeDefaultProps): BaseNodeData => {
  console.log('createNodeFromDefaultProps', defaultProps);
  const node = {
    text: undefined,
    width: defaultProps.defaultWidth,
    height: defaultProps.defaultHeight,
    data: {
      type: defaultProps.type,
      defaultWidth: defaultProps.defaultWidth,
      defaultHeight: defaultProps.defaultHeight,
    },
    ports: defaultProps.ports || [],
  };

  return createNode(node);
};

/**
 * Add a node and optional edge, and automatically link their ports.
 *
 * Automatically connects the fromNode (left node) using its EAST port (right side) to the newNode (right node) using it's WEST port (left side).
 *
 * XXX Does not support adding a newNode as left node, it must be on the right side of the fromNode.
 *
 * Similar to reaflow.addNodeAndEdge utility.
 */
export function addNodeAndEdgeThroughPorts(
  nodes: BaseNodeData[],
  edges: BaseEdgeData[],
  newNode: BaseNodeData,
  fromNode?: BaseNodeData,
) {
  const fromPort: PortData | undefined = fromNode?.ports?.find((port: PortData) => port?.side === 'EAST');
  const toPort: PortData | undefined = newNode?.ports?.find((port: PortData) => port?.side === 'WEST');
  const newEdge: BaseEdgeData = {
    id: `${fromNode?.id || uuid()}-${newNode.id}`,
    from: fromNode?.id,
    to: newNode.id,
    parent: newNode.parent,
    fromPort: fromPort?.id,
    toPort: toPort?.id,
  };

  return {
    nodes: [...nodes, newNode],
    edges: [
      ...edges,
      ...(fromNode ?
        [
          newEdge,
        ]
        : []),
    ],
  };
}

/**
 * Filter out a node from an array of nodes.
 *
 * @param nodes
 * @param nodeToFilter
 */
export const filterNodeInArray = (nodes: BaseNodeData[], nodeToFilter: BaseNodeData) => {
  return filter(nodes, (node: BaseNodeData) => {
    return node?.id !== nodeToFilter.id;
  });
};

/**
 * Helper function for upserting a node in a edge (split the edge in 2 and put the node in between), and automatically link their ports.
 *
 * Automatically connects the left edge to the newNode using it's WEST port (left side).
 * Automatically connects the right edge to the newNode using it's EAST port (right side).
 *
 * Similar to reaflow.upsertNode utility.
 */
export function upsertNodeThroughPorts(
  nodes: BaseNodeData[],
  edges: BaseEdgeData[],
  edge: BaseEdgeData,
  newNode: BaseNodeData
) {
  const oldEdgeIndex = edges.findIndex(e => e.id === edge.id);
  const edgeBeforeNewNode = {
    ...edge,
    id: `${edge.from}-${newNode.id}`,
    to: newNode.id
  };
  const edgeAfterNewNode = {
    ...edge,
    id: `${newNode.id}-${edge.to}`,
    from: newNode.id
  };

  if (edge.fromPort && edge.toPort) {
    const fromLeftNodeToWestPort: PortData | undefined = newNode?.ports?.find((port: PortData) => port?.side === 'WEST');
    const fromRightNodeToEastPort: PortData | undefined = newNode?.ports?.find((port: PortData) => port?.side === 'EAST');

    edgeBeforeNewNode.fromPort = edge.fromPort;
    edgeBeforeNewNode.toPort = fromLeftNodeToWestPort?.id || `${newNode.id}-to`;

    edgeAfterNewNode.fromPort = fromRightNodeToEastPort?.id || `${newNode.id}-from`;
    edgeAfterNewNode.toPort = edge.toPort;
  }

  edges.splice(oldEdgeIndex, 1, edgeBeforeNewNode, edgeAfterNewNode);

  return {
    nodes: [...nodes, newNode],
    edges: [...edges]
  };
}
