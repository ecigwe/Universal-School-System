const mongoose = require("mongoose");
const validator = require("validator");

const notificationSchema = mongoose.Schema({
  notificationOwner: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: [true, "Please, provide a name for this notification"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "please, provide an event for this notification"],
  },
  isRead: {
    type: Boolean,
    required: [true, "please , is-read is required"],
  },

  createdOn: {
    type: Date,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
