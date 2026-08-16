import { Client, Account } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a8165dd0023d21b0a97'); // LeetVault Project ID

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
