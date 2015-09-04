# Yennoo ![status wip](https://gist.githubusercontent.com/eisenkolb/88bb2206b8bb4cdaa66a/raw/609df7a9613ec3102cc525dcdf169e89d605f451/status_wip.png?v=1)

> a modern web based graphical interface for XBMC/Kodi

Yennoo is a HTTP- and/or TCP socket-based web Interface for Kodi media center (formerly XBMC). This app uses JSON-RPC API Version 6 for the communication.

## Stack

* Awesome [AngularJS](http://www.angularjs.org/)
* CSS based on [ZURB Foundation](http://foundation.zurb.com/)

## Demo

Try out the [demo](http://eisenkolb.github.io/yennoo/)!

## Configuration

### Default interface

To set the interface as the default, go to `System → Services → Webserver` and select yennoo for the **Default** value.

### Remote access

Since the interface is available on many transports enabling it depends on the transport. From the home screen:

**HTTP**: go to `System → Services → Webserver`

* Allow control of Kodi via HTTP (see Enabling the webserver)

**TCP**: go to `System → Services → Webserver`

* Allow control of Kodi via HTTP (see Enabling the webserver)
* Allow programs on other systems to control Kodi for access from other computers as well

## Using

Browse to the application by opening any browser and enter the hostname (or [IP address](#how-to)) of your Media Center.

> **Note:** Some platforms use port 80, which is the assumed port if no port is given in the address.

For example, [http://10.0.0.3:8080 or http://192.168.1.11].

## Development

### Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

```bash
cd <Kodi dir>/addons/
git clone https://github.com/eisenkolb/yennoo.git webinterface.yennoo
```

Or download the [_zip file_](https://github.com/eisenkolb/yennoo/archive/master.zip) to the addon folder of the running Kodi instance, open Kodi and [set it as default](#default-interface).

## HOW-TO

### Getting IP to connect

On the main menu go to `System → System Info → Network`, you have access to the Mac Address and IP Address.

### Getting the used port

On the main menu go to `System → Services → Webserver`, The port is visible in the Port field.

### Install from zip file

First download this add-on directly from [_github_](https://github.com/eisenkolb/yennoo/archive/master.zip). On the main menu go to `System → Settings → Add-ons` and click on **Install from zip file** and select the repository you want to install.

## License

Yennoo is open source software. See the [LICENSE](LICENSE.md) file for license rights and limitations.

Copyright (c) 2015, Ronny Eisenkolb (@eisenkolb)