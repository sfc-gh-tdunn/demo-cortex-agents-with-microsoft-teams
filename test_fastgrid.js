require('dotenv').config({ path: 'env/.env.fastgrid' });
const { exec } = require('child_process');
// const JWTGenerator = require('./jwtGenerator');

// const jwt = new JWTGenerator();
// const jwtToken = jwt.getToken();
const bearerToken = process.env.BEARER;
const headerURL = process.env.AGENT_ENDPOINT;

const curlCmd = `curl -X POST ${headerURL} \
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
          "text": "What is the table of contents for the NEC?"
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