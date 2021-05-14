import Ajv from 'ajv';
import { JSONSchema6 } from 'json-schema';
import { betterAjvErrors } from './index';

describe('betterAjvErrors', () => {
  let ajv: Ajv;
  let schema: JSONSchema6;
  let data: Record<string, unknown>;

  beforeEach(() => {
    ajv = new Ajv({ allErrors: true });
    schema = {
      type: 'object',
      required: ['str'],
      properties: {
        str: {
          type: 'string',
        },
        enum: {
          type: 'string',
          enum: ['one', 'two'],
        },
        bounds: {
          type: 'number',
          minimum: 2,
          maximum: 4,
        },
        nested: {
          type: 'object',
          required: ['deepReq'],
          properties: {
            deepReq: {
              type: 'boolean',
            },
            deep: {
              type: 'string',
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    };
  });

  describe('additionalProperties', () => {
    it('should handle additionalProperties=false', () => {
      data = {
        str: 'str',
        foo: 'bar',
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'additionalProperties',
          },
          message: "'foo' property is not expected to be here",
          path: '{base}',
        },
      ]);
    });

    it('should handle additionalProperties=true', () => {
      data = {
        str: 'str',
        foo: 'bar',
      };
      schema.additionalProperties = true;
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([]);
    });

    it('should give suggestions when relevant', () => {
      data = {
        str: 'str',
        bonds: 'bar',
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'additionalProperties',
          },
          message: "'bonds' property is not expected to be here",
          path: '{base}',
          suggestion: "Did you mean property 'bounds'?",
        },
      ]);
    });
  });

  describe('required', () => {
    it('should handle required properties', () => {
      data = {
        nested: {},
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'required',
          },
          message: "{base} must have required property 'str'",
          path: '{base}',
        },
        {
          context: {
            errorType: 'required',
          },
          message: "{base}.nested must have required property 'deepReq'",
          path: '{base}.nested',
        },
      ]);
    });
  });

  describe('type', () => {
    it('should handle type errors', () => {
      data = {
        str: 123,
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'type',
          },
          message: "'str' property type must be string",
          path: '{base}.str',
        },
      ]);
    });
  });

  describe('minimum/maximum', () => {
    it('should handle minimum/maximum errors', () => {
      data = {
        str: 'str',
        bounds: 123,
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'maximum',
          },
          message: "property 'bounds' must be <= 4",
          path: '{base}.bounds',
        },
      ]);
    });
  });

  describe('enum', () => {
    it('should handle enum errors', () => {
      data = {
        str: 'str',
        enum: 'zzzz',
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'enum',
            allowedValues: ['one', 'two'],
          },
          message: "'enum' property must be equal to one of the allowed values",
          path: '{base}.enum',
        },
      ]);
    });

    it('should provide suggestions when relevant', () => {
      data = {
        str: 'str',
        enum: 'pne',
      };
      ajv.validate(schema, data);
      const errors = betterAjvErrors({ data, schema, errors: ajv.errors });
      expect(errors).toEqual([
        {
          context: {
            errorType: 'enum',
            allowedValues: ['one', 'two'],
          },
          message: "'enum' property must be equal to one of the allowed values",
          path: '{base}.enum',
          suggestion: "Did you mean 'one'?",
        },
      ]);
    });
  });
});
