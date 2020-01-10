---
layout: post
title:  AWS SNS Push Notify with Cordova
permalink: aws-sns-push-notifications-with-apache-cordova-android-ios
feature_img: /img/feature/sns-push-notifications-with-apache-cordova.feature.jpg
date: '2018-01-24 11:00:00'
featured: false
category:
- guide
tags:
- SNS
- Notifications
- Push
- Cordova
- Amazon
- AWS
- Mobile
- JavaScript
- Apache
- Setup
---

This guide walks you though creating a [Cordova](https://cordova.apache.org/) app for Push Notifications on iOS and Android. We will use the Apache Cordova platform and the [Amazon SNS](https://aws.amazon.com/sns/) service to build and test our Push Notifications.

The guide is split into four main sections:

1. [Overview](#overview)
2. [Base Steps](#base-steps)
3. [iOS APNS Guide](#ios-apns-guide)
4. [Android GCM or FCM Guide](#android-gcm-or-fcm-guide)

## Overview

There is a lot to learn about Push Notifications, but the intention here is to get you up and running with a proof of concept.

In this guide you will learn how to:

- Create a sample Cordova app with the phonegap-push-plugin
- Obtain a device registrationId (also known as a Device Token) from the Sample App that can used to send you Push Notifications across the network.
- Create APNS and GCM certificates for your app
- Push APNS and GCM notifications to your app via the Amazon SNS console.

You will need:

- MacOS High Sierra — ^10.13.1
- Homebrew — 1.4.0
- Node.js — v9.2.1
- NPM — 5.5.1
- Xcode — 9.2 (9C40b)
- Git — 2.13.1
- Cordova — 7.0.1
- Gradle — 4.4

### Useful Terminology

- APNS — Apple Push Notification Service
- GCM — Google Cloud Messaging
- FCM — Firebase Cloud Messaging (GCM is now replaced/included in FCM)
- SNS — Amazon Simple Notification Service (Not to be confused with SMS)

### Amazon Guides

Amazon provides the following guides setup guides for APNS and GCM. I found some of the information in these to be out of date, or too hairy for a JavaScript developer who can not bring himself to install Eclipse.

- [APNS (iOS)](https://docs.aws.amazon.com/sns/latest/dg/mobile-push-apns.html)
- [GCM (Android)](https://docs.aws.amazon.com/sns/latest/dg/mobile-push-gcm.html)

The steps you are about to read, are split into three sections:

## Base Steps

Create your app with the Cordova CLI tool.

```cli-wrap
cordova create cordova-remote-push-notifications org.apache.cordova.RemotePushNotificationsApp RemotePushNotificationsApp
```

Change to the directory that was created by the Cordova CLI tool.

```cli
cd cordova-remote-push-notifications
```

Install android Android and iOS platforms.

> **Note:** `android@latest` is not currently compatible with `code-push@latest` (2017–12–12), so we will need to set the android platform version to `6.3.0`.

```cli
cordova platform add android@6.3.0
cordova platform add ios@latest
```

Install CocoaPods Xcode Package Manager if you do not already have this installed.

```cli
sudo gem install cocoapods
```

Setup the Cocoapod `master` repo.

```cli
pod setup
```

Install the Cocoapod depencies in the iOS platform directory.

```cli
cd platforms/ios/
pod install
```

Install `Phonegap-Plugin-Push`.

```cli
cordova plugin add phonegap-plugin-push
```

Add the following code to `www/js/index.js` the `onDeviceReady()` callback:

```js
onDeviceReady: function() {
    this.receivedEvent('deviceready');

    var push = PushNotification.init({
        android: {},
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', function (data) {
        console.dir(data)
        alert('Event=registration, registrationId=' + data.registrationId)
    });

    push.on('notification', function (data) {
        console.log(data)
        alert('Event=notification, message=' + data.message)
    });

    push.on('error', function (err) {
        console.log(err)
        alert('Event=error, message=' + err.message)
    });
},
```

## iOS APNS Guide

Use the terminal to open the workspace in Xcode.

```cli-wrap
open -a Xcode platforms/ios/RemotePushNotificationsApp.xcworkspace
```

> ### 🤔 Choice
>  
> You will be prompted to select:  
>  
> 1. The correct certificate.
> 2. The device you want to push the build to.

While you are in Xcode, Toggle on "Push Notifications".

[![While you are in Xcode, Toggle on "Push Notifications".](/img/posts/1_1n_DM_lvZx4bft4yHfOYpw.jpeg)](/img/posts/1_1n_DM_lvZx4bft4yHfOYpw.jpeg "While you are in Xcode, Toggle on "Push Notifications".")

Build and run your App.

```cli
cordova build ios
cordova run ios
```

> While the app is running on your iOS device, get the `registrationId` logged in the Safari Developer Console. Save this `registrationId` somewhere, you will need to send messages to the device via the Amazon SNS console.

[![Screenshot of Safari developer console with the Registration Id](/img/posts/1_J295qcQd2B_Pd3G5CVTEtA.jpeg)](/img/posts/1_J295qcQd2B_Pd3G5CVTEtA.jpeg "Screenshot of Safari developer console with the Registration Id")

### Create APNS Certificates and Keys

Open the Apple Developer console in your web browser and select Certificates, IDs & Profiles.

[![Open the Apple Developer console in your web browser and select Certificates, IDs & Profiles.](/img/posts/1_qUe1gcRwbz7GyJwbVTzdyw.jpeg)](/img/posts/1_qUe1gcRwbz7GyJwbVTzdyw.jpeg "Open the Apple Developer console in your web browser and select Certificates, IDs & Profiles.")

Click the Add button to add a new certificate.

[![Click the Add button to add a new certificate.](/img/posts/1_slubhJ2p1PyghIPYBjtEVg.jpeg)](/img/posts/1_slubhJ2p1PyghIPYBjtEVg.jpeg "Click the Add button to add a new certificate.")

For testing purposes, select the Development certificate “Apple Push Notification service SSL (Sandbox)” and click the Continue button.

[![For testing purposes, select the Development certificate “Apple Push Notification service SSL (Sandbox)” and click the Continue button.](/img/posts/1_lopVhw1ESZmB2nptSjspew.jpeg)](/img/posts/1_lopVhw1ESZmB2nptSjspew.jpeg "For testing purposes, select the Development certificate “Apple Push Notification service SSL (Sandbox)” and click the Continue button.")

Select the app id from the drop-down list.

> This app id is generated by Xcode when you sign the build with the your developer account credentials.

[![Select the app id from the drop-down list.](/img/posts/1_kjbtjfUutaDl_f095_iv_A.jpeg)](/img/posts/1_kjbtjfUutaDl_f095_iv_A.jpeg "Select the app id from the drop-down list.")

Click the Continue button on the next screen.

### Obtain an APNS SSL Certificate

Open Keychain Access on your MacBook and select:

`Keychain Access` > `Certificate Assistant` > `Request a Certificate from a Certificate Authority`

[![Select Request a Certificate from a Certificate Authority](/img/posts/1_0-bB-q6IrnJG0t1Q5GpYyg.jpeg)](/img/posts/1_0-bB-q6IrnJG0t1Q5GpYyg.jpeg "Select Request a Certificate from a Certificate Authority")

After clicking the “Continue” button, fill out the Certificate form, press Continue.

[![After clicking the “Continue” button, fill out the Certificate form, press Continue.](/img/posts/1_nh5rofRqiL3r47lkPMIHpw.jpeg)](/img/posts/1_nh5rofRqiL3r47lkPMIHpw.jpeg "After clicking the “Continue” button, fill out the Certificate form, press Continue.")

When the cert is ready, save it to your Desktop and click the Done button on the next screen.

[![When the cert is ready, save it to your Desktop and click the Done button on the next screen.](/img/posts/1_MBDOhyEsBB9HeL74qaggHw.jpeg)](/img/posts/1_MBDOhyEsBB9HeL74qaggHw.jpeg "When the cert is ready, save it to your Desktop and click the Done button on the next screen.")

Choose the cert file from your desktop in the Apple Developer Portal.

[![Choose the cert file from your desktop in the Apple Developer Portal.](/img/posts/1_GfrT1tt4TUaBcEjT4ir6qA.jpeg)](/img/posts/1_GfrT1tt4TUaBcEjT4ir6qA.jpeg "Choose the cert file from your desktop in the Apple Developer Portal.")

Your cert file should contain a Base 64 certificate request key.

[![Your cert file should contain a Base 64 certificate request key.](/img/posts/1_BNiBXWIoOkd5pfFa3xGm8A.jpeg)](/img/posts/1_BNiBXWIoOkd5pfFa3xGm8A.jpeg "Your cert file should contain a Base 64 certificate request key.")

Click the Continue button to upload your cert to Apple.

[![Click the Continue button to upload your cert to Apple.](/img/posts/1_jsESVXMBgzTroou526pa0A.jpeg)](/img/posts/1_jsESVXMBgzTroou526pa0A.jpeg "Click the Continue button to upload your cert to Apple.")

In less than a minute the Apple Developer Portal should show you a download link for your Apple Push Certificate. Click the Download button and save your Desktop.

[![In less than a minute the Apple Developer Portal should show you a download link for your Apple Push Certificate. Click the Download button and save your Desktop.](/img/posts/1_huy-RCy4dMcIpZ32lvdJKg.jpeg)](/img/posts/1_huy-RCy4dMcIpZ32lvdJKg.jpeg "In less than a minute the Apple Developer Portal should show you a download link for your Apple Push Certificate. Click the Download button and save your Desktop.")

If you click the Done button you will see that your Push cert is now listed.

[![If you click the Done button you will see that your Push cert is now listed.](/img/posts/1_Rpk1w1FCdWVBf1IoL0D5Dg.jpeg)](/img/posts/1_Rpk1w1FCdWVBf1IoL0D5Dg.jpeg "If you click the Done button you will see that your Push cert is now listed.")

Click the Download button to save your push certificate to the Desktop. It should download a file with a `.cer` extension

In your terminal, convert the `.cer` file to a `.pem.`. The Amazon SNS service uses the `.pem` file format.

```cli-wrap
openssl x509 -in ~/Desktop/aps_development.cer -inform DER -out ~/Desktop/PushCert.pem
```

### Obtain the App Private Key

Import the Apple Push Notifications certificate (aps_development.cer) that your downloaded from the Apple Developer Portal earlier, into the Keychain Access app.

[![Import the Apple Push Notifications certificate aps_development.cer that your downloaded from the Apple Developer Portal earlier, into the Keychain Access app.](/img/posts/1__4CBwDrRXB8rHiH2V3ff_Q.jpeg)](/img/posts/1__4CBwDrRXB8rHiH2V3ff_Q.jpeg "Import the Apple Push Notifications certificate aps_development.cer that your downloaded from the Apple Developer Portal earlier, into the Keychain Access app.")

You should see the certificate listed with the name of your app.

[![You should see the certificate listed with the name of your app.](/img/posts/1_NbxsR-xkHP370aQ_P1uMlg.jpeg)](/img/posts/1_NbxsR-xkHP370aQ_P1uMlg.jpeg "You should see the certificate listed with the name of your app.")

Expand your certificate and select the private key. Right click and export your Private Push Key to a `.p12` file.

[![Expand your certificate and select the private key. Right click and export your Private Push Key to a .p12 file.](/img/posts/1_bKqKUAK9JrQYT3oSXQVKBQ.jpeg)](/img/posts/1_bKqKUAK9JrQYT3oSXQVKBQ.jpeg "Expand your certificate and select the private key. Right click and export your Private Push Key to a .p12 file.")

Save the key file to the Desktop, naming it "PushKey".

[![Save the key file to the Desktop, naming it "PushKey".](/img/posts/1_nFVQvXYhfsWco1MrrMovmA.jpeg)](/img/posts/1_nFVQvXYhfsWco1MrrMovmA.jpeg "Save the key file to the Desktop, naming it "PushKey".")

You sill be asked to provide an encryption password for your private key file.

[![You sill be asked to provide an encryption password for your private key file.](/img/posts/1_sSoQ8id0qfaPYS38FWBw8w.jpeg)](/img/posts/1_sSoQ8id0qfaPYS38FWBw8w.jpeg "You sill be asked to provide an encryption password for your private key file.")

You will likely be asked to enter your system or login password in order to export your private key from the Keychain Access app to the file-system.

[![You will likely be asked to enter your system or login password in order to export your private key from the Keychain Access app to the file-system.](/img/posts/1_IGVzq_EMJophqgqWzm1A8A.jpeg)](/img/posts/1_IGVzq_EMJophqgqWzm1A8A.jpeg "You will likely be asked to enter your system or login password in order to export your private key from the Keychain Access app to the file-system.")

Convert the `PushKey.p12` file to a `PushKey.pem` file using `openssl` in your terninal.

```cli-wrap
openssl pkcs12 -in ~/Desktop/PushKey.p12 -out ~/Desktop/PushKey.pem -nodes -clcerts

# Enter Import Password: ************
# MAC verified OK
```

### Verify the Certificate and App Private Key

```cli-wrap
openssl s_client -connect gateway.sandbox.push.apple.com:2195 -cert ~/Desktop/PushCert.pem -key ~/Desktop/PushKey.pem
```

If you see something like the following block in your terminal, then everything is working as expected.

```bash
SSL handshake has read 3662 bytes and written 2403 bytes
...
New, TLSv1/SSLv3, Cipher is DES-CBC3-SHA
Server public key is 2048 bit
Secure Renegotiation IS supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
SSL-Session:
Protocol : TLSv1.2
Cipher : DES-CBC3-SHA
Session-ID:
Session-ID-ctx:
Master-Key: E6ABA44F7F02DC…
Start Time: 1516227913
Timeout : 300 (sec)
Verify return code: 0 (ok)
...
```

### Setup and Test your Amazon SNS iOS App

Navigate to the Applications section in your [Amazon SNS console](https://console.aws.amazon.com/sns/v2/home?region=us-east-1#/applications):

[![Navigate to the Applications section in your Amazon SNS console](/img/posts/1_LiqgObUyKpoCAVOt0HAw8Q.jpeg)](/img/posts/1_LiqgObUyKpoCAVOt0HAw8Q.jpeg "Navigate to the Applications section in your Amazon SNS console")

Click the "Create platform application" button and fill in the following form.

[![Click the “Create platform application” button and fill in the following form.](/img/posts/1_Aa59CKNnBUHrxn8iw91KsQ.jpeg)](/img/posts/1_Aa59CKNnBUHrxn8iw91KsQ.jpeg "Click the “Create platform application” button and fill in the following form.")

Click the "Load credentials from file" button. You should see the certificate and key loaded.

[![Click the "Load credentials from file" button. You should see the certificate and key loaded.](/img/posts/1_p2ymJhvtlF-19rYw16lCkA.jpeg)](/img/posts/1_p2ymJhvtlF-19rYw16lCkA.jpeg "Click the "Load credentials from file" button. You should see the certificate and key loaded.")

Click the “Create platform application” button and you should see the application added to the list.

[![Click the “Create platform application” button and you should see the application added to the list.](/img/posts/1_8Fo8uDNP0s_0Vz8K-6kL1w.jpeg)](/img/posts/1_8Fo8uDNP0s_0Vz8K-6kL1w.jpeg "Click the “Create platform application” button and you should see the application added to the list.")

Click on the application in the list and the click the “Create application endpoint” button.

[![Click on the application in the list and the click the “Create application endpoint” button.](/img/posts/1_5oUh5xCJxUwuFaNByt8Tmw.jpeg)](/img/posts/1_5oUh5xCJxUwuFaNByt8Tmw.jpeg "Click on the application in the list and the click the “Create application endpoint” button.")

Add the Device Token (`registrationId`) that you saved from the Safari Developer console earlier, and click the "Add endpoint" button.

[![Add the Device Token (registrationId) that you saved from the Safari Developer console earlier, and click the "Add endpoint" button.](/img/posts/1_8BEKAMXOokn_9UOYsT3Ogg.jpeg)](/img/posts/1_8BEKAMXOokn_9UOYsT3Ogg.jpeg "Add the Device Token (registrationId) that you saved from the Safari Developer console earlier, and click the "Add endpoint" button.")

Click on the ARN link.

[![Click on the ARN link.](/img/posts/1_ARvllhNVFeuxasVUFPw0fg.jpeg)](/img/posts/1_ARvllhNVFeuxasVUFPw0fg.jpeg "Click on the ARN link.")

Check the item with the Device Token (`registrationId`) that you added, and click the "Publish to endpoint" button.

[![Check the item with the Device Token (registrationId) that you added, and click the "Publish to endpoint" button.](/img/posts/1_SIhYxfwx5W5e9r0JcFKadQ.jpeg)](/img/posts/1_SIhYxfwx5W5e9r0JcFKadQ.jpeg "Check the item with the Device Token (registrationId) that you added, and click the "Publish to endpoint" button.")

Create a Raw text message and click the "Publish message" button.

[![Create a Raw text message and click the "Publish message" button.](/img/posts/1_xY6BPYjiJ1ih4FmPE5m-dg.jpeg)](/img/posts/1_xY6BPYjiJ1ih4FmPE5m-dg.jpeg "Create a Raw text message and click the "Publish message" button.")

Within thirty seconds you should see the notification arrive on your iOS device.

[![Within thirty seconds you should see the notification arrive on your iOS device.](/img/posts/1_Ve144ip_-wgG9HrcjemmDw.jpeg)](/img/posts/1_Ve144ip_-wgG9HrcjemmDw.jpeg "Within thirty seconds you should see the notification arrive on your iOS device.")

If you swipe or click the notification, it should take you into the app, where your Push Notification event is replayed.

[![If you swipe or click the notification, it should take you into the app, where your Push Notification event is replayed.](/img/posts/1_IM8d2Of4REx70-NQDS7iHQ.jpeg)](/img/posts/1_IM8d2Of4REx70-NQDS7iHQ.jpeg "If you swipe or click the notification, it should take you into the app, where your Push Notification event is replayed.")

Congrats! You can now send Push Notifications through Amazon SNS to iOS devices subscribed to your APNS certificate.

## Android GCM or FCM Guide

You have already added the android platform at the start of the steps above, so no need to add that again here.

### Create a Google API Project and Credentials

Visit the [Google Developer Console Credentials Page](https://console.developers.google.com/projectselector/apis/credentials).

> **Note:** You may need to click the blue “Enable APIs and Services” if it appears.

[![Click on the “Create” button.](/img/posts/1_68Kyo-Ac6Y7oAXO4eBaiJw.jpeg)](/img/posts/1_68Kyo-Ac6Y7oAXO4eBaiJw.jpeg "Click on the “Create” button.")

Name your application and click on the following “Create” button.

[![Name your application and click on the following “Create” button.](/img/posts/1_ff7B_fp8rIn8UWFXvMPPmw.jpeg)](/img/posts/1_ff7B_fp8rIn8UWFXvMPPmw.jpeg "Name your application and click on the following “Create” button.")

You will now see the application name at the top of the window (highlighted in this image with the red oval). Click the “Create credentials” button and select “API” from the dropdown menu.

[![You will now see the application name at the top of the window (highlighted in this image with the red oval). Click the “Create credentials” button and select “API” from the dropdown menu.](/img/posts/1_KBqjRkVxi8fgaU8ZuYtmtw.jpeg)](/img/posts/1_KBqjRkVxi8fgaU8ZuYtmtw.jpeg "You will now see the application name at the top of the window (highlighted in this image with the red oval). Click the “Create credentials” button and select “API” from the dropdown menu.")

Your Google API Credentials have been created! Your app now has an API Key.

[![Your Google API Credentials have been created! Your app now has an API Key.](/img/posts/1_1KgVQd6jVjqqpp1M6vxf7g.jpeg)](/img/posts/1_1KgVQd6jVjqqpp1M6vxf7g.jpeg "Your Google API Credentials have been created! Your app now has an API Key.")

### Add a GCM Mobile Project

Navigate to the [Add Mobile interface](https://developers.google.com/mobile/add](https://developers.google.com/mobile/add), and begin setting up Google Cloud Messaging for your mobile application.

> **Note:** If the user Force-Stops the app and restarts the app, a new registration number will be provided.  
>  
> You can Force Stop the app from the settings menu:  
> `Settings` > `Apps` > `YourApp` > `Force Stop`
>  
> Source: [Stack Overflow](https://stackoverflow.com/questions/23580069/android-push-plugin-getting-registered-but-not-receiving-any-message)

[![Navigate to the Add Mobile interface, and begin setting up Google Cloud Messaging for your mobile application.](/img/posts/1_aIUGzXRwAU29zbuE4mxegQ.jpeg)](/img/posts/1_aIUGzXRwAU29zbuE4mxegQ.jpeg "Navigate to the Add Mobile interface, and begin setting up Google Cloud Messaging for your mobile application.")

Click on "Pick a Platform", then click on "Android App".

[![Click on "Pick a Platform", then click on "Android App".](/img/posts/1_BIbbLFJvwEyKaEX_m8zfwg.jpeg)](/img/posts/1_BIbbLFJvwEyKaEX_m8zfwg.jpeg "Click on "Pick a Platform", then click on "Android App".")

Name your mobile app appropriately, then click "Choose and configure services".

> **Note:** You will need to pick a valid package name for you app. The package name is the same as the Widget Id from your `config.xml` file. For example if your `config.xml` file looks like this:  
>  
> ```xml  
> <?xml version=’1.0' encoding=’utf-8'?>  
> <widget id=”org.apache.cordova.RemotePushNotificationsApp” version=”1.0.0" xmlns=”http://www.w3.org/ns/widgets" xmlns:cdv=”http://cordova.apache.org/ns/1.0">  
> ```  
> ...then use “org.apache.cordova.RemotePushNotificationsApp” as your package name.

Click on “Generate Configuration Files”.

[![Click on “Generate Configuration Files”.](/img/posts/1_cDIuuvE-nmdzfeTHLOnNaw.jpeg)](/img/posts/1_cDIuuvE-nmdzfeTHLOnNaw.jpeg "Click on “Generate Configuration Files”.")

You should now see a link to download your `google-services.json` file as well as your Server API Key and Sender ID. You will need all of these to send notifications to your app.

First, click on the on the “Download google-services.json” button. Save this file to your `~/Downloads` folder.

[![First, click on the on the “Download google-services.json” button. Save this file to your ~/Downloads folder.](/img/posts/1_813TGw59MDHi9bL-VTagqw.jpeg)](/img/posts/1_813TGw59MDHi9bL-VTagqw.jpeg "First, click on the on the “Download google-services.json” button. Save this file to your ~/Downloads folder.")

Copy `google-services.json` into your `platforms/android` directory, so that it can be picked up by the Cordova Android build process.

```cli-wrap
cp ~/Downloads/google-services.json platforms/android/google-services.json
```

You will need to add your Sender Id to the `www/js/index.js` file so that Google can connect your app to the notifications endpoint.

```js
onDeviceReady: function() {
    this.receivedEvent('deviceready');
    var push = PushNotification.init({
        android: {
            // Add your Google Mobile App SenderId here
            senderID: 24XXXXXXXXX0
        },
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });
    ...
}
```

### Update Android Studio Dependencies

Open Android Studio and make sure you have Android Support Repository installed. Don’t forget to check for Android Studio Updates and installed them!

<!-- missing image: cordova-remote-push-notifications-android-sdk-support-repo.jpg -->

```cli
cp ~/Downloads/google-services.json platforms/android
```

### Build The Android App

You should now be ready to build your Android app.

```cli
cordova build android
cordova run android
```

When your app starts you should see an Alert with your device’s `registrationId` (Device Token).

[![When your app starts you should see an Alert with your device’s registrationId (Device Token).](/img/posts/1_q3wodYk23t-eyz8vMM_VRg.jpeg)](/img/posts/1_q3wodYk23t-eyz8vMM_VRg.jpeg "When your app starts you should see an Alert with your device’s registrationId (Device Token).")

> ### ⚠️ &nbsp;Important
> Copy and save the `registrationId` from your Chrome Inspect console.

[![You will need your registrationId to test push notifications on your device.](/img/posts/1_qmbJYtAIkIAPGd1k1Uxn8Q.jpeg)](/img/posts/1_qmbJYtAIkIAPGd1k1Uxn8Q.jpeg "You will need your registrationId to test push notifications on your device.")

You will need your `registrationId` to test push notifications on your device.

### Create Your Amazon SNS App and Test Push Notifications

Navigate to your [Amazon SNS App Console](https://console.aws.amazon.com/sns/v2/home?region=us-east-1#/applications).

[![Navigate to your Amazon SNS App Console.](/img/posts/1_-Ub3dSPGMjMHf3o-frg07w.jpeg)](/img/posts/1_-Ub3dSPGMjMHf3o-frg07w.jpeg "Navigate to your Amazon SNS App Console.")

Click "Create platform application" and fill out the form. Your API Key is the Service API Key from the [Add Mobile interface](https://developers.google.com/mobile/add). Click the following "Create platform application" button to continue.

[![Click “Create platform application” and fill out the form. Your API Key is the Service API Key from the Add Mobile interface. Click “Create platform application” to continue.](/img/posts/1_-z9XcNbCQXGRAyupaHv4Ug.jpeg)](/img/posts/1_-z9XcNbCQXGRAyupaHv4Ug.jpeg "Click “Create platform application” and fill out the form. Your API Key is the Service API Key from the Add Mobile interface. Click “Create platform application” to continue.")

Select the Amazon SNS app you just created. Then click "Create platform endpoint".

[![Select the Amazon SNS app you just created. Then click "Create platform endpoint".](/img/posts/1_FX7Abr4f4IOjOUvqsgn02g.jpeg)](/img/posts/1_FX7Abr4f4IOjOUvqsgn02g.jpeg "Select the Amazon SNS app you just created. Then click "Create platform endpoint".")

Fill our the form. The "Device token" is the same `registrationId` that you copied from the Chrome Inspect console in a previous step. Click the "Add endpoint" button to continue.

[![Fill our the form. The "Device token" is the same registrationId that you copied from the Chrome Inspect console in a previous step. Click the "Add endpoint" button to continue.](/img/posts/1_idJ4iJaM-BCmfPrE1Mva2g.jpeg)](/img/posts/1_idJ4iJaM-BCmfPrE1Mva2g.jpeg "Fill our the form. The "Device token" is the same registrationId that you copied from the Chrome Inspect console in a previous step. Click the "Add endpoint" button to continue.")

Back in the Applications list, click on the ARN for the Android App you created.

[![Back in the Applications list, click on the ARN for the Android App you created.](/img/posts/1_untbIlZGOEfcxgNoGyoz6w.jpeg)](/img/posts/1_untbIlZGOEfcxgNoGyoz6w.jpeg "Back in the Applications list, click on the ARN for the Android App you created.")

Select the endpoint you want to push a notification to, and click "Publish to endpoint".

[![Select the endpoint you want to push a notification to, and click "Publish to endpoint".](/img/posts/1_SIm38C2lxMd_LgPzVL7scg.jpeg)](/img/posts/1_SIm38C2lxMd_LgPzVL7scg.jpeg "Select the endpoint you want to push a notification to, and click "Publish to endpoint".")

> ### ⚠️ &nbsp;Important
> 
> **You must close the app on your device** to test the push notification is received when the user does not have your app loaded.

After you have closed the app, create and send the following test message in JSON format and click the "Publish message" button.

```js
// INCEPTION:
// You would be right in thinking this JSON looks strange. 
// AWS requies your GCM data to be a Stringified JSON object.
{
    "GCM": "{ \"notification\": { \"text\": \"test message\" } }"
}
```
> **Note:** Android platforms lower than 8.0 may require a different JSON payload, where notifications is swapped for data. You can read more about this issue [on Github](https://github.com/phonegap/phonegap-plugin-push/issues/2158), and [on StackOverflow](https://stackoverflow.com/questions/38300450/fcm-with-aws-sns). 
>  
> ```json
> {  
> "GCM": “{ \"data\": { \"text\": \"test message\" } }"  
> }  
> ```  

[![After you have closed the app, create and send the following test message in JSON format and click the "Publish message" button.](/img/posts/1_e4xA1QqK-CoRaa5-_PhM-A.jpeg)](/img/posts/1_e4xA1QqK-CoRaa5-_PhM-A.jpeg "After you have closed the app, create and send the following test message in JSON format and click the "Publish message" button.")

You should see confirmation starting with: "Message published…"

[![You should see confirmation starting with: "Message published…"](/img/posts/1_QN6g8GB-fEWHNhD3jYTB0Q.jpeg)](/img/posts/1_QN6g8GB-fEWHNhD3jYTB0Q.jpeg "You should see confirmation starting with: "Message published…")

Within seconds, you should see a badge appear above your app's home-screen Icon. Also, notice the white square in the top left? This is an indicator that you have a new notification for your app. usually you would replace this with your app Icon.

[![Within seconds, you should see a badge appear above your app's home-screen Icon.](/img/posts/1_Gs3oHWyC0M-xAucKIdVHgQ.jpeg)](/img/posts/1_Gs3oHWyC0M-xAucKIdVHgQ.jpeg "Within seconds, you should see a badge appear above your app's home-screen Icon.")

If you roll down the notification blind, you will see the notification in the list. Notice the little grey square on the left? That is where your app Icon should go.

[![If you roll down the notification blind, you will see the notification in the list. Notice the little grey square on the left? That is where your app Icon should go.](/img/posts/1_vwTPEgT6Orx2AuZ05efJXw.jpeg)](/img/posts/1_vwTPEgT6Orx2AuZ05efJXw.jpeg "If you roll down the notification blind, you will see the notification in the list. Notice the little grey square on the left? That is where your app Icon should go.")

If you tap on the notification, it will take you into the app. If you remember the iOS steps, your push notification would be replayed inside your app. This is not happening in Android. Instead, you will have to send a second notification.

Now that the app is open, if you send the same payload as you did in the step above, you should see the following alert showing you the notification message that you pushed from Amazon SNS.

> **Note:** This is a caveat of using `notification` instead of `data` in the SNS push notification payload. I am currently learning how to work around this and I plan to update this document when I have a solution to push a single notification to an Android 8.0 device and make it register in both the background, and the foreground.

## Congrats!

You can now send remote push notifications to Android and iOS from your Amazon SNS Console!