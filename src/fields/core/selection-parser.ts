import { FieldsProjection } from '../types/schema.types';
import { FieldsBadRequestException } from './bad-request.exception';

/**
 * Stateful parser for a minimal nested field selection syntax.
 */
export class FieldsSelectionParser {
  private pos = 0;

  /**
   * Creates a parser for one raw `fields` string.
   *
   * @param {string} input The raw fields string.
   */
  constructor(private readonly input: string) {}

  /**
   * Parses the full input into a projection tree.
   *
   * @returns {FieldsProjection} The parsed projection tree.
   * @throws {FieldsBadRequestException} If the syntax is invalid.
   */
  parse(): FieldsProjection {
    if (this.input === '') {
      return {};
    }

    this.skipWhitespace();

    if (!this.hasMore()) {
      throw this.error('fields cannot be empty');
    }

    const projection = this.peek() === '{' ? this.parseWrappedSelection() : this.parseSelectionList();

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
  private parseSelectionList(allowEmpty = false): FieldsProjection {
    const selection: FieldsProjection = {};

    while (true) {
      this.skipWhitespace();

      if (!this.hasMore() || this.peek() === '}') {
        break;
      }

      const fieldName = this.parseName();
      this.skipWhitespace();

      let child: FieldsProjection | true = true;
      if (this.peek() === '{') {
        this.consume('{');
        child = this.parseSelectionList(true);
        this.skipWhitespace();
        this.consume('}');
      }

      const current = selection[fieldName];
      if (typeof current === 'undefined') {
        selection[fieldName] = child;
      } else if (current !== true && child !== true) {
        // merge duplicate relation selections instead of dropping nested fields.
        selection[fieldName] = { ...current, ...child };
      }

      this.skipWhitespace();
      if (this.peek() === ',') {
        this.consume(',');
        continue;
      }

      if (!this.hasMore() || this.peek() === '}') {
        break;
      }

      throw this.error('expected comma or closing brace');
    }

    if (!allowEmpty && Object.keys(selection).length === 0) {
      throw this.error('selection set cannot be empty');
    }

    return selection;
  }

  /**
   * Parses an optional outer selection wrapper.
   *
   * @returns {FieldsProjection} The selection inside the outer braces.
   */
  private parseWrappedSelection(): FieldsProjection {
    this.consume('{');
    const selection = this.parseSelectionList(true);
    this.skipWhitespace();
    this.consume('}');

    return selection;
  }

  /**
   * Parses one field identifier.
   *
   * @returns {string} The parsed field name.
   */
  private parseName(): string {
    if (!this.hasMore()) {
      throw this.error('unexpected end of input while reading field name');
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
  private skipWhitespace(): void {
    while (this.hasMore() && /\s/.test(this.peek())) {
      this.pos++;
    }
  }

  /**
   * Checks whether input remains.
   *
   * @returns {boolean} `true` when the parser has not reached the end.
   */
  private hasMore(): boolean {
    return this.pos < this.input.length;
  }

  /**
   * Reads the current character without consuming it.
   *
   * @returns {string} The current character.
   */
  private peek(): string {
    return this.input[this.pos] ?? '';
  }

  /**
   * Consumes an expected token.
   *
   * @param {string} ch The expected character to consume.
   * @returns {void}
   */
  private consume(ch: string): void {
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
  private error(details: string): FieldsBadRequestException {
    return new FieldsBadRequestException({
      message: 'Invalid fields query parameter',
      details,
      position: this.pos,
    });
  }
}
