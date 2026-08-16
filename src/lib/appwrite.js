import { Client, Account, Databases, ID, Permission, Role } from 'appwrite';

export const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6a8165dd0023d21b0a97';
export const APPWRITE_DATABASE_ID = '6a816af900117d074103';
export const APPWRITE_COLLECTION_ID = 'user_profiles';

const client = new Client();
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Permission, Role };
