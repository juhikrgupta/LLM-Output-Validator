# Reflection

## Hardest Schemas to Enforce

The most difficult schemas to enforce reliably are deeply nested objects and complex arrays because LLMs often generate inconsistent structures, incorrect field names, or wrong data types.

## Failure Handling Strategy

Every LLM response is validated against a predefined Zod schema. If validation fails, the system automatically generates a correction prompt containing the validation error and retries the request up to three times.

If all attempts fail, the system returns a structured error response and logs the failure for future analysis.

## What Happens When the LLM Cannot Produce Valid Output

The application never accepts invalid responses as valid. After the maximum retry limit is reached, the response is rejected and detailed validation errors are returned to the user.

This ensures that downstream applications only receive schema-compliant data.

## Challenges Faced

* Handling malformed JSON responses
* Cleaning markdown-wrapped JSON outputs
* Designing effective correction prompts
* Managing retry logic without introducing infinite loops
* Maintaining structured validation across multiple schema types

## Future Improvements

* Dynamic schema registration API
* Native function/tool calling support
* Token usage analytics
* Streaming response validation
* Automatic schema inference from example outputs

## Key Learning

This project demonstrated how validation middleware can significantly improve the reliability of LLM-powered applications by enforcing strict output contracts and preventing malformed responses from reaching production systems.
