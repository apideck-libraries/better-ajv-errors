# @apideck/better-ajv-errors

> Human-friendly JSON Schema validation for APIs

- Readable and helpful [ajv](https://github.com/ajv-validator/ajv) errors
- API-friendly format
- Suggestions for spelling mistakes
- Minimal footprint: 1.56 kB (gzip + minified)

## Install

```bash
$ yarn add @apideck/better-ajv-errors
```

or

```bash
$ npm i @apideck/better-ajv-errors
```

Also make sure that you've installed the [ajv](https://www.npmjs.com/package/ajv) at version 8 or higher.

## Usage

After validating some data with ajv, pass the errors to `betterAjvErrors`

```ts
import Ajv from 'ajv';
import { betterAjvErrors } from '@apideck/better-ajv-errors';

// Without allErrors: true, ajv will only return the first error
const ajv = new Ajv({ allErrors: true });

const valid = ajv.validate(schema, data);

if (!valid) {
  const output = betterAjvErrors(schema, validate.errors, {
    propertyPath: [],
    targetValue: data,
  });
}
```

## API

### betterAjvErrors

Returns formatted validation error to **print** in `console`. See
[`options.format`](#format) for further details.

#### schema

Type: `Object`

The JSON Schema you used for validation with `ajv`.

#### errors

Type: `Array`

Array of
[ajv validation errors](https://github.com/epoberezkin/ajv#validation-errors)

#### options

Type: `Object`

##### propertyPath

Type: `Array`

Property path of a validated object that is a part of a bigger document. Might
be empty if the validated object equals the whole document.

##### targetValue

Type: `Object`

The JSON payload you validate against using `ajv`.

## Related

- [atlassian/better-ajv-errors](https://github.com/atlassian/better-ajv-errors) was the inspiration for this library. [atlassian/better-ajv-errors](https://github.com/atlassian/better-ajv-errors) is more focused on CLI errors, this library is focused on JSON APIs.
