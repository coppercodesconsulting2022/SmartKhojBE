const multer = require("multer");
const fileConfiguration = require("../common/settings").FileConfiguration;
const moment = require("moment");
const nodemailer = require("nodemailer");
const appLib = require("applib");

const today = moment(new Date()).format(`DD-MM-YYYY_HH-mm-ss`);

const getFileUploadConfig = multer({
  storage: multer.diskStorage({
    destination: fileConfiguration.RFQLocalStorage,
    // function (req, file, cb) {
    // fs.mkdir(fileConfiguration.ImagesStorage, (err) => {
    //   cb(null, fileConfiguration.ImagesStorage);
    // });
    // fs.mkdir(fileConfiguration.RFQLocalStorage, (err) => {
    //   cb(null, fileConfiguration.RFQLocalStorage);
    // });
    // },
    filename: function (_req, file, cb) {
      cb(null, `smartkhoj_${today}_${file.originalname.replace(/ /g, "_")}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    // if (
    //   file.mimetype === "image/png" ||
    //   file.mimetype === "image/PNG" ||
    //   file.mimetype === "image/JPEG" ||
    //   file.mimetype === "image/JPG" ||
    //   file.mimetype === "image/jpg" ||
    //   file.mimetype === "image/jpeg" ||
    //   file.mimetype === "image/bmp"
    // ) {
    cb(null, true);
    // } else {
    //   cb(new Error("Invalid File"), false);
    // }
  },
  // limits: {
  //   fileSize: 2 * 1024 * 1024,
  // },
});

module.exports.notifyUsers = async (
  functionContext,
  resumeDetails,
  vendorDetails
) => {
  const logger = functionContext.logger;

  logger.logInfo(`notifyUsers() invoked!`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EmailId,
      pass: process.env.EmailPassword,
    },
  });

  const resume = JSON.parse(resumeDetails?.Resume);

  console.log("resumeDetails", resume[0]);

  const mailOptions = {
    from: process.env.EmailId,
    to: vendorDetails?.Email,
    subject: "Job Application via Smartkhoj",
    html: `
      <h4>Dear Hiring Team,</h4>
      <br>
      <br>
      <br>
      <p>I hope this message finds you well. I wanted to express my interest in the job opportunity I discovered on Smartkhoj. Enclosed, you will find my CV for your consideration.</p>
      <br>
      <br>
      <p>Thank you for posting this opportunity on Smartkhoj, and I look forward to the possibility of joining your team.</p>
      <br>
      <br>
      <p>Best regards,</p>
      <p>${resumeDetails?.UserName}</p>
      `,
    attachments: [
      {
        // use URL as an attachment
        contentType: "application/pdf",
        filename: "Resume.pdf",
        path: resume[0],
        // disposition: "Attachment",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      logger.logInfo(`notifyUsers() :: Email not sent :: Error :: ${error} !`);
      return error;
    } else {
      console.log(info.response);
      logger.logInfo(
        `notifyUsers() :: Email sent :: Success :: ${info.response} !`
      );
      return info.response;
    }
  });
  // }
};

module.exports.FileUploadConfig = getFileUploadConfig;
