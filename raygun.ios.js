var _ = require("lodash");

var raygun = {}

raygun.start = function(key) {
  var raygunClient = RaygunClient.sharedInstanceWithApiKey(key);
  raygunClient.enableCrashReporting()
};

raygun.identify = function(user) {
  this._checkIfRunning();

  if (_.isObject(user)) {
    var userInfo = RaygunUserInformation.alloc().initWithIdentifierWithEmailWithFullNameWithFirstName(user.identifier, user.email, user.fullName, user.firstName);
    this._getReporter().userInformation = userInfo;
  }
}

raygun.send = function(report) {
  this._checkIfRunning();

  if (_.isObject(report)) {
    var occurredOn = report.occurredOn;
    var details = this._createRaygunMessageDetails(report);
    var raygunMessage = RaygunMessage.alloc().initWithTimestampWithDetails(occurredOn, details);
    this._getReporter().sendMessage(raygunMessage);
  } else {
    throw new Error("Parameter needs to be an object with report details");
  }
};

raygun._checkIfRunning = function() {
  if (this._isRunning() === false) {
    throw new Error("The Raygun service is not running");
  }
};

raygun._isRunning = function() {
  return this._getReporter() !== null;
};

raygun._getReporter = function() {
  return RaygunClient.sharedInstance();
};

raygun._createRaygunMessageDetails = function(report) {
  var details = RaygunMessageDetails.alloc().init();

  details.user = this._getReporter().userInformation;
  details.machineName = report.machineName;
  details.version = report.version;
  details.environment = this._createRaygunEnvironmentMessage(report.environment);
  details.error = RaygunErrorMessage.alloc().initWithMessageWithSignalNameWithSignalCodeWithStackTrace(report.className, report.message, null, null, null);

  return details;
};

raygun._createRaygunEnvironmentMessage = function(environment) {
  var environmentMessage = RaygunEnvironmentMessage.alloc().init();

  environmentMessage.oSVersion = environment.oSVersion;
  environmentMessage.model = environment.model;
  environmentMessage.windowsBoundWidth = environment.windowsBoundWidth;
  environmentMessage.windowsBoundHeight = environment.windowsBoundHeight;
  environmentMessage.resolutionScale = environment.resolutionScale;

  return environmentMessage;
};

module.exports = raygun;
