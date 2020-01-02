---
layout: post
title: Hybrid Mobile Setup - Vue + Cordova

feature_img: /img/feature/hybrid-mobile-app-setup-vue-js-apache-cordova.jpg

# feature_img: /img/feature/binary-search-typescript-cover.png
featured: true
date: '2018-02-01 01:38:10'
tags:
- Vue
- Vue.js
- JavaScript
- WebPack
- iOS
- iPhone
- Android
- mobile
- app
- Cordova
- guide
--- 

Learn to setup a Hybrid App Development Platform to create mobile apps using web technologies. Use Vue.js, Apache Cordova and Nightwatch tests to build apps for distribution on Apple and Android app stores.

This includes:

- Cordova + Webpack + Vue.js
- Unit Testing with Jest/Mocha-Karma
- Functional Testing with Nightwatch
- Preview your app in the Web Browser
- Hot/Live Reload your app in the browser when you make changes
- Build to Android/iOS mobile devices

## What is a Hybrid Mobile App?

A “Hybrid Mobile App” is Website running inside of Native application. The Web View portion of the code (all the screens and the code that happens when you click the buttons), is interpreted at run-time. Where as the Native portion of the code (taking pictures with your camera, loading a file, getting a GPS co-ordinate), is compiled to machine code before the app is run.

## Pre-Requisites

- macOS — High Sierra 10.13.2
- Node.js — v9.2.1
- Apache Cordova — 8.0.0
- Vue-CLI — 2.9.2 — `npm install-g vue-cli`

## Starting a Cordova Vue-WebPack Project

Create a new Cordova project.

```cli
cordova create hybrid-base com.f1lt3r.hybridbase  
```

Create the Vue.js-Webpack project.

```cli
vue init webpack hybrid-base
```

You will be asked: `? Target directory exists. Continue?` you should answer “Yes” to this as the directory was created in the previous Cordova step.

[![Screenshot of vue init helper](/img/posts/1_T_kutpIjGfvtwaaErRNmxA.png)](/img/posts/1_T_kutpIjGfvtwaaErRNmxA.png "Screenshot of vue init helper")

> Set your repo up with your own names, and select the tests frameworks you want to use.

## Merge The Cordova + Vue-WebPack Build Processes

Your Cordova `./www` directory should now look like this:

```bash
www  
├── css  
│   └── index.css  
├── img  
│   └── logo.png  
├── index.html  
└── js  
    └── index.js
```

Remove the contents of the Cordova `./www` directory, as we will be building this content with WebPack instead.

We will need to leave the `./www` directory as this is the code that Cordova will bundle onto your mobile device.

```cli
cd hybrid-base  
sudo rm -r www/*  
# Password: ************
```

Open the WebPack config file: `./config/index.js` and update the the following paths:

- Change the `index` and `assestsRoot` paths to point to Cordova’s `./www` directory so that the code for your app is built to `./www/dist` before being packaged into your mobile device.
- Change the `assetsPublicPath` value to be an empty string `''`. This will allow your phone to serve the view via the `file:///` protocol. This is important because you will not be running a web server on your mobile device (usually).

Update your `./config/index.js` file like so:

```js
build: {  
    // Template for index.html  
    index: path.resolve(__dirname, '../www/dist/index.html'), // Paths  
    assetsRoot: path.resolve(__dirname, '../www/dist'),  
    assetsSubDirectory: 'static',  
    assetsPublicPath: '',  
}
```

Open `./config.xml` in your IDE and update Cordova’s WebView entry point.

```html
<content src=”dist/index.html” />
```

Build your app’s distribution package.

```cli
npm run build
```

Which should give you something like the following output:

```bash
> hybrid-base@1.0.0 build /Users/al/repos/hybrid-base  
> node build/build.js  
  
Hash: 0291f32a5e7a7d714987  
Version: webpack 3.10.0  
Time: 6652ms  
                                                  Asset       Size  Chunks             Chunk Names  
               static/js/vendor.5973cf24864eecc78c48.js     111 kB       0  [emitted]  vendor  
                  static/js/app.b22ce679862c47a75225.js    11.6 kB       1  [emitted]  app  
             static/js/manifest.48340d8e7958823ecf19.js    1.48 kB       2  [emitted]  manifest  
    static/css/app.30790115300ab27614ce176899523b62.css  432 bytes       1  [emitted]  app  
static/css/app.30790115300ab27614ce176899523b62.css.map  828 bytes          [emitted]  
           static/js/vendor.5973cf24864eecc78c48.js.map     548 kB       0  [emitted]  vendor  
              static/js/app.b22ce679862c47a75225.js.map    22.2 kB       1  [emitted]  app  
         static/js/manifest.48340d8e7958823ecf19.js.map    7.79 kB       2  [emitted]  manifest  
                                             index.html  509 bytes          [emitted]  
  
  Build complete.  
  
  Tip: built files are meant to be served over an HTTP server.  
  Opening index.html over file:// won't work.
```

