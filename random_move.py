import time
import random
import serial

# Open grbl serial port
s = serial.Serial('/dev/ttyACM0',115200)

# Open g-code file
# f = open('grbl.gcode','r');

# Wake up grbl
s.write(str.encode('\r\n\r\n'))
time.sleep(2)   # Wait for grbl to initialize 
s.flushInput()  # Flush startup text in serial input

print("homing..")
s.write(str.encode("$H\n"))
# s.write(str.encode("G10 L20 P1 X0\n"))

time.sleep(6)

while True:
    rX = random.randrange(22)
    print(rX)
    s.write(str.encode("X" + str(rX) + "\n"))
    time.sleep(4)

# s.close()
