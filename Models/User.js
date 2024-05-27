const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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

const User = mongoose.model("User", userSchema);
module.exports = User;
