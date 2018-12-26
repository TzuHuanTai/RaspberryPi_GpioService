# Raspberry_IoT

Raspberry Pi use express.js design APIs to control GPIO pins

將Express.js與onoff套件結合，利用WebAPI控制樹梅派GPIO

可以在browser上的設計UI控制數莓派

</br>

## 連接方式 ##

http://{domain}/gpio/{pin_num}/set/{onoff}

</br>
  
Example:

設定BCM 21 pin高電位:

`GET`http://192.168.0.150/gpio/21/set/1
  
設定BCM 21 pin低電位:

`GET`http://192.168.0.150/gpio/21/set/0
 
釋放BCM 21 pin資源:

`GET`http://192.168.0.150/gpio/21/set/unexport 
  
查詢BCM 20, 21 pin的狀態:

`post, body:{"pins":[20, 21]}`http://192.168.0.150/gpio/status

</br>
## Pins of raspberry pi ##
<table class="tg" style="undefined;table-layout: fixed; width: 433px">
<colgroup>
<col style="width: 43px">
<col style="width: 66px">
<col style="width: 60px">
<col style="width: 49px">
<col style="width: 50px">
<col style="width: 56px">
<col style="width: 66px">
<col style="width: 43px">
</colgroup>
  <tr>
    <th class="tg-amwm">BCM</th>
    <th class="tg-amwm">Name</th>
    <th class="tg-amwm">Mode</th>
    <th class="tg-amwm" colspan="2">Physical</th>
    <th class="tg-amwm">Mode</th>
    <th class="tg-amwm">Name</th>
    <th class="tg-amwm">BCM</th>
  </tr>
  <tr>
    <td class="tg-cmwg"></td>
    <td class="tg-cmwg">3.3v</td>
    <td class="tg-cmwg"></td>
    <td class="tg-7geq">1</td>
    <td class="tg-7geq">2</td>
    <td class="tg-3oug"></td>
    <td class="tg-3oug">5v</td>
    <td class="tg-3oug"></td>
  </tr>
  <tr>
    <td class="tg-baqh">2</td>
    <td class="tg-baqh">GPIO.2</td>
    <td class="tg-baqh">SDA.1</td>
    <td class="tg-7geq">3</td>
    <td class="tg-7geq">4</td>
    <td class="tg-3oug"></td>
    <td class="tg-3oug">5v</td>
    <td class="tg-3oug"></td>
  </tr>
  <tr>
    <td class="tg-baqh">3</td>
    <td class="tg-baqh">GPIO.3</td>
    <td class="tg-baqh">SCL.1</td>
    <td class="tg-7geq">5</td>
    <td class="tg-7geq">6</td>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
  </tr>
  <tr>
    <td class="tg-baqh">4</td>
    <td class="tg-baqh">GPIO.4</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">7</td>
    <td class="tg-7geq">8</td>
    <td class="tg-baqh">TxD</td>
    <td class="tg-baqh">GPIO.14</td>
    <td class="tg-baqh">14</td>
  </tr>
  <tr>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
    <td class="tg-7geq">9</td>
    <td class="tg-7geq">10</td>
    <td class="tg-baqh">RxD</td>
    <td class="tg-baqh">GPIO.15</td>
    <td class="tg-baqh">15</td>
  </tr>
  <tr>
    <td class="tg-baqh">17</td>
    <td class="tg-baqh">GPIO.17</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">11</td>
    <td class="tg-7geq">12</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.18</td>
    <td class="tg-baqh">18</td>
  </tr>
  <tr>
    <td class="tg-baqh">27</td>
    <td class="tg-baqh">GPIO.27</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">13</td>
    <td class="tg-7geq">14</td>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
  </tr>
  <tr>
    <td class="tg-baqh">22</td>
    <td class="tg-baqh">GPIO.22</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">15</td>
    <td class="tg-7geq">16</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.23</td>
    <td class="tg-baqh">23</td>
  </tr>
  <tr>
    <td class="tg-cmwg"></td>
    <td class="tg-cmwg">3.3v</td>
    <td class="tg-cmwg"></td>
    <td class="tg-7geq">17</td>
    <td class="tg-7geq">18</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.24</td>
    <td class="tg-baqh">24</td>
  </tr>
  <tr>
    <td class="tg-baqh">10</td>
    <td class="tg-baqh">GPIO.10</td>
    <td class="tg-baqh">MOSI</td>
    <td class="tg-7geq">19</td>
    <td class="tg-7geq">20</td>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
  </tr>
  <tr>
    <td class="tg-baqh">9</td>
    <td class="tg-baqh">GPIO.9</td>
    <td class="tg-baqh">MISO</td>
    <td class="tg-7geq">21</td>
    <td class="tg-7geq">22</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.25</td>
    <td class="tg-baqh">25</td>
  </tr>
  <tr>
    <td class="tg-baqh">11</td>
    <td class="tg-baqh">GPIO.11</td>
    <td class="tg-baqh">SCLK</td>
    <td class="tg-7geq">23</td>
    <td class="tg-7geq">24</td>
    <td class="tg-baqh">CE0</td>
    <td class="tg-baqh">GPIO.8</td>
    <td class="tg-baqh">8</td>
  </tr>
  <tr>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
    <td class="tg-7geq">25</td>
    <td class="tg-7geq">26</td>
    <td class="tg-baqh">CE1</td>
    <td class="tg-baqh">GPIO.7</td>
    <td class="tg-baqh">7</td>
  </tr>
  <tr>
    <td class="tg-baqh">0</td>
    <td class="tg-baqh">SDA.0</td>
    <td class="tg-baqh">I2C</td>
    <td class="tg-7geq">27</td>
    <td class="tg-7geq">28</td>
    <td class="tg-baqh">I2C</td>
    <td class="tg-baqh">ID_SC</td>
    <td class="tg-baqh">1</td>
  </tr>
  <tr>
    <td class="tg-baqh">5</td>
    <td class="tg-baqh">GPIO.5</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">29</td>
    <td class="tg-7geq">30</td>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
  </tr>
  <tr>
    <td class="tg-baqh">6</td>
    <td class="tg-baqh">GPIO.6</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">31</td>
    <td class="tg-7geq">32</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.12</td>
    <td class="tg-baqh">12</td>
  </tr>
  <tr>
    <td class="tg-baqh">13</td>
    <td class="tg-baqh">GPIO.13</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">33</td>
    <td class="tg-7geq">34</td>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
  </tr>
  <tr>
    <td class="tg-baqh">19</td>
    <td class="tg-baqh">GPIO.19</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">35</td>
    <td class="tg-7geq">36</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.16</td>
    <td class="tg-baqh">16</td>
  </tr>
  <tr>
    <td class="tg-baqh">26</td>
    <td class="tg-baqh">GPIO.26</td>
    <td class="tg-baqh"></td>
    <td class="tg-7geq">37</td>
    <td class="tg-7geq">38</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.20</td>
    <td class="tg-baqh">20</td>
  </tr>
  <tr>
    <td class="tg-6qw1"></td>
    <td class="tg-6qw1">0v</td>
    <td class="tg-6qw1"></td>
    <td class="tg-7geq">39</td>
    <td class="tg-7geq">40</td>
    <td class="tg-baqh"></td>
    <td class="tg-baqh">GPIO.21</td>
    <td class="tg-baqh">21</td>
  </tr>
</table>
