const Notification = require("../../models/notification/notification");

class notificationController {
  static async studentRegistrationNotification(req, res, next) {
    try {
      let studentRegistration = new Notification({
        notificationOwner: _id,
        title: "A student registration",
        description: "A student just registered",
        isRead: true,
        createdOn: Date(),
      });
      studentRegistration = await studentRegistration.save();
      return studentRegistration;
    } catch (error) {
      return next(error);
    }
  }

  static async studentUnRegistrationNotification(req, res, next) {
    try {
      let studentUnRegistration = new Notification({
        notificationOwner: _id,
        title: "A student Unregistration",
        description: "A student just Unregistered",
        isRead: true,
        createdOn: Date(),
      });
      studentUnRegistration = await studentUnRegistration.save();
      return studentUnRegistration;
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = notificationController;
