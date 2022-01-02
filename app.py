from flask import Flask, render_template, request
import time
import random
import serial

app = Flask(__name__)

s = serial.Serial('/dev/tty.usbmodem14201', 115200)


@app.route('/')
def index():
    return render_template("index.html")


def init_zipper():
    # Wake up grbl
    s.write(str.encode('\r\n\r\n'))
    time.sleep(2)   # Wait for grbl to initialize
    s.flushInput()  # Flush startup text in serial input

    # Home command
    s.write(str.encode("$H\n"))
    time.sleep(6)


@app.route('/hook', methods=['POST'])
def move_zipper():
    while True:
        rX = random.randrange(22)
        print(rX)
        s.write(str.encode("X" + str(rX) + "\n"))
        return ''


if __name__ == '__main__':
    app.run()
