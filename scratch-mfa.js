import { Client, Account } from 'node-appwrite';
import 'dotenv/config';

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

async function testMfa() {
    try {
        console.log('Testing MFA API support in node-appwrite...');
        console.log('Methods:', Object.keys(account).filter(k => k.toLowerCase().includes('mfa')));
    } catch (e) {
        console.error(e);
    }
}
testMfa();
