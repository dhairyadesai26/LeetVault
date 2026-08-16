import { Client, Account } from 'appwrite'; // web SDK

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a8165dd0023d21b0a97');

const account = new Account(client);

// Just to log methods
console.log(Object.getOwnPropertyNames(Account.prototype).filter(k => k.toLowerCase().includes('mfa')));
