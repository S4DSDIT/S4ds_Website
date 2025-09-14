import { Client, Account, Databases, Storage } from "https://esm.run/appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = '68beb6a800314061b0de';
export const EVENTS_COLLECTION_ID = 'events';
export const GALLERY_COLLECTION_ID = 'gallery';
export const TEAM_COLLECTION_ID = 'team';
export const SPONSORS_COLLECTION_ID = 'sponsors';
export const BUCKET_ID = '68bec163001ac135f323';
export const CONTACT_MESSAGES_COLLECTION_ID = 'contact_messages';