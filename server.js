import express from "express";
import "dotenv/config";
import cors from "cors";
import { Content } from "openai/resources/containers/files/content.js";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api", chatRoutes);

app.get("/test", async (req, res) => {
  res.json({ msg: "test was successful yyyyyy" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("Database connected");
    });
  } catch (e) {
    console.log("Failed to connect to database");
  }
};

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     }),
//   };
//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options,
//     );

//     const data = await response.json();
//     // console.log(data);
//     res.send(data.choices[0].message.content);
//   } catch (err) {
//     console.log(err);
//   }
// });
