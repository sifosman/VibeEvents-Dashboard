import { db } from '../server/db';
import { categories } from '../shared/schema';

async function checkCategories() {
  const allCategories = await db.select().from(categories);
  console.log(JSON.stringify(allCategories, null, 2));
}

checkCategories().catch(err => {
  console.error('Error checking categories:', err);
});