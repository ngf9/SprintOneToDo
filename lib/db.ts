import { init } from '@instantdb/react';
import schema from '../instant.schema';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || '24bbe2a1-3dd7-4070-83c0-0f10f1abc940';
const db = init({ appId: APP_ID, schema });

export default db;