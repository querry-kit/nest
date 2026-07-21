import {
  isPlainObject,
  parseObject
} from "./chunk-WOJX6DQR.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/fields/api-fields-query.decorator.ts
import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiQuery } from "@nestjs/swagger";
var defaultQueryDescription = "Comma-separated response field projection. Use nested selections with braces, for example `id,name,profile{email}`.";
var defaultBadRequestDescription = "The `fields` query parameter is invalid.";
function ApiFieldsQuery(options = {}) {
  return applyDecorators(
    ApiQuery({
      name: "fields",
      required: false,
      type: String,
      description: defaultQueryDescription,
      ...options.query
    }),
    ApiBadRequestResponse({
      description: defaultBadRequestDescription,
      schema: {
        type: "object",
        required: ["statusCode", "message", "details"],
        properties: {
          statusCode: {
            type: "number",
            example: 400
          },
          message: {
            type: "string",
            example: "Invalid fields query parameter"
          },
          details: {
            type: "string",
            example: 'unknown field "name"'
          },
          path: {
            type: "string",
            example: "profile.name"
          },
          position: {
            type: "number",
            example: 8
          }
        }
      },
      ...options.badRequest
    })
  );
}

// src/fields/core/bad-request.exception.ts
import { BadRequestException } from "@nestjs/common";
var FieldsBadRequestException = class extends BadRequestException {
  /**
   * Creates a structured fields bad request error.
   *
   * @param {FieldsBadRequestResponse} response The response body details.
   */
  constructor(response) {
    super(response);
  }
};

// src/fields/core/schema.ts
function createRelationSchemaNode(fields) {
  return { relation: true, fields };
}
function relation(fields) {
  return createRelationSchemaNode(fields);
}
function isRelationSchemaNode(node) {
  return node !== true;
}

// src/fields/core/dto-schema.ts
var SWAGGER_PROPERTIES_ARRAY = "swagger/apiModelPropertiesArray";
var SWAGGER_PROPERTY = "swagger/apiModelProperties";
function getDtoFields(dtoClass) {
  const fields = Reflect.getMetadata?.(SWAGGER_PROPERTIES_ARRAY, dtoClass.prototype) ?? [];
  if (!Array.isArray(fields)) {
    return [];
  }
  return fields.filter((field) => typeof field === "string").map((field) => field.replace(":", ""));
}
function resolvePropertyType(dtoClass, field) {
  const getMetadata = Reflect.getMetadata;
  const swaggerProperty = getMetadata?.(SWAGGER_PROPERTY, dtoClass.prototype, field);
  let resolvedType = swaggerProperty?.type;
  if (typeof resolvedType === "function") {
    try {
      resolvedType = resolvedType();
    } catch {
    }
  }
  if (Array.isArray(resolvedType) && resolvedType.length === 1) {
    resolvedType = resolvedType[0];
  }
  if (typeof resolvedType === "undefined") {
    resolvedType = getMetadata?.("design:type", dtoClass.prototype, field);
  }
  return resolvedType;
}
function isDtoClass(value) {
  if (typeof value !== "function") {
    return false;
  }
  const fields = Reflect.getMetadata?.(SWAGGER_PROPERTIES_ARRAY, value.prototype);
  return Array.isArray(fields) && fields.length > 0;
}
function buildFieldSchemaFromDto(dtoClass, visited = /* @__PURE__ */ new Set()) {
  const schema = {};
  for (const field of getDtoFields(dtoClass)) {
    const fieldType = resolvePropertyType(dtoClass, field);
    if (isDtoClass(fieldType)) {
      if (visited.has(fieldType)) {
        schema[field] = createRelationSchemaNode({});
      } else {
        const nextVisited = new Set(visited);
        nextVisited.add(fieldType);
        schema[field] = createRelationSchemaNode(buildFieldSchemaFromDto(fieldType, nextVisited));
      }
    } else {
      schema[field] = true;
    }
  }
  return schema;
}

