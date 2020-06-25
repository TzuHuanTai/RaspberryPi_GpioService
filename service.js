import express from 'express';
import cors from 'cors';
import onoff from 'onoff';
import pigpio from 'pigpio';
import os from 'os';
import fs from 'fs';
import http from 'http';
import https from 'https';
var privateKey  = fs.readFileSync('/etc/ssl/greenhouse.key');
var certificate = fs.readFileSync('/etc/ssl/greenhouse.crt');
var credentials = {key: privateKey, cert: certificate};

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
let corsOrigin = [].concat(...Object.values(os.networkInterfaces()))
                .filter(x => x.family === 'IPv4')
                .map(x => `http://${x.address}`);
corsOrigin.push('http://localhost');            
const corsOptions = {
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));

// use routers
app.use('/gpio/:pin', gpioRouter);
app.use('/pwm/:pin', pwmRouter);

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
app.route('/gpio/status').get((req, res) => {
    let result = [];
    gpioPins.forEach(pinNum => {
        let pin = new onoff.Gpio(Number(pinNum), '');
        let val = pin.readSync();
        let dir = pin.direction();
        let temp = { pin: pin, value: val, direction: dir };
        result.push(temp);
    });
    res.send(result);
});

gpioRouter.route('/').put((req, res) => {
    if (req.body.onoff != 'unexport' && gpioPins.some(x => x == Number(req.params.pin))) {
        let pin = new onoff.Gpio(Number(req.params.pin), 'out');
        pin.writeSync(Number(req.body.onoff));
        res.status(204).end();
    } else if (req.body.onoff == 'unexport') {
        let pin = new onoff.Gpio(Number(req.params.pin), 'out');
        pin.unexport();
        res.status(204).end();
    } else {
        res.status(400).send("Pin " + req.params.pin + " can not be controlled!");
    }
});

gpioRouter.route('/status').get((req, res) => {
    let pin = new onoff.Gpio(Number(req.params.pin), '');
    let val = pin.readSync();
    let dir = pin.direction();
    let result = { pin: pin, value: val, direction: dir };
    res.send(result);
});

pwmRouter.route('/').put((req, res) => {
    if (pwmPins.some(x => x == Number(req.params.pin))) {
        let pwmLed = new pigpio.Gpio(Number(req.params.pin));
        pwmLed.mode(pigpio.Gpio.OUTPUT)
        pwmLed.hardwarePwmWrite(Number(req.body.freq), Number(req.body.duty));
        let result = {
            pin: req.params.pin,
            freq: req.body.freq,
            duty: req.body.duty
        };
        res.send(result);
    } else {
        res.status(204).end();
    }
});


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(3000, () => {
    console.log('Gpio api is listening on port 3000!');
});
httpsServer.listen(3443, () => {
    console.log('Gpio api is listening on port 3433!');
});
