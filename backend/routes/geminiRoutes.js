const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const SearchHistory = require("../models/searchHistory"); // Import the new model
const router = express.Router();

// Initialize Gemini API (Make sure GEMINI_API_KEY is in your .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or gemini-1.5-pro

router.post("/estimate", async (req, res) => {
  const { prompt, currencyPreference, userId } = req.body; // Get prompt, currency, and userId from frontend

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  // Determine the target currency string for the prompt
  const targetCurrency = currencyPreference === "INR" ? "Indian Rupees (₹)" : "US Dollars ($)";

  try {
    // --- Crucial: Enhanced Prompt Engineering for Cost Estimation, Comparison, and Links ---
    const structuredPrompt = `
      You are an expert AI cost estimator and product/service comparison assistant.
      Your goal is to provide a concise and direct cost estimate for the user's input,
      along with a brief explanation, price comparison from different platforms (if available),
      and potential purchase links.

      **Currency Preference:** Provide estimates in ${targetCurrency}.

      **Required Output Format:**
      Start with "Estimated Cost: [amount] [currency]".
      Then, provide a "Explanation: [brief explanation of factors influencing the cost]".
      If direct links are available on different platform then show in table form,
      first cloumn for item name, second for  price(specific price which is on website),
      third for platfom name, fourth for direct link.
      If comparisons/links are not directly available or relevant, state "No direct platform comparisons or links found."

      **Avoid conversational greetings, apologies, or unrelated information.**
      **Focus only on giving the requested information in the specified format.**

      User Input:
      ${prompt}

      Examples of desired Comparison and Links output (if available):
      - Comparison and Links:
        -Red-tshirt,₹950, Amazon,(Link: https://www.amazon.com/example)
        -Red-tshirt,₹95,000 , Flipkart,(Link: https://www.flipkart.com/example)
        -Red-tshirt,₹960 , Flipkart,(Link: https://www.flipkart.com/example)
        -Red-tshirt,$130,  Official Store, (Link: https://www.manufacturer.com/example)

        for local service if table is not possible simply return the estimation
        -Local Service Provider A: ₹15,000 (Link: [website or contact info])

      If no direct links/comparison, state "No direct platform comparisons or links found."
    `;
    // --- End of Prompt Engineering ---

    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = response.text(); // This is the raw text response from Gemini

    // Store the search history in the database
    if (userId) { // Only store if a user is logged in
      try {
        await SearchHistory.create({
          userId: userId,
          searchQuery: prompt,
          estimationResult: text,
          currencyUsed: currencyPreference,
          productType: req.body.productType, // Add productType for better history display
          formData: req.body.formData, // Store original form data for detail view
        });
      } catch (dbError) {
        console.error("Error saving search history to DB:", dbError);
        // Don't block the response to the user even if DB save fails
      }
    }

    res.json({ estimation: text }); // Send Gemini's response back to the frontend
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    res.status(500).json({ error: "Failed to get cost estimation from AI." });
  }
});

// ... (existing imports and code)

// New route to fetch search history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const history = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(100); // Limit results to a reasonable number for history page

    res.json(history);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ error: "Failed to retrieve search history." });
  }
});

// New route to fetch recent searches (latest 4) for a user
router.get("/recent-searches/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      const recentSearches = await SearchHistory.find({ userId })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(4); // Limit to the latest 4 results

      res.json(recentSearches);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      res.status(500).json({ error: "Failed to retrieve recent searches." });
    }
});


module.exports = router;