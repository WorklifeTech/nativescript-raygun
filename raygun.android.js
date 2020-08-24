var _ = require("lodash");
var utils = require("utils/utils");

var raygun = {}
 
var RaygunClient = com.raygun.raygun4android.RaygunClient;
var RaygunUserInfo = com.raygun.raygun4android.messages.shared.RaygunUserInfo;

raygun.start = function(key) {
  RaygunClient.init(utils.ad.getApplicationContext(), key);
  RaygunClient.enableCrashReporting(true); // param => bool attachDefaultHandler
};

raygun.identify = function(val) {
  if (_.isObject(val)) {
    var user = new RaygunUserInfo(val.identifier);
    user.setFirstName(val.firstName);
    user.setFullName(val.fullName);
    user.setEmail(val.email);
    RaygunClient.setUser(user);
  } else {
    throw new Error("Parameter needs to be an object of user details, see the docs");
  }
};

raygun.send = function(report) {
  if (_.isObject(report)) {
    var throwableMessage = new java.lang.Throwable(report.message);
    RaygunClient.send(throwableMessage);
  } else {
    throw new Error("Parameter needs to be an object with message details");
  }

};

module.exports = raygun;
