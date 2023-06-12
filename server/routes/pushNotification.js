const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const nodemailer = require("nodemailer");
const systemName = "AHMS";

const currentDate = new Date();

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

router.get("/expiry", async (req, res) => {
  const thresholdDate = new Date(currentDate);
  thresholdDate.setMonth(thresholdDate.getMonth() + 1); // Set threshold date to one month ahead
  const formattedThresholdDate = formatDate(thresholdDate); // Format the threshold date as "YYYY-MM-DD"

  try {
    const expiringItems = await Inventory.find({
      expDate: {
        $gt: formatDate(currentDate), // Expiration date is greater than current date
        $lte: formattedThresholdDate, // Expiration date is less than or equal to threshold date
      },
    });

    const formattedItems = expiringItems.map(item => ({
      itemName: item.itemName,
      expDate: item.expDate,
      daysRemaining: calculateDaysRemaining(item.expDate),
    }));

    res.send(formattedItems);
    sendEmail(req.body.email, formattedItems);

  } catch (error) {
    console.error('Error fetching items near expiration:', error);
    res.send([]);
  }
});

function calculateDaysRemaining(expDate) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 for the current date

  const expDateObj = new Date(expDate);
  expDateObj.setHours(0, 0, 0, 0); // Set time to 00:00:00 for the expiration date

  const timeDifference = expDateObj.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

async function sendEmail(submitted_email, items) {

    const itemList = items.map(item => `${item.itemName} (Expiration Date: ${item.expDate}, Days Remaining: ${item.daysRemaining})`).join('\n');
    // let mailOptions = {
    //     from: 'SENDER_EMAIL_ADDRESS',
    //     to: submitted_email,
    //     subject: 'Item Expiration Notification',
    //     text: `Good Day, as of ${currentDate} here is the list of items that are within the > 30 days threshold:\n\n${itemList}`,
    //   };

    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
            user: 'animalhealthcare378@gmail.com',
            pass: 'animalhealthcare',
            },
        });

        let info = await transporter.sendMail({
            from: systemName,
            to: submitted_email,
            subject: 'Push Notification',
            text: `Good Day, as of ${currentDate} here is the list of items that are within the > 30 days threshold:\n\n${itemList}`,
        });

        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


module.exports = router;

// const server = emailjs.server.connect({
//   user: 'YOUR_GMAIL_USERNAME', // Your Gmail email address
//   password: 'YOUR_GMAIL_PASSWORD', // Your Gmail password or app password
//   host: 'smtp.gmail.com',
//   ssl: true,
// });

// const EXPIRATION_THRESHOLD = 30; // Number of days before expiration to send the notification

// async function sendPushNotification() {
//   // Get the list of expired items from your inventory
//   const expiredItems = await getExpiredItems();

//   // Filter items that are expiring within the threshold
//   const expiringItems = expiredItems.filter(item => {
//     const expirationDate = new Date(item.expirationDate);
//     const currentDate = new Date();
//     const daysUntilExpiration = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
//     return daysUntilExpiration <= EXPIRATION_THRESHOLD;
//   });

//   if (expiringItems.length > 0) {
//     const message = {
//       from: 'SENDER_EMAIL_ADDRESS',
//       to: 'RECIPIENT_EMAIL_ADDRESS',
//       subject: 'Item Expiration Notification',
//       text: `The following items in your inventory will expire within ${EXPIRATION_THRESHOLD} days:\n\n${getItemsList(expiringItems)}`,
//     };

//     server.send(message, (err, message) => {
//       if (err) {
//         console.error('Error sending notification:', err);
//       } else {
//         console.log('Notification sent successfully!', message);
//       }
//     });
//   }
// }

// function getExpiredItems() {
//   // Implement logic to fetch the expired items from your inventory
//   // This could involve querying a database or fetching data from an API
//   // Return the list of expired items as an array
// }

// function getItemsList(items) {
//   // Create a formatted string containing the list of items
//   // Customize the format as per your requirements
//   return items.map(item => `${item.name} (Expiration Date: ${item.expirationDate})`).join('\n');
// }

