import express from "express";
const router = express.Router();
import Thread from "../models/threads.js";
import openAIAPIResponse from "../utils/openai.js";

//test
// router.post("/test", async (req, res) => {
//   try {
//     const thread = new Thread({
//       threadId: "2 sd",
//       title: "test",
//     });
//     const response = await thread.save();
//     res.send(response);
//     console.log(response);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ error: "Failed to save in database" });
//   }
// });

//get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    //threads should be sorted in descending order of Updated at
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads " });
  }
});

//get specefic thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ error: "thread is not found" });
    }
    res.json(thread.messages);
  } catch (e) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads " });
  }
});

//delete thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      res.status(404).json({ error: "thread is not found" });
    }
    res.status(200).json({ success: "Thread deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not delete" });
  }
});

//chat with assistant
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  //
  if (!threadId || !message) {
    return res.status(400).json({ error: "No chat available" });
  }

  //
  try {
    let thread = await Thread.findOne({ threadId });
    //
    if (!thread) {
      thread = new Thread({
        threadId,
        messages: [{ role: "user", content: message }],
        title: message,
      });
      //
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const assistantReply = await openAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
