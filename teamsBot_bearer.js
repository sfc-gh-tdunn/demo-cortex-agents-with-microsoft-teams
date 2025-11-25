require("dotenv").config({ path: __dirname + "/env/.env.dev" });

const { TeamsActivityHandler, TurnContext } = require("botbuilder");
const CortexChat = require("./cortexChat");
const SnowflakeQueryExecutor = require("./snowflakeQueryExecutor_bearer");

class TeamsBot extends TeamsActivityHandler {
    constructor() {
        super();

        // Load environment variables and pass them to CortexChat
        const bearer = process.env.BEARER;
        const agentUrl = process.env.AGENT_ENDPOINT;

        this.cortexChat = new CortexChat(bearer, agentUrl);

        this.onMessage(async (context, next) => {
            const prompt = TurnContext.removeRecipientMention(context.activity).trim();
            await context.sendActivity("Snowflake Cortex AI is generating a response. Please wait...");
            const response = await this.cortexChat._retrieveResponse(prompt);

            if (response.sql) {
                const executor = new SnowflakeQueryExecutor();
                const df = await executor.runQuery(response.sql);
                await context.sendActivity(`\`\`\`\n${df}\n\`\`\``);
                executor.closeConnection();
            } else {
                await context.sendActivity(response.citations ? `${response.text}\n\r\n\r+Citation: ${response.citations}` : response.text);
            }
            await next();
        });
    }
}

module.exports = TeamsBot;
