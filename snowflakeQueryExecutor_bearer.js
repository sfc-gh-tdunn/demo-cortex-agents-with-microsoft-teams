const snowflake = require('snowflake-sdk');
var columnify = require('columnify');

class SnowflakeQueryExecutor {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (this.connection) return this.connection;
        this.connection = snowflake.createConnection({
            account: process.env.ACCOUNT,
            authenticator: "OAUTH",
            token: process.env.BEARER,
            warehouse: process.env.WAREHOUSE,
            database: process.env.DEMO_DATABASE,
            schema: process.env.DEMO_SCHEMA
        });
        return new Promise((resolve, reject) => {
            this.connection.connect(err => (err ? reject(err) : resolve(this.connection)));
        });
    }

    executeQuery(sql) {
        return new Promise((resolve, reject) => {
            this.connection.execute({
                sqlText: sql,
                complete: (err, stmt, rows) => (err ? reject(err) : resolve(rows))
            });
        });
    }

    closeConnection() {
        if (this.connection) this.connection.destroy();
    }

    async runQuery(sql) {
        await this.connect();
        const results = await this.executeQuery(sql);
        console.table(results);
        return columnify(results);
    }
}

module.exports = SnowflakeQueryExecutor;
