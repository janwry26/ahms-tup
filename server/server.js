const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connectDB");
const app = express();
const PORT = process.env.PORT;
const Inventory = require("./models/Inventory");
const schedule = require('node-schedule')
const nodemailer = require('nodemailer')
const moment = require('moment');

//import routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const animalRoutes = require("./routes/animal");
const inventoryRoutes = require("./routes/inventory");
const taskRoutes = require("./routes/task");
const healthReportRoutes = require("./routes/healthReport");
const reportRoutes = require("./routes/report");
const mortalityReportRoutes = require("./routes/mortalityReport");
const observationReportRoutes = require("./routes/observationReport");
const pushNotificationRoutes = require("./routes/pushNotification");

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

//define routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/animal", animalRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/health-report", healthReportRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/mortality-report", mortalityReportRoutes);
app.use("/api/observation-report", observationReportRoutes);
app.use("/api/push-notification", pushNotificationRoutes);


Inventory.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
.then((items) => {

  var dayOfExpiration = items.filter(data => {
    return moment(new Date()).format('MMMM DD, YYYY') === moment(new Date(data.expDate)).format('MMMM DD, YYYY') 
  })

  var nearExpiration = items.filter(data => {
    const reminderDate = new Date();
    reminderDate.setMonth(reminderDate.getMonth() + 1);
    return moment(new Date(reminderDate)).format('MMMM DD, YYYY') === moment(new Date(data.expDate)).format('MMMM DD, YYYY') 
  })

  var lowStock = items.filter(data => data.quantity < 10)

  if(nearExpiration.length > 0){
    const reminderDate = new Date(nearExpiration[0].expDate);
    
    reminderDate.setMonth(reminderDate.getMonth() - 1);

    const message = {
      from: process.env.EMAIL,
      to: 'boquiren40@gmail.com',
      subject: "Inventory's item near expiration date",
      html: `
      <h1 style="color: #242424; font-size: 2.5rem"> Near expiration date. </h1>
      <p> Dear Zoo Administrator,</p>

      <p> We are writing to bring your attention to a critical matter regarding the expiration date of the items used for the animals in your care.</p>
      
      <p> The expiration date of animal items is a vital consideration to ensure the well-being and safety of the animals. Expired medications may lose their effectiveness or even pose potential risks to the health of the animals. </p>

      <p>Here's are the items near expiration date: </p>
      <ul>
        ${nearExpiration.map(item => `<li>Category: ${item.category}</li>  <li>Item name: ${item.itemName}</li> <li>Item type: ${item.itemType}</li> <li>Expiration date: ${moment(new Date(item.expDate)).format('MMMM DD, YYYY') }</li> <br>`).join('')}
      </ul>
      `       
    }

    schedule.scheduleJob(`${reminderDate.toDateString()} 11:06:00`, () => { 
      transporter.sendMail(message, (err, info) => {
        err ? console.log(err) : console.log("sent")
      });
    })

  }
  
  if(lowStock.length > 0){
    var currentDate = new Date()
    const message = {
      from: process.env.EMAIL,
      to: 'boquiren40@gmail.com',
      subject: "Inventory's item near expiration date",
      html: `
      <h1 style="color: #242424; font-size: 2.5rem">Low Stock Alert</h1>
      <p>Dear Zoo Administrator,</p> <br>
      <p>We are writing to bring your attention to a critical matter regarding the inventory of items used for the animals in your care.</p><br>
      <p>Low stock levels of certain items may impact the well-being and care of the animals. It is essential to take timely action to ensure a sufficient supply is maintained.</p><br>
      <p>Here are the items currently at low stock:</p>
      <ul>
        ${lowStock.map(item => `<li>Category: ${item.category}</li>  <li>Item name: ${item.itemName}</li> <li>Item type: ${item.itemType}</li> <li>Quantity: ${item.quantity}</li> <br>`).join('')}
      </ul>
      `       
    }

    schedule.scheduleJob(`${currentDate.toDateString()} 11:59:40`, () => { 
      transporter.sendMail(message, (err, info) => {
        err ? console.log(err) : console.log("sent")
      });
    })

  }

  console.log(dayOfExpiration)
  
  if(dayOfExpiration.length > 0){
    var currentDate = new Date()
    const message = {
      from: process.env.EMAIL,
      to: 'boquiren40@gmail.com',
      subject: "Inventory's items with Expiration Date Today",
      html: `
      <h1 style="color: #242424; font-size: 2.5rem">Expiration Date Today</h1>
      <p>Dear Zoo Administrator,</p>
      <p>We are writing to bring your attention to a critical matter regarding the expiration date of the items used for the animals in your care.</p>
      <p>The expiration date of animal items is a vital consideration to ensure the well-being and safety of the animals. Expired items may lose their effectiveness or even pose potential risks to the health of the animals.</p>
      <p>Here are the items with an expiration date today:</p>
      <ul>
      ${dayOfExpiration.map(item => `<li>Category: ${item.category}</li>  <li>Item name: ${item.itemName}</li> <li>Item type: ${item.itemType}</li> <li>Expiration date: ${moment(new Date(item.expDate)).format('MMMM DD, YYYY') }</li> <br>`).join('')}
      </ul>
      `
    };

    schedule.scheduleJob(`${currentDate.toDateString()} 12:12:00`, () => { 
      transporter.sendMail(message, (err, info) => {
        err ? console.log(err) : console.log("sent")
      });
    })

  }


})
.catch((err) => console.log("Error: " + err));


app.get("/", (req, res) => {


  res.send("Hello to ahms-server API");
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
