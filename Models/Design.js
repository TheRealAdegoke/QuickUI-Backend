const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const designSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  promptHistory: [
    {
      prompt: {
        type: String,
      },
      style: [
        {
          type: String,
        },
      ],
      webDesignImagePreview: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  imageGallery: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Design = mongoose.model("Design", designSchema);
module.exports = Design;
