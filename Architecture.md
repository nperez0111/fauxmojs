# Overview

This architecture document provides context to the how and why this project is built in the way that it is.

## Discovery Server

Allows Alexa to discover our "devices" to be be controlled. It emulates the WeMo switch protocol gives us a couple of restrictions:

* devices are limited to get, turn on and turn off as actions
* devices must be exposed on several ports

### Discovery Server Routes

A UDP server that implements the SSDP protocol to allow for discovery of devices by Alexa, as such it is largely reactive and only is responsible for outputting the list of devices available as XML.

## Device Server

The primary interface for interaction between Alexa and the device. This server is also conforming to the WeMo switch protocol giving us the same limitations described above.

### Device Server Routes

An express server that is dedicated to a single device, because we are restricted to mapping a single device to a single port.

#### getDeviceSetup

Returns the device's unique setup XML that tells Alexa what the device supports, because we are emulating WeMo we conform to its abilities.

#### deviceControl

This is how we are able to control a device, the server either gets the latest status of the device or changes the state of the device (on/off).

## Client Server

This server is meant to be an interface for the client to be able to administrate and access their devices.

### Client Server Routes

Used to administrate and access user devices.

#### listDevices (`GET /devices`)

List all devices the user has configured

#### addDevice (`PUT /devices`)

Add a new device

#### getDevice (`GET /devices/:id`)

Retrieve a single device, its state and meta data

#### updateDevice (`POST /devices/:id`)

Update a single device's meta data

#### deleteDevice (`DELETE /devices/:id`)

Delete a single device

#### getState (`GET /devices/:id/state`)

Get the state of a device (on/off)

#### setState (`POST /devices/:id/state`)

Set the state of a device (on/off)

## Device

Schema for a single device resource

* **Name (String):** The name of the device
* **Port (Number):** The port of the device server
* **getStatus (AsyncFunction):** Allows for getting the status of the device (`true` if on, `false` if off)
* **setOn (AsyncFunction):** Changes the device to on
* **setOff (AsyncFunction):** Changes the device to off
