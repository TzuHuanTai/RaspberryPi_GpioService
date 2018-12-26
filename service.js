/**
 * 將Express.js與onoff套件結合
 * 利用WebAPI控制樹梅派GPIO，用網頁上的UI控制
 * 
 * 連接方式:
 * http://{domain}/gpio/{pin_num}/set/{onoff}
 * 
 * Example:
 * 設定BCM 21 pin高電位
 * http://192.168.0.150/gpio/21/set/1
 * 設定BCM 21 pin低電位
 * http://192.168.0.150/gpio/21/set/0
 * 釋放BCM 21 pin資源
 * http://192.168.0.150/gpio/21/set/unexport
 * 查詢BCM 20, 21 pin的狀態
 * http://192.168.0.150/gpio/status , post body:{"pins":[20, 21]}
 * 
 * 我的私人用途:
 * GPIO. 7(Pin 4): DHT22 is using this port! It should not be controlled!
 * GPIO.28(Pin20): Cooling Fan on Raspberry Pi
 * GPIO.29(Pin21): Motor
 * 
 +-----+-----+---------+------+---+---Pi 3---+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 |     |     |    3.3v |      |   |  1 || 2  |   |      | 5v      |     |     |
 |   2 |   8 |   SDA.1 | ALT0 | 1 |  3 || 4  |   |      | 5v      |     |     |
 |   3 |   9 |   SCL.1 | ALT0 | 1 |  5 || 6  |   |      | 0v      |     |     |
 |   4 |   7 | GPIO. 7 |   IN | 1 |  7 || 8  | 0 | IN   | TxD     | 15  | 14  |
 |     |     |      0v |      |   |  9 || 10 | 1 | IN   | RxD     | 16  | 15  |
 |  17 |   0 | GPIO. 0 |   IN | 0 | 11 || 12 | 0 | IN   | GPIO. 1 | 1   | 18  |
 |  27 |   2 | GPIO. 2 |   IN | 0 | 13 || 14 |   |      | 0v      |     |     |
 |  22 |   3 | GPIO. 3 |   IN | 0 | 15 || 16 | 0 | IN   | GPIO. 4 | 4   | 23  |
 |     |     |    3.3v |      |   | 17 || 18 | 0 | IN   | GPIO. 5 | 5   | 24  |
 |  10 |  12 |    MOSI | ALT0 | 0 | 19 || 20 |   |      | 0v      |     |     |
 |   9 |  13 |    MISO | ALT0 | 0 | 21 || 22 | 0 | IN   | GPIO. 6 | 6   | 25  |
 |  11 |  14 |    SCLK | ALT0 | 0 | 23 || 24 | 1 | OUT  | CE0     | 10  | 8   |
 |     |     |      0v |      |   | 25 || 26 | 1 | OUT  | CE1     | 11  | 7   |
 |   0 |  30 |   SDA.0 |   IN | 1 | 27 || 28 | 1 | IN   | SCL.0   | 31  | 1   |
 |   5 |  21 | GPIO.21 |   IN | 1 | 29 || 30 |   |      | 0v      |     |     |
 |   6 |  22 | GPIO.22 |   IN | 1 | 31 || 32 | 0 | IN   | GPIO.26 | 26  | 12  |
 |  13 |  23 | GPIO.23 |   IN | 0 | 33 || 34 |   |      | 0v      |     |     |
 |  19 |  24 | GPIO.24 |   IN | 0 | 35 || 36 | 0 | IN   | GPIO.27 | 27  | 16  |
 |  26 |  25 | GPIO.25 |   IN | 0 | 37 || 38 | 0 | IN   | GPIO.28 | 28  | 20  |
 |     |     |      0v |      |   | 39 || 40 | 0 | IN   | GPIO.29 | 29  | 21  |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+---Pi 3---+---+------+---------+-----+-----+
 */

/** initialize */
var express = require('express');
var app = express();
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
var gpioRouter = express.Router({ mergeParams: true });
// initialize gpio pins
const Gpio = require('onoff').Gpio;
const allowPins = [20, 21];


/** service config*/
//parse json format, 要放在API前面
app.use(express.json());

// Add headers
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', "Authorization, Origin, X-Requested-With, Content-Type, Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/gpio/:pin', gpioRouter);

app.listen(3000, () => {
    console.log('Gpio api is listening on port 3000!');
});


/**Main API route*/
//批次查詢gpio狀態
app.route('/gpio/status').post((req, res) => {
    let result = [];

    req.body.pins.forEach(pinNum => {
        let pin = new Gpio(Number(pinNum), '');
        let val = pin.readSync();
        let dir = pin.direction();

        let temp = { pin: pin, value: val, direction: dir };

        result.push(temp);
    });

    res.send(result);
});

gpioRouter.route('/set/:onoff').get((req, res) => {
    if (req.params.onoff != 'unexport' && allowPins.some(x => x == Number(req.params.pin))) {
        pin = new Gpio(Number(req.params.pin), 'out');
        pin.writeSync(Number(req.params.onoff));
        res.send(req.params.onoff);
    }
    else if (req.params.onoff == 'unexport') {
        pin = new Gpio(Number(req.params.pin), 'out');
        pin.unexport();
        res.send(req.params.pin + ' unexported!');
    }
    else {
        res.status(400);
        res.send("Pin " + req.params.pin + " can not be controlled!");
    }
});

gpioRouter.route('/status').get((req, res) => {
    pin = new Gpio(Number(req.params.pin), '');
    let val = pin.readSync();
    let dir = pin.direction();

    let result = { pin: pin, value: val, direction: dir };

    res.send(result);
});