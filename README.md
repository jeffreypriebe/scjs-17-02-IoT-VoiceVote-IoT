# SCJS Feb 2017: VoiceVote App

This is part of the VoiceVote app which includes:

1. [IoT repo](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-IoT) (to be run on the Edison)
2. [Server](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/ServerVoiceVote) & [Mobile App](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/AppVoiceVote) repo (to be run on server, mobile app respectively)

## Connect Components

The app expects:

1. An LED at D4
2. An LCD display at any I2C
3. A button at D3
4. A button (touch) at D2
5. Optionally, the Grove Stepper Motor connected. (See [Note on the Stepper Motor below](#note-on-the-stepper-motor).)


## To Run

1. Be sure that [the Server](https://github.com/jeffreypriebe/scjs-17-02-IoT-VoiceVote-Server-App/tree/master/ServerVoiceVote) has been started.
    * This can either be the temporary server online, or locally run
2. Check the value of `SERVER` in `index.js` is correct.
3. On the Edison, `node index.js`

This will start the app, and the messaging room name will appear on the LCD.

## How To Use

When you have no messages, the LCD will be blank (or will show '> {ROOM NAME}' on startup).

When you have one or more messages, you can:

1. Press the button to clear / go to the next message.
2. Tap the touch button to send a '👍' back to the mobile app (and clear / move to next message)
3. OR Double-tap the touch button to send a '👎' back to the mobile app (and clear / move to the next message.

Additionally, when you have any messages, the stepper motor should move. Once you have cleared all the messages, it should again move.
The LED works in concert with the motor (so the motor is optional): on indicating "messages available" and off indicating "no messages."

## Ideas For Extending

Once you have it up and running, some ideas for changing it:

* Add an additional LED to indicate when there is a connected client in the socket room.
  * An advanced usage would require running the server locally and adding an additional socket message that is sent on every connection.
  * You could also blink the LED to correspond to the number of connected devices.
* Add some of the [other sensors in the kit](http://johnny-five.io/news/intel-edison-+-grove-iot-kit-examples/).

## Note on the Stepper Motor
The stepper motor is optional and initially disabled in `index.js` (change the `ENABLE_MOTOR` value).

It is a bit more advanced to use and requires installing packages in addition to Johnny-Five:
[mraa](https://www.npmjs.com/package/mraa) ([repo](https://github.com/intel-iot-devkit/mraa/)) and 
[jsupm_uln200xa](https://www.npmjs.com/package/jsupm_uln200xa) ([main repo](https://github.com/intel-iot-devkit/upm))

You can install both of these via npm, see [notes here](https://github.com/intel-iot-devkit/upm/blob/master/docs/installing.md#nodejs-bindings-only-npm). It is recommended to install each sequentially (mraa first) and globally.
