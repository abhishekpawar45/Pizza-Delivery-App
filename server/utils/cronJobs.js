import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import { sendEmail } from './sendEmail.js';

export const initStockCronJob = () => {
  // दररोज सकाळी किंवा दर तासाला चेक करण्यासाठी:
  cron.schedule('0 * * * *', async () => {
    try {
      const lowStockItems = await Inventory.find({
        $expr: {$lte: ['$stock', '$threshold'] }
      });

      if (lowStockItems.length > 0) {
        const itemsList = lowStockItems
          .map(item => `<li><strong>${item.name}</strong> (${item.category}): Remaining Stock: ${item.stock} (Threshold: ${item.threshold})</li>`)
          .join('');

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: '⚠️️ Alert: Low Stock in Pizza Inventory',
          html: `
            <h2>Low Stock Notification</h2>
            <p>The following items are running below minimum threshold:</p>
            <ul>${itemsList}</ul>
            <p>Please restock immediately from the Admin Dashboard.</p>
          `
        });
        console.log('Low stock alert email sent to admin.');
      }
    } catch (error) {
      console.error('Error running stock cron job:', error);
    }
  });
};