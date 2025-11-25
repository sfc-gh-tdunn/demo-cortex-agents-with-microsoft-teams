require('dotenv').config({ path: 'env/.env.fastgrid' });

const bearerToken = process.env.BEARER;
const headerURL = process.env.AGENT_ENDPOINT; 

const payload = {
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "What is the table of contents for the NEC?"
        }
      ]
    }
  ],
  tool_choice: {
    type: "auto",
    name: []
  }
};

async function callCortexAgent() {
  try {
    const response = await fetch(headerURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    console.log('✅ Cortex Agents streaming response:');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;

      const lines = result.split('\n');
      result = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonString = line.substring(5).trim();
          try {
            if (jsonString.length > 0) {
                const data = JSON.parse(jsonString);
                process.stdout.write(data.text || '');
            }
          } catch (e) {
          }
        }
      }
    }
    console.log('\n--- Stream finished ---');

  } catch (err) {
    console.error('❌ Request error:', err.message);
  }
}

callCortexAgent();