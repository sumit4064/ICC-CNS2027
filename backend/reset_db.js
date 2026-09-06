import fs from 'fs';
import path from 'path';
import { getInitialData } from './config/db.js';

const dbPath = 'd:/Agentic Ai/ICC/backend/data/db.json';
const data = getInitialData();
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Database updated with 2027 Vignan University seed.');
