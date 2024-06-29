const path = require("path");
const express = require("express");
const { app, server } = require("./socket/socket");


require("dotenv").config();

// const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser")

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const dbConnect = require("./config/dbConnect");

// middlewaress
app.use(express.json());
app.use(cookieParser());

// dbconnect
dbConnect();


// routes...
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);


// path 
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res)  => {
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// })


server.listen(PORT, () => {
  console.log(`app is running at ${PORT}`);
});


// const path = require("path");
// const express = require("express");
// const { app, server } = require("./socket/socket");

// const __dirname = path.resolve();


// require("dotenv").config();

// const PORT = process.env.PORT || 5000;

// const cookieParser = require("cookie-parser");

// const userRoutes = require("./routes/userRoutes");
// const messageRoutes = require("./routes/messageRoutes");

// const dbConnect = require("./config/dbConnect");

// // middlewares
// app.use(express.json());
// app.use(cookieParser());

// // dbconnect
// dbConnect();

// // routes...
// app.use("/api/auth", userRoutes);
// app.use("/api/messages", messageRoutes);

// // serve static files
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

// server.listen(PORT, () => {
//     console.log(`App is running at ${PORT}`);
// });
