import { Client, Account } from 'appwrite';
import 'dotenv/config';

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

async function test() {
    try {
        // Note: we don't have user credentials, so we can't fully test it without creating a dummy user.
        // But we can just use dummy credentials to see the error.
        await account.createEmailPasswordSession('test@example.com', 'password123');
    } catch (e) {
        console.error('Session Error:', e.message);
    }
}
test();
