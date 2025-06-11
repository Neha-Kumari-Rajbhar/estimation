// backend/models/SearchHistory.js
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  estimationResult: {
    type: String, // Store the raw text from Gemini
    required: true,
  },
  currencyUsed: {
    type: String, // e.g., "INR", "USD"
    required: true,
  },
  productType: {
    type: String, // e.g., "ExactMakeModel", "RelevantSpecifications", "BasicRequirements"
    required: true,
  },
  formData: { // Store the actual form fields submitted
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);