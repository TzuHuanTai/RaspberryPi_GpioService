import express from 'express';
import cors from 'cors';
import onoff from 'onoff';
import pigpio from 'pigpio';

/**
 * initialize 
 */
const app = express();
pigpio.initialize();

// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
var gpioRouter = express.Router({ mergeParams: true });
var pwmRouter = express.Router({ mergeParams: true });

/**
 * gpio config
 */
const pwmFreq = 500;
const pwmPins = [12];
const gpioPins = [20, 21, 22, 23, 24, 25, 26];


/**
 * service config
 */
// parse json format before call api.
app.use(express.json());

// use CORS
const corsOptions = {
    origin: [
        'http://localhost',
        'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));

// use routers
app.use('/gpio/:pin', gpioRouter);
app.use('/pwm/:pin', pwmRouter);

app.listen(3000, 'localhost', () => {
    console.log('Gpio api is listening on port 3000!');
});

// shut down with `Ctrl + C`
process.on('SIGINT', function () {
    pigpio.terminate()
    pwmPins.forEach(pin_num => {
        let pwmLed = new pigpio.Gpio(Number(pin_num));
        pwmLed.mode(pigpio.Gpio.INPUT);
    });

    gpioPins.forEach(pin_num => {
        let pin = new onoff.Gpio(Number(pin_num), 'in');
        pin.unexport();
    });

    process.exit(0);
});

/**
 * Main API routers
 */
app.route('/gpio/status').post((req, res) => {
    let result = [];
    req.body.pins.forEach(pinNum => {
        let pin = new onoff.Gpio(Number(pinNum), '');
        let val = pin.readSync();
        let dir = pin.direction();
        let temp = { pin: pin, value: val, direction: dir };
        result.push(temp);
    });
    res.send(result);
});

gpioRouter.route('/set/:onoff').get((req, res) => {
    if (req.params.onoff != 'unexport' && gpioPins.some(x => x == Number(req.params.pin))) {
        let pin = new onoff.Gpio(Number(req.params.pin), 'out');
        pin.writeSync(Number(req.params.onoff));
        res.send(req.params.onoff);
    } else if (req.params.onoff == 'unexport') {
        let pin = new onoff.Gpio(Number(req.params.pin), 'out');
        pin.unexport();
        res.send(req.params.pin + ' unexported!');
    } else {
        res.status(400);
        res.send("Pin " + req.params.pin + " can not be controlled!");
    }
});

gpioRouter.route('/status').get((req, res) => {
    let pin = new onoff.Gpio(Number(req.params.pin), '');
    let val = pin.readSync();
    let dir = pin.direction();
    let result = { pin: pin, value: val, direction: dir };
    res.send(result);
});

pwmRouter.route('/freq/:freq/duty/:duty').get((req, res) => {
    if (pwmPins.some(x => x == Number(req.params.pin))) {
        let pwmLed = new pigpio.Gpio(Number(req.params.pin));
        pwmLed.mode(pigpio.Gpio.OUTPUT)
        pwmLed.hardwarePwmWrite(Number(req.params.freq), Number(req.params.duty));
        let result = {
            pin: req.params.pin,
            freq: req.params.freq,
            duty: req.params.duty
        };
        res.send(result);
    } else {
        res.status(400);
        res.send("Pin " + req.params.pin + " can not be controlled!");
    }
});
