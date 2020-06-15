const Notification = require("../../models/notification/notification");

class notificationController {
  static async studentRegistrationNotification(req, res, next) {
    try {
      let studentRegistration = new Notification({
        notificationOwnerId: _id,
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
        notificationOwnerId: _id,
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
  static async studentExamNotification(req, res, next) {
    try {
      let studentExam = new Notification({
        notificationOwnerId: _id,
        title: "A student Examination",
        description: "Exam is around the corner",
        isRead: true,
        createdOn: Date(),
      });
      studentExam = await studentExam.save();
      return studentExam;
    } catch (error) {
      return next(error);
    }
  }
  static async studentAssignmentNotification(req, res, next) {
    try {
      let studentAssignment = new Notification({
        notificationOwnerId: _id,
        title: "A studentAssignment Notification",
        description: "Assignment notification",
        isRead: true,
        createdOn: Date(),
      });
      studentAssignment = await studentAssignment.save();
      return studentAssignment;
    } catch (error) {
      return next(error);
    }
  }
  static async studentSchoolFeesNotification(req, res, next) {
    try {
      let studentSchoolFees = new Notification({
        notificationOwnerId: _id,
        title: "A studentSchoolFees Notification",
        description: "Your ward has no paid for tuition",
        isRead: true,
        createdOn: Date(),
      });
      studentSchoolFees = await studentSchoolFees.save();
      return studentSchoolFees;
    } catch (error) {
      return next(error);
    }
  }
  static async schoolEventNotification(req, res, next) {
    try {
      let schoolEvent = new Notification({
        notificationOwnerId: _id,
        title: "A schoolEvent Notification",
        description: "Your ward has a graduation ceremony",
        isRead: true,
        createdOn: Date(),
      });
      schoolEvent = await schoolEvent.save();
      return schoolEvent;
    } catch (error) {
      return next(error);
    }
  }
  static async schoolRegistrationNotification(req, res, next) {
    try {
      let schoolRegistration = new Notification({
        notificationOwnerId: _id,
        title: "A schoolRegistration Notification",
        description: "there is a new school registration",
        isRead: true,
        createdOn: Date(),
      });
      schoolRegistration = await schoolRegistration.save();
      return schoolRegistration;
    } catch (error) {
      return next(error);
    }
  }
  static async schoolUnRegistrationNotification(req, res, next) {
    try {
      let schoolUnRegistration = new Notification({
        notificationOwnerId: _id,
        title: "A schoolUnRegistration Notification",
        description: "there is a new school UnRegistration",
        isRead: true,
        createdOn: Date(),
      });
      schoolUnRegistration = await schoolUnRegistration.save();
      return schoolUnRegistration;
    } catch (error) {
      return next(error);
    }
  }
  static async newUserRegistrationNotification(req, res, next) {
    try {
      let newUserRegistration = new Notification({
        notificationOwnerId: _id,
        title: "A newUserRegistration Notification",
        description: "there is a new user registration",
        isRead: true,
        createdOn: Date(),
      });
      newUserRegistration = await newUserRegistration.save();
      return newUserRegistration;
    } catch (error) {
      return next(error);
    }
  }
  static async newUserUnRegistrationNotification(req, res, next) {
    try {
      let newUserUnRegistration = new Notification({
        notificationOwnerId: _id,
        title: "A newUserUnRegistration Notification",
        description: "there is a new user UnRegistration",
        isRead: true,
        createdOn: Date(),
      });
      newUserUnRegistration = await newUserUnRegistration.save();
      return newUserUnRegistration;
    } catch (error) {
      return next(error);
    }
  }
  static async studentAssignmentSubmitionNotification(req, res, next) {
    try {
      let studentAssignmentSubmition = new Notification({
        notificationOwnerId: _id,
        title: "A studentAssignmentSubmition Notification",
        description: "a student submited assigmment",
        isRead: true,
        createdOn: Date(),
      });
      studentAssignmentSubmition = await studentAssignmentSubmition.save();
      return studentAssignmentSubmition;
    } catch (error) {
      return next(error);
    }
  }
  static async eventNotification(req, res, next) {
    try {
      let eventNotice = new Notification({
        notificationOwnerId: _id,
        title: "A eventNotice Notification",
        description: "a student submited assigmment",
        isRead: true,
        createdOn: Date(),
      });
      eventNotice = await eventNotice.save();
      return eventNotice;
    } catch (error) {
      return next(error);
    }
  }
  static async moneyNotification(req, res, next) {
    try {
      let moneyNotice = new Notification({
        notificationOwnerId: _id,
        title: "A moneyNotice Notification",
        description: "a student submited assigmment",
        isRead: true,
        createdOn: Date(),
      });
      moneyNotice = await moneyNotice.save();
      return moneyNotice;
    } catch (error) {
      return next(error);
    }
  }
  static async personalStudyNotification(req, res, next) {
    try {
      let personalStudy = new Notification({
        notificationOwnerId: _id,
        title: "A personalStudy Notification",
        description: "a student submited assigmment",
        isRead: true,
        createdOn: Date(),
      });
      personalStudy = await personalStudy.save();
      return personalStudy;
    } catch (error) {
      return next(error);
    }
  }
  static async classNotification(req, res, next) {
    try {
      let classNotice = new Notification({
        notificationOwnerId: _id,
        title: "A classNotice Notification",
        description: "a student submited assigmment",
        isRead: true,
        createdOn: Date(),
      });
      classNotice = await classNotice.save();
      return classNotice;
    } catch (error) {
      return next(error);
    }
  }
  static async lectureUploadNotification(req, res, next) {
    try {
      let lectureUploads = new Notification({
        notificationOwnerId: _id,
        title: "A lectureUploads Notification",
        description: "a student submited assigmment",
        isRead: true,
        createdOn: Date(),
      });
      lectureUploads = await lectureUploads.save();
      return lectureUploads;
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = notificationController;
