import { Client, Account } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a8165dd0023d21b0a97');

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
