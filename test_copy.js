require('dotenv').config({ path: 'env/.env.dev' });
const { exec } = require('child_process');
// const JWTGenerator = require('./jwtGenerator');

// const jwt = new JWTGenerator();
// const jwtToken = jwt.getToken();
const bearerToken = process.env.BEARER;
const url = process.env.AGENT_ENDPOINT;

const curlCmd = `curl -X POST ${url} \
-H "Authorization: Bearer ${bearerToken}" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "How are our employees distributed across locations? What are the performance differences by location?"
        }
      ]
    }
  ],
  "tool_choice": {
    "type": "auto",
    "name": [
    ]
  }
}'`;

exec(curlCmd, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ curl error:', err.message);
    return;
  }
  console.log('✅ Cortex Agents response:\n\n', stdout);
});
