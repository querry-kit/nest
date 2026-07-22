import { FieldSchema, FieldSchemaNode } from '../types/schema.types';

/**
 * Creates a relation schema node.
 *
 * @param {FieldSchema} fields The nested field schema for the relation.
 * @returns {FieldSchemaNode} The relation schema node.
 */
export function relation(fields: FieldSchema): FieldSchemaNode {
  return { relation: true, fields };
}

/**
 * Checks whether a schema node describes a relation.
 *
 * @param {FieldSchemaNode} node The schema node to inspect.
 * @returns {boolean} `true` when the node contains a nested relation schema.
 */
export function isRelationSchemaNode(node: FieldSchemaNode): node is { relation: true; fields: FieldSchema } {
  return node !== true;
}
