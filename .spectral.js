const { oas3 } = require("@stoplight/spectral-formats");
const { casing, pattern, truthy } = require("@stoplight/spectral-functions");
const { oas } = require("@stoplight/spectral-rulesets");
const emptyobject = _interopDefault(
  require(__dirname + "/functions/empty-object.js")
);
const operationOrdering = _interopDefault(
  require(__dirname + "/functions/operationOrdering.js")
);
const responses = _interopDefault(
  require(__dirname + "/functions/responses.js")
);
module.exports = {
  extends: [oas],
  rules: {
    "operation-tag-defined": true,
    "operation-success-response": true,
    "oas3-server-trailing-slash": true,
    "path-keys-no-trailing-slash": {
      message: "Path must not end with slash.",
      severity: "error",
      given: "$.paths[*]~",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: ".+\\/$",
        },
      },
    },
    semver: {
      severity: "error",
      recommended: true,
      message:
        "Specs should follow semantic versioning. {{value}} is not a valid version.",
      given: "$.info.version",
      then: {
        function: pattern,
        functionOptions: {
          match: "^([0-9]+.[0-9]+.[0-9]+)$",
        },
      },
    },
    "content-type-application-json-specific": {
      description: "Every request SHOULD support `application/json` media type",
      severity: "error",
      message: "{{description}}",
      given: ["$.paths[*][*][requestBody].content"],
      then: {
        field: "application/json",
        function: truthy,
      },
    },
    "paths-kebab-case": {
      description: "Path Should paths be kebab-case.",
      message:
        "{{property}} should be kebab-case (lower case and separated with hyphens)",
      severity: "error",
      given: "$.paths[*]~",
      then: {
        function: pattern,
        functionOptions: {
          match: "^(/|[a-z-.]+|{[a-z-]+})+$",
        },
      },
    },
    "default-response-fallback": {
      message: "Response object does not have 2xx operation or default set",
      given: "$.paths.[*].[*].responses",
      severity: "error",
      then: {
        function: responses,
      },
    },
    "security-must-be-enforced-for-unsafe-endpoints": {
      message: 'Security must be applied to "write" endpoints',
      severity: "error",
      given:
        "$.paths.*[?(@property == 'post' || @property == 'put' || @property == 'patch' || @property == 'delete')]",
      then: [
        {
          field: "security",
          function: truthy,
        },
      ],
    },
    "security-object-must-not-be-a-hacked-in-empty-object": {
      message: '"security" object MUST NOT be empty',
      severity: "error",
      given: "$.paths.*[post,patch,put,delete].security.*",
      then: {
        function: emptyobject,
      },
    },
    "security-object-must-not-be-empty": {
      message: '"security" object MUST NOT be empty',
      severity: "error",
      given: "$.paths.*[post,patch,put,delete].security",
      then: {
        function: emptyobject,
      },
    },
    "request-GET-no-body": {
      message: "GET operations cannot have a requestBody.",
      description: "A `GET` request MUST NOT accept a `body` parameter",
      severity: "error",
      given: "$.paths..get.requestBody",
      then: [
        {
          field: "requestBody",
          function: truthy,
        },
      ],
    },
    "query-parameter-snake-case": {
      description: "Query parameters should be snake case",
      severity: "error",
      given: "$..parameters.[?(@.in === 'query')].name",
      then: {
        function: casing,
        functionOptions: {
          type: "snake",
        },
      },
    },
    "oas3-protocol-https-only": {
      description: "ALL requests MUST go through `https` protocol only",
      severity: "error",
      message: "Servers MUST be https and no other protocol is allowed.",
      given: "$.servers..url",
      then: {
        function: pattern,
        functionOptions: {
          match: "/^https:/",
        },
      },
    },
    "field-name-snake-case": {
      description: "Field name should be snake case",
      severity: "warn",
      message: '"{{property}}" is not snake_case: {{error}}',
      given: "$.components..properties[*]~",
      then: {
        function: casing,
        functionOptions: {
          type: "snake",
        },
      },
    },
    "content-entry-provided": {
      description:
        "Request bodies and non-204 responses should define a content object",
      given: [
        "$.paths[*][*].responses[?(@property != '204')]",
        "$.paths[*][*].requestBody",
      ],
      severity: "warn",
      formats: [oas3],
      resolved: true,
      then: {
        field: "content",
        function: truthy,
      },
    },
    "endpoint-verb-order": {
      severity: "error",
      given: "$.paths[?(@.get || @.post || @.patch || @.put || @.delete)]",
      then: {
        function: operationOrdering,
      },
    },
    "operationid-must-be-kebab-cased": {
      description:
        "operationIds must be kebab cased and lowercase (e.g. kebab-case)",
      type: "style",
      given: "$..operationId",
      severity: "error",
      message: "{{description}}; {{value}} incorrect",
      then: {
        function: casing,
        functionOptions: {
          type: "kebab",
        },
      },
    },
  },
};
function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}
