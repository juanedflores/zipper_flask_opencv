from flask import Flask, render_template, request
# import numpy as np
# import re
# import base64
# import cv2
import math
import time
import serial

app = Flask(__name__)

s = serial.Serial('/dev/ttyACM0',115200)

# Wake up grbl
s.write(str.encode('\r\n\r\n'))
time.sleep(2)   # Wait for grbl to initialize 
s.flushInput()  # Flush startup text in serial input

print("homing..")
s.write(str.encode("$H\n"))
time.sleep(6)

@app.route('/')
def index():
    return render_template("index.html")


def init_zipper():
    # Wake up grbl
    s.write(str.encode('\r\n\r\n'))
    time.sleep(2)   # Wait for grbl to initialize 
    s.flushInput()  # Flush startup text in serial input

    print("homing..")
    s.write(str.encode("$H\n"))
    time.sleep(6)


@app.route('/hook', methods=['POST'])
def move_zipper():
    position = float(request.form.get('xpos'))
    print(math.ceil(position))
    s.write(str.encode("X" + str(math.ceil(position)) + "\n"))
    return ''



if __name__ == '__main__':
    init_zipper()
    app.run(debug=True)
