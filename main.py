from imutils.video import VideoStream
from imutils.video import FPS
import numpy as np
import imutils
import time
import cv2
import os
import requests

pk = 0
k = 0
ppk_n = 0
ppk_o = 0
pc_X = 0
pc_Y = 0
RIGHT = 0
LEFT = 0
UP = 0
DOWN = 0
w = 900
FPS_L = 0
ex = False
id = 15
b = False
newPositionObj = []
oldPositionObj = []
CLASSES = ["background", "aeroplane", "bicycle", "dird", "boat",
           "bottle", "bus", "car", "chair", "cow", "diningtable",
           "dog", "horse", "motorbike", "person", "pottedplant", "sheep",
           "sofa", "train", "tvmonitor"]
CLASSES = np.random.uniform(0, 255, size=(len(CLASSES), 3))

print("[INFO] loading model...")
exec_path = os.getcwd()
proto = os.path.join(exec_path, 'MobileNetSSD_deploy.prototxt')
caffe = os.path.join(exec_path, 'MobileNetSSD_deploy.caffemodel')
model = cv2.dnn.readNetFromCaffe(proto, caffe)
videostream = VideoStream(src=0).start()
time.sleep(2.0)
fps = FPS().start()

while True:
    frame = videostream.read()
    frame = imutils.resize(frame, width=w)
    FPS_L += 1
    # print(FPS_L)
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (250, 250)), 0.007843, (300, 300), 127.5)
    model.setInput(blob)
    detections = model.forward()
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        if confidence > 0.50:
            idx = int(detections[0, 0, i, 1])
            if idx == id:
                k += 1

                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                cv2.rectangle(frame, (startX, startY), (endX, endY), (247, 3, 0), 2)
                lable = "{}".format(CLASSES[idx])
                cv2.putText(frame, lable, (startX, startY - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (247, 3, 0), 2)
                pos_X = endX - ((endX - startX) / 2)
                pos_Y = endY - ((endY - startY) / 2)
                newPositionObj.append((pos_X, pos_Y))
    if newPositionObj.__len__() == 0 and oldPositionObj.__len__() != 0:
        print(oldPositionObj[0][1])
        if 0 < oldPositionObj[0][0] < w * 20 / 100:
            print("УШЕЛ В ЛЕВО")
            requests.post('http://192.168.43.115:8000/Left')
            requests.post('')
        if oldPositionObj[0][0] > w * 80 / 100:
            print("УШЕЛ В ПРАВО")
            requests.post('http://192.168.43.115:8000/Right')
            requests.post('')
        if oldPositionObj[0][1] < w * 35 / 100:
            print("УШЕЛ В ВЕРХ")
            requests.post('http://192.168.43.115:8000/Up')
        if oldPositionObj[0][1] > w * 60 / 100:
            print("УШЕЛ В ВНИЗ")
            requests.post('http://192.168.43.115:8000/Down')
    elif newPositionObj.__len__() < oldPositionObj.__len__():
        #print(oldPositionObj())
        for i in range(oldPositionObj.__len__()):
            for j in range(newPositionObj.__len__()):
                if oldPositionObj[i] == newPositionObj[j]:
                    b = True
                    continue
            if not b:
                if 0 < oldPositionObj[i][0] < w * 20 / 100:
                    print("УШЕЛ В ЛЕВО")
                    requests.post('http://192.168.43.115:8000/Left')
                if oldPositionObj[i][0] > w * 80 / 100:
                    print("УШЕЛ В ПРАВО")
                    requests.post('http://192.168.43.115:8000/Right')
                if oldPositionObj[i][1] < w * 35 / 100:
                    print("УШЕЛ В ВЕРХ")
                    requests.post('http://192.168.43.115:8000/Up')
                if oldPositionObj[i][1] > w * 60 / 100:
                    print("УШЕЛ В ВНИЗ")
                    requests.post('http://192.168.43.115:8000/Down')



    oldPositionObj.clear()
    for i in range(newPositionObj.__len__()):
        oldPositionObj.append(newPositionObj[i])
    newPositionObj.clear()
    cv2.imshow("", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q") or key == ord("й"):
        break

print("Hello")
fps.stop()
cv2.destroyAllWindows()
videostream.stop()