Your `./www/dist` directory should now look something like this:

```bash
www  
└── dist  
    ├── index.html  
    └── static  
        ├── css  
        │   ├── app.30790115300ab27614ce176899523b62.css  
        │   └── app.30790115300ab27614ce176899523b62.css.map  
        └── js  
            ├── app.b22ce679862c47a75225.js  
            ├── app.b22ce679862c47a75225.js.map  
            ├── manifest.48340d8e7958823ecf19.js  
            ├── manifest.48340d8e7958823ecf19.js.map  
            ├── vendor.5973cf24864eecc78c48.js  
            └── vendor.5973cf24864eecc78c48.js.map
```

Open the `./www/dist/index.html` file in your browser to check that everything works via the `file:///` protocol.

```cli
open ./www/dist/index.html
```

[![Screenshot of Vue.js app running in browser](/img/posts/1_72AyGjDMGPMJSc6HOzjfmQ.png)](/img/posts/1_72AyGjDMGPMJSc6HOzjfmQ.png "Screenshot of Vue.js app running in browser")

> Take notice of the `file:///` protocol in the browser address bar. We will discuss this in a moment.

Now open the Vue.js `./index.html` file in your IDE and update your `Content-Security-Policy` meta tag to allow local web sockets. You can do this by adding: `connect-src 'self' ws:;`. This will allow WebPack to know when to rebuild and reload your code in the web browser preview. This should happen every time you make a change to your source code.

```html
<meta http-equiv=”Content-Security-Policy” content=”default-src ‘self’ data: gap: [https://ssl.gstatic.com](https://ssl.gstatic.com) ‘unsafe-eval’; style-src ‘self’ ‘unsafe-inline’; media-src \*; img-src ‘self’ data: content:; connect-src ‘self’ ws:;”>
```

Now we can test that `dev` mode works correctly.

```cli
npm run dev
```

Which should give you an output like this:

```bash
> hybrid-base@1.0.0 dev /Users/al/repos/hybrid-base  
> webpack-dev-server --inline --progress --config build/webpack.dev.conf.js  
  
95% emitting  
  
DONE  Compiled successfully in 3486ms

Your application is running here: http://localhost:8080
```

