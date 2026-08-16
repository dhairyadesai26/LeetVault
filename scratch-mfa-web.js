import { Client, Account } from 'appwrite'; // web SDK
import 'dotenv/config';

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

// Just to log methods
console.log(Object.getOwnPropertyNames(Account.prototype).filter(k => k.toLowerCase().includes('mfa')));