// src/fields/core/include.ts
function mergeInclude(base, extension) {
  const parsedBase = normalizeInclude(base);
  const parsedExtension = normalizeInclude(extension);
  if (!parsedBase) {
    return parsedExtension;
  }
  if (!parsedExtension) {
    return parsedBase;
  }
  return mergeIncludeObjects(parsedBase, parsedExtension);
}
function buildFieldsInclude(projection, schema, existing) {
  const parsedExisting = parseObject(existing);
  const current = parsedExisting && typeof parsedExisting === "object" && !Array.isArray(parsedExisting) ? parsedExisting : {};
  const result = { ...current };
  for (const key of Object.keys(projection)) {
    const node = schema[key];
    if (!node || !isRelationSchemaNode(node)) {
      continue;
    }
    const selected = projection[key];
    const nested = selected === true ? {} : buildFieldsInclude(selected, node.fields);
    const generated = selected === true || Object.keys(nested).length === 0 ? true : { include: nested };
    const configured = result[key];
    if (configured && typeof configured === "object" && !Array.isArray(configured) && generated !== true) {
      const configuredObject = configured;
      if (typeof configuredObject.select === "object" && configuredObject.select !== null && !Array.isArray(configuredObject.select)) {
        result[key] = {
          ...configuredObject,
          select: {
            ...configuredObject.select,
            ...generated.include
          }
        };
        continue;
      }
      result[key] = {
        ...configuredObject,
        include: {
          ...typeof configuredObject.include === "object" && configuredObject.include !== null && !Array.isArray(configuredObject.include) ? configuredObject.include : {},
          ...generated.include
        }
      };
    } else if (typeof configured === "undefined" || configured === true && generated !== true) {
      result[key] = generated;
    }
  }
  return result;
}
function normalizeInclude(include) {
  const parsed = parseObject(include);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return void 0;
  }
  return parsed;
}
function mergeIncludeObjects(base, extension) {
  const result = { ...base };
  for (const [key, value] of Object.entries(extension)) {
    const current = result[key];
    if (isPlainIncludeObject(current) && isPlainIncludeObject(value)) {
      result[key] = mergeIncludeObjects(current, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function isPlainIncludeObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// src/fields/core/selection-parser.ts
var FieldsSelectionParser = class {
  /**
   * Creates a parser for one raw `fields` string.
   *
   * @param {string} input The raw fields string.
   */
  constructor(input) {
    this.input = input;
  }
  input;
  pos = 0;
  /**
   * Parses the full input into a projection tree.
   *
   * @returns {FieldsProjection} The parsed projection tree.
   * @throws {FieldsBadRequestException} If the syntax is invalid.
   */
  parse() {
    this.skipWhitespace();
    if (!this.hasMore()) {
      throw this.error("fields cannot be empty");
    }
    const projection = this.parseSelectionList();
    this.skipWhitespace();
    if (this.hasMore()) {
      throw this.error(`unexpected token "${this.peek()}"`);
    }
    return projection;
  }
  /**
   * Parses a comma-separated selection list.
   *
   * @returns {FieldsProjection} The parsed selection set.
   */
  parseSelectionList() {
    const selection = {};
    while (true) {
      this.skipWhitespace();
      if (!this.hasMore() || this.peek() === "}") {
        break;
      }
      const fieldName = this.parseName();
      this.skipWhitespace();
      let child = true;
      if (this.peek() === "{") {
        this.consume("{");
        child = this.parseSelectionList();
        this.skipWhitespace();
        this.consume("}");
      }
      const current = selection[fieldName];
      if (typeof current === "undefined") {
        selection[fieldName] = child;
      } else if (current !== true && child !== true) {
        selection[fieldName] = { ...current, ...child };
      }
      this.skipWhitespace();
      if (this.peek() === ",") {
        this.consume(",");
        continue;
      }
      if (!this.hasMore() || this.peek() === "}") {
        break;
      }
      throw this.error("expected comma or closing brace");
    }
    if (Object.keys(selection).length === 0) {
      throw this.error("selection set cannot be empty");
    }
    return selection;
  }
  /**
   * Parses one field identifier.
   *
   * @returns {string} The parsed field name.
   */
  parseName() {
    if (!this.hasMore()) {
      throw this.error("unexpected end of input while reading field name");
    }
    const start = this.pos;
    const first = this.peek();
    if (!/[A-Za-z_]/.test(first)) {
      throw this.error(`invalid field start "${first}"`);
    }
    this.pos++;
    while (this.hasMore() && /[A-Za-z0-9_]/.test(this.peek())) {
      this.pos++;
    }
    return this.input.slice(start, this.pos);
  }
  /**
   * Advances the parser position over whitespace.
   *
   * @returns {void}
   */
  skipWhitespace() {
    while (this.hasMore() && /\s/.test(this.peek())) {
      this.pos++;
    }
  }
  /**
   * Checks whether input remains.
   *
   * @returns {boolean} `true` when the parser has not reached the end.
   */
  hasMore() {
    return this.pos < this.input.length;
  }
  /**
   * Reads the current character without consuming it.
   *
   * @returns {string} The current character.
   */
  peek() {
    return this.input[this.pos] ?? "";
  }
  /**
   * Consumes an expected token.
   *
   * @param {string} ch The expected character to consume.
   * @returns {void}
   */
  consume(ch) {
    if (this.peek() !== ch) {
      throw this.error(`expected "${ch}"`);
    }
    this.pos++;
  }
  /**
   * Builds a standardized bad request exception.
   *
   * @param {string} details The parser error details.
   * @returns {FieldsBadRequestException} The structured bad request exception.
   */
  error(details) {
    return new FieldsBadRequestException({
      message: "Invalid fields query parameter",
      details,
      position: this.pos
    });
  }
};

// src/fields/core/parser.ts
var FieldsParser = class {
  /**
   * Parses a `fields` value into a projection tree.
   *
   * @param {unknown} value The raw `fields` query parameter value.
   * @returns {FieldsProjection | undefined} The parsed projection tree or `undefined`.
   * @throws {FieldsBadRequestException} If the value type or syntax is invalid.
   */
  static parse(value) {
    if (typeof value === "undefined" || value === null || value === "") {
      return void 0;
    }
    if (typeof value !== "string") {
      throw new FieldsBadRequestException({
        message: "Invalid fields query parameter",
        details: "fields must be a string"
      });
    }
    return new FieldsSelectionParser(value).parse();
  }
};

// src/fields/core/projector.ts
var FieldsProjector = class {
  /**
   * Projects any source value to the requested shape.
   *
   * @param {T} value The source value to project.
   * @param {FieldsProjection} [projection] The requested fields tree.
   * @returns {T} The projected value.
   */
  static project(value, projection) {
    if (!projection) {
      return value;
    }
    return this.projectInternal(value, projection);
  }
  /**
   * Recursively projects one value.
   *
   * @param {unknown} value The current source value.
   * @param {FieldsProjection | true} projection The projection node.
   * @returns {unknown} The projected value for the current node.
   */
  static projectInternal(value, projection) {
    if (projection === true) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.projectInternal(item, projection));
    }
    if (value === null || typeof value === "undefined") {
      return value;
    }
    if (typeof value !== "object") {
      return value;
    }
    const source = value;
    const out = {};
    for (const key of Object.keys(projection)) {
      out[key] = this.projectInternal(source[key], projection[key]);
    }
    return out;
  }
};

// src/fields/util/validator.helpers.ts
function fieldsValidationBadRequest(details, path) {
  return new FieldsBadRequestException({
    message: "Invalid fields query parameter",
    details,
    path
  });
}
function getIncludeChild(include, key) {
  if (!isPlainObject(include)) {
    return void 0;
  }
  return include[key];
}
function hasNestedRelationSelection(projection, schema) {
  for (const key of Object.keys(projection)) {
    const projectionNode = projection[key];
    const schemaNode = schema[key];
    if (!schemaNode || !isRelationSchemaNode(schemaNode) || projectionNode === true) {
      continue;
    }
    return true;
  }
  return false;
}
function getNestedIncludeContext(includeChild) {
  if (includeChild === true) {
    return true;
  }
  if (!isPlainObject(includeChild)) {
    return void 0;
  }
  if (isPlainObject(includeChild.include)) {
    return includeChild.include;
  }
  return includeChild;
}

// src/fields/core/validator.ts
var FieldsValidator = class {
  /**
   * Validates field names and nesting against a schema.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {string} [path] The internal traversal path.
   * @returns {void}
   * @throws {FieldsBadRequestException} If an unknown field or invalid nesting is used.
   */
  static validateProjection(projection, schema, path = "") {
    for (const key of Object.keys(projection)) {
      const node = schema[key];
      const fieldPath = path ? `${path}.${key}` : key;
      if (!node) {
        throw fieldsValidationBadRequest(`unknown field "${key}"`, fieldPath);
      }
      const projectionNode = projection[key];
      if (projectionNode !== true) {
        if (!isRelationSchemaNode(node)) {
          throw fieldsValidationBadRequest(`field "${key}" does not support nested selections`, fieldPath);
        }
        this.validateProjection(projectionNode, node.fields, fieldPath);
      }
    }
  }
  /**
   * Ensures a projection only contains top-level fields.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @returns {void}
   * @throws {FieldsBadRequestException} If nested selections are present.
   */
  static validateNoNestedSelection(projection) {
    for (const key of Object.keys(projection)) {
      if (projection[key] !== true) {
        throw fieldsValidationBadRequest(`nested selection is not supported on this endpoint (field "${key}")`, key);
      }
    }
  }
  /**
   * Validates that selected relation fields are backed by explicit includes.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {unknown} include The include query object.
   * @param {string} [path] The internal traversal path.
   * @returns {void}
   * @throws {FieldsBadRequestException} If required include values are missing.
   */
  static validateIncludeRequirements(projection, schema, include, path = "") {
    for (const key of Object.keys(projection)) {
      const node = schema[key];
      const projectionNode = projection[key];
      if (!isRelationSchemaNode(node)) {
        continue;
      }
      const fieldPath = path ? `${path}.${key}` : key;
      const includeChild = getIncludeChild(include, key);
      if (typeof includeChild === "undefined") {
        throw fieldsValidationBadRequest(
          `relation field "${fieldPath}" requires include (missing include.${fieldPath})`,
          fieldPath
        );
      }
      if (projectionNode === true) {
        continue;
      }
      const nestedInclude = getNestedIncludeContext(includeChild);
      if (nestedInclude === true && hasNestedRelationSelection(projectionNode, node.fields)) {
        throw fieldsValidationBadRequest(
          `nested relation selection for "${fieldPath}" requires explicit nested include`,
          fieldPath
        );
      }
      this.validateIncludeRequirements(
        projectionNode,
        node.fields,
        nestedInclude === true ? void 0 : nestedInclude,
        fieldPath
      );
    }
  }
};

// src/fields/core/fields.ts
var Fields = class {
  /**
   * Builds a Prisma-compatible include object from a validated projection.
   *
   * Existing include configuration is preserved and dotted query keys are
   * normalized through the bundled object utilities.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {unknown} [existing] The existing include query configuration.
   * @returns {Record<string, unknown>} The merged include configuration.
   */
  static include(projection, schema, existing) {
    return buildFieldsInclude(projection, schema, existing);
  }
  /**
   * Parses and validates a raw `fields` value.
   *
   * @param {unknown} rawFields The raw query parameter value.
   * @param {FieldSchema} schema The allowed DTO field schema.
   * @param {FieldsParseOptions} [options] The validation options.
   * @returns {FieldsProjection | undefined} The parsed projection or `undefined`.
   * @throws {FieldsBadRequestException} If parsing or validation fails.
   */
  static parseAndValidate(rawFields, schema, options) {
    const projection = FieldsParser.parse(rawFields);
    if (!projection) {
      return void 0;
    }
    FieldsValidator.validateProjection(projection, schema);
    if (options?.allowNested === false) {
      FieldsValidator.validateNoNestedSelection(projection);
    }
    if (options?.requireIncludeForRelations) {
      FieldsValidator.validateIncludeRequirements(projection, schema, options.include);
    }
    return projection;
  }
  /**
   * Applies a projection to a source value.
   *
   * @param {T} value The source value.
   * @param {FieldsProjection} [projection] The parsed projection tree.
   * @returns {T} The projected value.
   */
  static project(value, projection) {
    return FieldsProjector.project(value, projection);
  }
};

// src/fields/fields-query.decorator.ts
import { createParamDecorator } from "@nestjs/common";
var FieldsQueryParam = createParamDecorator(
  (data, context) => {
    const request = context.switchToHttp().getRequest();
    const schema = buildFieldSchemaFromDto(data.dtoClass);
    return Fields.parseAndValidate(request.query?.fields, schema, data.options);
  }
);
function FieldsQuery(dtoClass, options) {
  return FieldsQueryParam({ dtoClass, options });
}

// src/fields/filters/exception.filter.ts
import { Catch } from "@nestjs/common";
var FieldsExceptionFilter = class {
  /**
   * Writes the fields error response through the active HTTP adapter response.
   *
   * @param {FieldsBadRequestException} exception The fields parser or validator exception.
   * @param {ArgumentsHost} host The Nest arguments host.
   * @returns {void}
   */
  catch(exception, host) {
    const response = host.switchToHttp().getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    response.status(statusCode).json({
      statusCode,
      ...typeof exceptionResponse === "object" ? exceptionResponse : { message: exceptionResponse }
    });
  }
};
FieldsExceptionFilter = __decorateClass([
  Catch(FieldsBadRequestException)
], FieldsExceptionFilter);

// src/fields/prepare-fields-query.ts
function prepareFieldsQuery(query, schemaOrDto, options) {
  const schema = resolveFieldSchema(schemaOrDto);
  const mergedInclude = mergeInclude(options?.baseInclude, query.include);
  const projection = Fields.parseAndValidate(query.fields, schema, {
    ...options,
    include: options?.include ?? mergedInclude
  });
  if (!projection) {
    return {
      query: {
        ...query,
        ...typeof mergedInclude === "undefined" ? {} : { include: mergedInclude }
      },
      projection
    };
  }
  return {
    query: {
      ...query,
      include: Fields.include(projection, schema, mergedInclude)
    },
    projection
  };
}
function resolveFieldSchema(schemaOrDto) {
  if (typeof schemaOrDto === "function") {
    return buildFieldSchemaFromDto(schemaOrDto);
  }
  return schemaOrDto;
}

export {
  ApiFieldsQuery,
  FieldsBadRequestException,
  createRelationSchemaNode,
  relation,
  getDtoFields,
  buildFieldSchemaFromDto,
  mergeInclude,
  FieldsParser,
  FieldsProjector,
  FieldsValidator,
  Fields,
  FieldsQuery,
  FieldsExceptionFilter,
  prepareFieldsQuery,
  resolveFieldSchema
};
//# sourceMappingURL=chunk-XDODSSM3.js.map