Now the Vue-Webpack hot-reload server is live. You can visit [http://localhost:8080](http://localhost:8080) to see your app running in a browser.

When visiting your app, you should see the following screen:

[![Screenshot of your Vue.js app running the web browser](/img/posts/1_ZmaMnIhQZUTw8MPKULXw2g.png)](/img/posts/1_ZmaMnIhQZUTw8MPKULXw2g.png "Screenshot of your Vue.js app running the web browser")

Notice the web-sockets message in the console log below, and the host and port used the address bar.

## Running on Android

We will now test that everything works on an Android mobile device. Make sure you have plugged one into your computer.

First we build the app...

```cli
cordova platform add android
```

You should see the following output:

```bash
Using cordova-fetch for cordova-android@~7.0.0  
Adding android project...  
Creating Cordova project for the Android platform:  
    Path: platforms/android  
    Package: com.f1lt3r.hybridbase  
    Name: HelloCordova  
    Activity: MainActivity  
    Android target: android-26  
Subproject Path: CordovaLib  
Subproject Path: app  
Android project created with cordova-android@7.0.0  
Android Studio project detected  
Android Studio project detected  
Discovered plugin "cordova-plugin-whitelist" in config.xml. Adding it to the project  
Installing "cordova-plugin-whitelist" for android  
  
This plugin is only applicable for versions of cordova-android greater than 4.0.
If you have a previous platform version, you do *not* need this plugin since the whitelist will be built in.  

Adding cordova-plugin-whitelist to package.json  
Saved plugin info for "cordova-plugin-whitelist" to config.xml  
--save flag or autosave detected  
Saving android@~7.0.0 into config.xml file ...  
Using cordova-fetch for cordova-ios@~4.5.4  
Adding ios project...  
Creating Cordova project for the iOS platform:  
    Path: platforms/ios  
    Package: com.f1lt3r.hybridbase  
    Name: HelloCordova  
iOS project created with cordova-ios@4.5.4  
Installing "cordova-plugin-whitelist" for ios  
--save flag or autosave detected  
Saving ios@~4.5.4 into config.xml file ...
```

Then we run the app.

```cli
cordova run android
```

Your output should look like this:

```bash
Android Studio project detected  
ANDROID_HOME=/Users/al/Library/Android/sdk  
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_77.jdk/Contents/Home  
studio  
Subproject Path: CordovaLib  
Subproject Path: app  
publishNonDefault is deprecated and has no effect anymore. All variants are now published.  
The Task.leftShift(Closure) method has been deprecated and is scheduled to be removed in Gradle 5.0. Please use Task.doLast(Action) instead.  
    at build_90p7k4l5ap2hh6f44vf6y6xe6.run(/Users/al/repos/hybrid-base/platforms/android/app/build.gradle:143)  
:CordovaLib:preBuild UP-TO-DATE  
...  
:app:cdvBuildDebug UP-TO-DATE  
  
BUILD SUCCESSFUL in 0s  
47 actionable tasks: 1 executed, 46 up-to-date  
Built the following apk(s):  
    /Users/al/repos/hybrid-base/platforms/android/app/build/outputs/apk/debug/app-debug.apk  
ANDROID_HOME=/Users/al/Library/Android/sdk  
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_77.jdk/Contents/Home  
No target specified, deploying to device '711KPZK0695877'.  
none  
Skipping build...  
Built the following apk(s):  
    /Users/al/repos/hybrid-base/platforms/android/app/build/outputs/apk/debug/app-debug.apk  
Using apk: /Users/al/repos/hybrid-base/platforms/android/app/build/outputs/apk/debug/app-debug.apk  
Package name: com.f1lt3r.hybridbase  
LAUNCH SUCCESS
```

You should now see the app running on your Android device.

[![Screenshot of your Vue.js + Cordova app running on Android](/img/posts/1_yOa_d1cF_nlFfL63PZfORw.png)](/img/posts/1_yOa_d1cF_nlFfL63PZfORw.png "Screenshot of your Vue.js + Cordova app running on Android")

It lives!

## Running on iOS

Time to check things on an iOS device. Make sure you plugged it in!

First, lets add the the iOS platform to the Cordova project.

```cli
cordova platform add ios
```

Your output should look like this:

```bash
Using cordova-fetch for cordova-ios@~4.5.4  
Adding ios project...  
Creating Cordova project for the iOS platform:  
    Path: platforms/ios  
    Package: com.f1lt3r.hybridbase  
    Name: HelloCordova  
iOS project created with cordova-ios@4.5.4  
Installing "cordova-plugin-whitelist" for ios  
--save flag or autosave detected  
Saving ios@~4.5.4 into config.xml file ...
```

Open your app’s Xcode project.

```cli
open platforms/ios/HelloCordova.xcodeproj
```

Select your Team certificate in the Build Signing dropdown.

[![Screenshot of selecting your Team certificate in Xcode](/img/posts/1_EnRI_duHjXAzNJ5JwPzHPA.jpeg)](/img/posts/1_EnRI_duHjXAzNJ5JwPzHPA.jpeg "Screenshot of selecting your Team certificate in Xcode")

Now build your iOS package.

```cli
cordova build ios
```

Your output should look like this:

```bash
Building project: /Users/al/repos/hybrid-base/platforms/ios/HelloCordova.xcworkspace  
    Configuration: Debug  
    Platform: device  
User defaults from command line:  
    IDEArchivePathOverride = /Users/al/repos/hybrid-base/platforms/ios/HelloCordova.xcarchive  
  
Build settings from command line:  
    CONFIGURATION_BUILD_DIR = /Users/al/repos/hybrid-base/platforms/ios/build/device  
    SHARED_PRECOMPS_DIR = /Users/al/repos/hybrid-base/platforms/ios/build/sharedpch  
  
Build settings from configuration file '/Users/al/repos/hybrid-base/platforms/ios/cordova/build-debug.xcconfig':  
    CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES  
    CODE_SIGN_ENTITLEMENTS = $(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist  
    CODE_SIGN_IDENTITY = iPhone Developer  
    ENABLE_BITCODE = NO  
    GCC_PREPROCESSOR_DEFINITIONS = DEBUG=1  
    HEADER_SEARCH_PATHS = "$(TARGET_BUILD_DIR)/usr/local/lib/include" "$(OBJROOT)/UninstalledProducts/include" "$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include" "$(BUILT_PRODUCTS_DIR)"  
    OTHER_LDFLAGS = -ObjC  
    SWIFT_OBJC_BRIDGING_HEADER = $(PROJECT_DIR)/$(PROJECT_NAME)/Bridging-Header.h  
  
=== BUILD TARGET CordovaLib OF PROJECT CordovaLib WITH CONFIGURATION Debug ===  
  
Check dependencies  
  
Write auxiliary files  
  
...  
  
** ARCHIVE SUCCEEDED **
  
Non-system Ruby in use. This may cause packaging to fail.  
If you use RVM, please run `rvm use system`.  
If you use chruby, please run `chruby system`.  
2018-02-01 16:43:32.249 xcodebuild[82807:848721] [MT] IDEDistribution: -[IDEDistributionLogging _createLoggingBundleAtPath:]: Created bundle at path '/var/folders/kw/5t8w91_n6rb0z8b2z2grsj1r0000gn/T/HelloCordova_2018-02-01_16-43-32.247.xcdistributionlogs'.  
Exported HelloCordova.xcarchive to: /Users/al/repos/hybrid-base/platforms/ios/build/device  
** EXPORT SUCCEEDED **
```

Run the iOS code on your device.

```cli
cordova run ios
```

```bash
Building project: /Users/al/repos/hybrid-base/platforms/ios/HelloCordova.xcworkspace  
    Configuration: Debug  
    Platform: device  
User defaults from command line:  
    IDEArchivePathOverride = /Users/al/repos/hybrid-base/platforms/ios/HelloCordova.xcarchive  
  
Build settings from command line:  
    CONFIGURATION_BUILD_DIR = /Users/al/repos/hybrid-base/platforms/ios/build/device  
    SHARED_PRECOMPS_DIR = /Users/al/repos/hybrid-base/platforms/ios/build/sharedpch  
  
Build settings from configuration file '/Users/al/repos/hybrid-base/platforms/ios/cordova/build-debug.xcconfig':  
    CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES  
    CODE_SIGN_ENTITLEMENTS = $(PROJECT_DIR)/$(PROJECT_NAME)/Entitlements-$(CONFIGURATION).plist  
    CODE_SIGN_IDENTITY = iPhone Developer  
    ENABLE_BITCODE = NO  
    GCC_PREPROCESSOR_DEFINITIONS = DEBUG=1  
    HEADER_SEARCH_PATHS = "$(TARGET_BUILD_DIR)/usr/local/lib/include" "$(OBJROOT)/UninstalledProducts/include" "$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include" "$(BUILT_PRODUCTS_DIR)"  
    OTHER_LDFLAGS = -ObjC  
    SWIFT_OBJC_BRIDGING_HEADER = $(PROJECT_DIR)/$(PROJECT_NAME)/Bridging-Header.h  
  
=== BUILD TARGET CordovaLib OF PROJECT CordovaLib WITH CONFIGURATION Debug ===  
  
Check dependencies  
  
Write auxiliary files  
  
...  
  
(lldb)     connect  
(lldb)     run  
success  
(lldb)     safequit  
Process 1502 detached
```

You should now see the Vue.js app on your iOS device.

[![Screenshot of your Vue.js app running on iOS](/img/posts/1_FuLKnNEm43wRvdsj6mpxdA.png)](/img/posts/1_FuLKnNEm43wRvdsj6mpxdA.png "Screenshot of your Vue.js app running on iOS")

...iOS reporting for duty, sir!

## Testing — Jest and Nightwatch

Finally, we should confirm that theUnit and Functional testing commands work.

First test the Unit tests:

```cli
npm run unit
```

[![Screenshot of unit tests passing in the CLI](/img/posts/1_S77GFyhJE7tmBjCyAHY00Q.png)](/img/posts/1_S77GFyhJE7tmBjCyAHY00Q.png "Screenshot of unit tests passing in the CLI")

Unit tests passing, Ok.

Then test the Functional/End-to-End tests:

```cli
npm run e2e
```

[![Screenshot of unit tests passing in the CLI](/img/posts/1__ZHSNImC-In4gnImtm832w.png)](/img/posts/1__ZHSNImC-In4gnImtm832w.png "Screenshot of unit tests passing in the CLI")

> **Note:** you must have run \`npm run build\` before e2e tests can pass.

## Conclusion

You should now have a hybrid platform that will allow you to develope and distribute mobile apps with Vue.js + Cordova that can be distributed on the Apple and Android app stores.

You can find a repo for this guide here: [https://github.com/F1LT3R/hybrid-base-cordova-vue-webpack](https://github.com/F1LT3R/hybrid-base-cordova-vue-webpack)

That’s all, folks!
