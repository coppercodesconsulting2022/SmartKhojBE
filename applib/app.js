var logger = require("./logger").LoggerModel;
var uuid = require("node-uuid");
var constant = require("./constant");
var FCM = require("fcm-node");
var axios = require("axios");
const admin = require("firebase-admin");

function UUID() {}

UUID.prototype.GetTimeBasedID = () => {
  return uuid.v1({
    node: [
      0x01, 0x08, 0x12, 0x18, 0x23, 0x30, 0x38, 0x45, 0x50, 0x55, 0x62, 0x67,
      0x89, 0xab,
    ],
    clockseq: 0x1234,
  });
};


const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.SendHttpResponse = function (functionContext, response) {
  let httpResponseType = constant.ErrorCode.Success;
  functionContext.res.writeHead(httpResponseType, {
    "Content-Type": "application/json",
  });
  functionContext.responseText = JSON.stringify(response);
  functionContext.res.end(functionContext.responseText);
};

module.exports.fetchDBSettings = async function (
  logger,
  settings,
  databaseModule
) {
  try {
    logger.logInfo("fetchDBSettings()");
    let rows = await databaseModule.knex.raw(`CALL usp_get_app_settings`);
    var dbSettingsValue = rows[0][0];
    settings.APP_KEY = getValue(dbSettingsValue, "APP_KEY");
    settings.APP_SECRET = getValue(dbSettingsValue, "APP_SECRET");
    return;
  } catch (errGetSettingsFromDB) {
    throw errGetSettingsFromDB;
  }
};

function getValue(requestArray, key) {
  var requestArrayLength = requestArray ? requestArray.length : 0;
  for (
    var requestArrayCount = 0;
    requestArrayCount < requestArrayLength;
    requestArrayCount++
  ) {
    if (
      requestArray[requestArrayCount].key.toLowerCase() === key.toLowerCase()
    ) {
      return requestArray[requestArrayCount].value;
    }
  }
  return null;
}

module.exports.SendPushNotification = async function (
  logger,
  pushNotificationData,
  deviceToken,
  cred
) {
  // console.log("CRED==>", cred);
  return new Promise(async function (resolve, reject) {
    logger.logInfo(
      `SendPushNotification() Invoked for the User : ${JSON.stringify(
        pushNotificationData
      )}`
    );
    try {
      // var requestJSON = {
      //   to: deviceToken,
      //   Payload: {
      //     body: pushNotificationData.body,
      //     title: pushNotificationData.title,
      //     UserId: pushNotificationData.UserId,
      //     VendorId: pushNotificationData.VendorId,
      //     NotificationRef: pushNotificationData.NotificationRef,
      //     image: pushNotificationData.image,
      //   },
      // };
      // var headerJSON = {
      //   "Authorization ": "key=" + cred,
      //   "Content-Type": "application/json",
      // };
      // var options = {
      //   url: "https://fcm.googleapis.com/fcm/send",
      //   method: "POST",
      //   headers: headerJSON,
      //   json: requestJSON,
      // };

      // console.log("OPTIONS", options);

      // try {
      //   console.log("inside axios try");
      //   await axios.post(options.url, options.json, {
      //     headers: options.headers,
      //   });

      //   logger.logInfo(`Notification sent`);
      //   // .then((res) => {
      //   //   console.log("RES AXIOS THEN", res);
      //   // });
      // } catch (err) {
      //   console.log("inside axios catch");
      //   resolve(err);
      // }

      // resolve(constant.ErrorMessage.Success);
      //resolve(notifResult.config.data);
      // var fcm = new FCM(cred);

      // var message = {
      //   //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      //   to: deviceToken,
      //   notification: {
      //     body: pushNotificationData.body,
      //     title: pushNotificationData.title,
      //     UserId: pushNotificationData.UserId,
      //     VendorId: pushNotificationData.VendorId,
      //     NotificationRef: pushNotificationData.NotificationRef,
      //     image: pushNotificationData.image,
      //   },
      // };
      const message = {
        notification: {
          title: pushNotificationData.title,
          body: pushNotificationData.body,
        },
        data: {
         // UserId: pushNotificationData.UserId,
          VendorId: pushNotificationData.VendorId,
          NotificationRef: pushNotificationData.NotificationRef,
          image: pushNotificationData.image.Image,
        },
      };
const tokensArray = Array.isArray(deviceToken) ? deviceToken : [deviceToken];
console.log('tokens',tokensArray );
 const multicastMessage = {
        tokens: tokensArray, // array of device tokens
        ...message,
      };
 
      // try {
      //   await fcm.send(message, function (err, response) {
      //     if (err) {
      //       console.log("ERR 1", err);
      //       logger.logInfo("FCM Send():: Something has gone wrong!", err);
      //       resolve(constant.ErrorMessage.ApplicationError);
      //     } else {
      //       console.log("response", response);
      //       logger.logInfo("FCM Send():: sent with response: ", response);
      //       resolve(constant.ErrorMessage.Success);
      //     }
      //   });
      // } catch (err) {
      //   console.log("ERROR in sending notification", err);
      //   logger.logInfo("ERROR in sending notification :: ", err);
      // }
console.log('multicastMessage',multicastMessage);
      const response = await admin.messaging().sendEachForMulticast(multicastMessage);
	 console.log('response ',response.responses );
      if (response.failureCount > 0) {
        response.results.forEach((result, index) => {
          if (result.error) {
            console.log(`Error sending to device ${deviceToken}:`, result.error);
            logger.logInfo(
              `Error sending notification to device ${deviceToken}: ${result.error.message}`
            );
          } else {
            logger.logInfo(`Notification sent successfully to device ${deviceToken}`);
          }
        });
        resolve("Some notifications failed to send.");
      } else {
        logger.logInfo(`Notification sent successfully to device ${deviceToken}`);
        resolve("Notification sent successfully.");
      }
    } catch (err) {
      logger.logInfo(
        `Global Catch-err :: Error String :: ${JSON.stringify(err)}`
      );
      resolve(constant.ErrorMessage.ApplicationError);
    }
  });
};

module.exports.Logger = logger;
module.exports.UUID = UUID;
