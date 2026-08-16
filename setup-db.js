import { Client, Databases, Permission, Role } from 'node-appwrite';

import 'dotenv/config';

const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_COLLECTION_ID = process.env.VITE_APPWRITE_COLLECTION_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID || !APPWRITE_COLLECTION_ID) {
    console.error("Missing Appwrite environment variables in .env");
    process.exit(1);
}

async function setup() {
    const API_KEY = process.argv[2];
    if (!API_KEY) {
        console.error("Please provide an API Key: node setup-db.js <API_KEY>");
        process.exit(1);
    }

    const client = new Client();
    client
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(API_KEY);

    const databases = new Databases(client);

    try {
        console.log(`Checking if collection ${APPWRITE_COLLECTION_ID} exists...`);
        try {
            await databases.getCollection(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID);
            console.log(`Collection ${APPWRITE_COLLECTION_ID} already exists.`);
        } catch (e) {
            if (e.code === 404) {
                console.log(`Creating collection ${APPWRITE_COLLECTION_ID}...`);
                await databases.createCollection(
                    APPWRITE_DATABASE_ID, 
                    APPWRITE_COLLECTION_ID, 
                    'User Profiles', 
                    [
                        Permission.read(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users())
                    ]
                );
                
                console.log("Creating attributes...");
                // bookmarks: string (JSON string of bookmarked questions)
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'bookmarks', 1000000, false);
                // solved: string (JSON string of solved questions)
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'solved', 1000000, false);
                // theme: string (dark/light)
                await databases.createStringAttribute(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, 'theme', 20, false);

                console.log("Collection created successfully!");
            } else {
                throw e;
            }
        }
    } catch (err) {
        console.error("Error setting up database:", err);
    }
}

setup();
