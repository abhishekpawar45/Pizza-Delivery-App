import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import { sendEmail } from '../utils/sendEmail.js';

export const initStockCronJob = () => {
  // दर तासाला रन होईल ('0 * * * *')
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('--- Running Automated Inventory Stock Check ---');
      const lowStockItems = await Inventory.find({ stock: { $lt: 20 } });

      if (lowStockItems.length > 0) {
        const itemsList = lowStockItems
          .map((item) => `<li><b>${item.name}</b> (${item.category}): ${item.stock} left</li>`)
          .join('');

        await sendEmail({
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: '⚠️ Stock Alert: Low Inventory Items (< 20 units)',
          html: `
            <h2>Low Stock Notification</h2>
            <p>The following pizza ingredients are below the threshold of 20 units:</p>
            <ul>${itemsList}</ul>
            <p>Please update inventory stock from the Admin Panel.</p>
          `
        });
        console.log('Low stock alert email successfully sent to Admin!');
      }
    } catch (error) {
      console.error('Cron stock check error:', error.message);
    }
  });
};