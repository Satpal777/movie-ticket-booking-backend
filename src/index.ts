import { createServer } from 'node:http';
import { createApplication } from './app/index.js';
import { env } from './config/env.js';

async function main() {
    try {
        const server = createServer(createApplication());
        const port = env.PORT;

        server.listen(port, () => {
            console.log(`Http server is running on PORT ${port}`);
        });
    } catch (error) {
        console.log(`Error starting http server`);
        throw error;
    }
}

main();