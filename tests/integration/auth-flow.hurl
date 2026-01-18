# Usage: hurl --variable base_url=http://localhost:3000 --variable email=test_$(date +%s)@example.com tests/integration/auth-flow.hurl
# Note: "SignIn" creates a new user. If the user already exists, this step will fail. 
# Use a unique email or clear the DB for repeated runs.

# 1. Sign In (Create Account)
POST {{base_url}}/auth/signin
{
  "mail": "{{email}}",
  "password": "password123"
}
HTTP 201
[Asserts]
header "Set-Cookie" exists
jsonpath "$.mail" == "{{email}}"
# jsonpath "$.role" == "USER"

# 2. Create Magic Link
# Hurl automatically handles the session cookie received in the previous step
POST {{base_url}}/auth/magic-link
HTTP 201
[Asserts]
jsonpath "$.link" exists
jsonpath "$.link" isString
