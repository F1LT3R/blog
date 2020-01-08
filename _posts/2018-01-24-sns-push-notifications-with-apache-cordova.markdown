---
layout: post
title:  AWS SNS Push Notify with Cordova
feature_img: /img/feature/sns-push-notifications-with-apache-cordova.jpeg
date: '2018-01-24 11:00:00'
featured: true
category:
- guide
tags:
- SNS
- Notifications
- Cordova
- Amazon
- AWS
- mobile
- JavaScript
- Apache
- setup
---

This guide walks you though creating a Cordova app for Push Notifications on iOS and Android. We will use the Apache Cordova platform and the Amazon SNS service to build and test our Push Notifications.

The guide is split into three parts:

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

