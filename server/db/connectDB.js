const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

// connect to db
mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => console.log("DB Connected..."))
    .catch((err) => console.log(`DB Connection Error : ${err}`));
