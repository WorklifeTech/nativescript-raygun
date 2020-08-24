# nativescript-raygun

**nativescript-raygun** is a plugin for NativeScript which adds support for error reporting with [Raygun](https://raygun.io/). The plugin uses the native Raygun SDKs for iOS and Android.


## Installation

```bash
npm install https://github.com/WorklifeTech/nativescript-raygun.git --save
```

## Usage

Firstly, you need to create Raygun application for your iOS and Android app. You'll get the API key.

Somewhere central in your app (such as `app.js`), you need to start the Raygun error reporting.

```js
import raygun from 'nativescript-raygun';

raygun.start("your-key-here");
```

In case you want to create separate Raygun applications for your iOS and Android apps. You'll get a separate API key for each.

```js
import { isIOS } from 'tns-core-modules/platform';
import raygun from 'nativescript-raygun';

raygun.start(isIOS ? "your-ios-key-here" : "your-android-key-here");
```

And that's it! If your app crashes, the error will be sent to Raygun (see notes below).

If you have users that log into your app, you will want to identify them with Raygun so errors they encounter will be tracked against that user. After starting Raygun error reporting, or when the user logs into your app, identify them:

```js
raygun.identify({
  identifier: user.id.toString(), // identifier must be a string
  email: user.email,
  fullName: user.first_name + " " + user.last_name,
  firstName: user.first_name
});
```

Sending message manually

If you need to send error or exception messages manualy after starting Raygun error reporting.

```js
import * as platformModule from 'tns-core-modules/platform';

raygun.send({
  occurredOn: new Date().toISOString(),
  message: 'Your error message.',
  machineName: platformModule.device.deviceType,
  version: 'Your app version (1.0)',
  className: 'Your error class name.',
  environment: {
    oSVersion: platformModule.device.osVersion,
    model: platformModule.device.model,
    windowsBoundWidth: platformModule.screen.mainScreen.widthDIPs,
    windowsBoundHeight: platformModule.screen.mainScreen.heightDIPs,
    resolutionScale: platformModule.screen.mainScreen.scale
  }
});

```

## Notes

When testing that error reporting is working correctly, note that for iOS, errors will not be submitted until the app is next opened by the user. Also note that errors will not be submitted when the app is hooked up to the Xcode debugger.

To test error reporting is working on iOS, you should run the app on a simulator, hit the stop button in Xcode, start the app in the simulator (which is no longer hooked up to the Xcode debugger) and cause a crash. Open the app, and the crash report will be sent to Raygun.

Android crashes will be submitted immediately.


## Dependencies

[Raygun4Apple](http://cocoapods.org/pods/raygun4apple)

[Raygun4Android](https://github.com/MindscapeHQ/raygun4android)
