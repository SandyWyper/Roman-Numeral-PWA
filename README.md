# Roman Numeral Converter


This web app takes an input of either numbers or Roman numerals, and coverts that input to the other type.  There is error handling and will inform the user of an incorrect input value, and will let them know what was wrong with the input.  For example; wrong numeral ordering, incorrect characters, combo of numbers and letters, etc.

All convertion functionality was written from scratch in javascript.

---
### This is a *Progressive Web App*

> a website that behaves like a mobile app or desktop application

For a more detailed explanation of what a PWA is click [here](https://developers.google.com/web/progressive-web-apps/).

To achieve PWA functionality you have to fulfil a number of criteria:

* a service worker to cache the code
* HTTPS
* a manifest.json file

other optimisation criteria:

* various sizes of icon
* address bar theme colour
* configuration for a splash screen 

In addition to this, there is a listener for the "Install to homescreen" prompt. When launched as an app it preforms just as you would expect a native app to function.