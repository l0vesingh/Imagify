import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // Check for missing details
    if (!userId || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check credit balance
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit balance",
        creditBalance: user.creditBalance,
      });
    }

    // Prepare form data for Clipdrop
    const formData = new FormData();
    formData.append("prompt", prompt);

    // Call Clipdrop API
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    // Convert image to base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct 1 credit
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    // Return response
    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error("Image generation error:", error.response?.data || error.message);
    res.json({ success: false, message: error.message });
  }
};