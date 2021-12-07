from flask import Flask, render_template, request
import numpy as np
import re
import base64
import cv2
import time
import serial

app = Flask(__name__)

s = serial.Serial('/dev/tty.usbmodem14201',115200)

# haar_file = '/static/haarcascades/haarcascade_frontalface_alt.xml'

# face_cascade = cv2.CascadeClassifier('/Users/juaneduardoflores/Documents/Python/flask/zipper_project/static/haarcascades/haarcascade_frontalface_default.xml')
# face_cascade = cv2.CascadeClassifier('/static/haarcascades/haarcascade_frontalface_default.xml')

@app.route('/')
def index():
    return render_template("index.html")

# @app.route('/hook', methods=['POST'])
# def get_image():
#     image_b64 = request.values['imageBase64']
#     image_data_str = re.sub('^data:image/.+;base64,', '', image_b64)
#     nparr = np.fromstring(base64.b64decode(image_data_str), np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)
#     print(faces)
#     print(len(faces))
#     num = 0
#     for (x, y, w, h) in faces:
#         cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
#         face = gray[y:y + h, x:x + w]
#         cv2.imwrite('test_rect.png', img)
#         # face_resize = cv2.resize(face, (width, height))
#         num+=1


#     cv2.imwrite('test.png', gray)

#     # print('Image received: {}'.format(img))
#     print("NUM" + str(num))
#     return ''

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
    position = request.form.get('xpos')
    print(position)
    s.write(str.encode("X" + str(position) + "\n"))
    return ''



if __name__ == '__main__':
    app.run(debug=True)
