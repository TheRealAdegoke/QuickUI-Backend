const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
      navStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      heroStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      sectionOneStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      sectionTwoStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      sectionThreeStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      sectionFourStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      sectionFiveStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      sectionSixStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      footerStyle: {
        index: {
          type: Number,
        },
        style: {
          type: String,
        },
      },
      webDesignImagePreview: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Design = mongoose.model("Design", designSchema);
module.exports = Design;