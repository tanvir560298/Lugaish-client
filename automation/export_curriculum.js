import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LEARNING_RESOURCES } from '../src/data/learningResources.js';
import { COURSE_DATA } from '../src/data/courseData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, 'curriculum.json');

const payload = {
  resources: LEARNING_RESOURCES,
  course: COURSE_DATA,
  exportedAt: new Date().toISOString()
};

fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
console.log(`[Export] Curriculum exported successfully to: ${outputPath}`);
