__author__ = 'kmcarbone16'
from PIL import Image
import numpy as np
import sys
import numpy as np

width = 32
height = 32

CIFAR_LABELS = ["airplane", "automobile","bird","cat","deer","dog","frog","horse","ship","truck"]

# def load_vertices(obj_files):
#     objs = []
#     print(glob(obj_files))
#     for file_count,file_name in enumerate( sorted(glob(obj_files),key=len) ):
#         array = []
#         with open(file_name, "r") as ins:
#             for line in ins:
#                 params = line.strip().split(" ")
#                 if len(params) >= 4 and line[0] != "#" and params[0] != "f" and params[0] == 'v':
#                     v1,v2,v3 = float(params[1]),float(params[2]),float(params[3])
#                     print round(v1),round(v2),round(v3)
#                     array.append(v1)
#                     array.append(v2)
#                     array.append(v2)
#                     # f.write(params[0]+" "+str(round(v1))+" "+str(round(v2))+" "+str(round(v3))+"\n")
#                 # else:
#                 #     f.write(line)
#         objs.append(np.matrix(array))
#     return np.array(objs)

def dir_to_dataset(file_name):
    img = Image.open(file_name)
    img = img.resize((width, height), Image.BILINEAR)
    pixels = np.array(list(img.getdata()))
    # pixels = np.reshape(pixels, (3,width*height))
    try:
        r = pixels[:,0]
        g = pixels[:,1]
        b = pixels[:,2]
    except Exception as e:
        pixels = np.reshape(pixels, (width*height,1))
        r = pixels[:,0]
        g = pixels[:,0]
        b = pixels[:,0]

    cls = -1
    rgb = np.hstack((r,g,b))
    for i,label in enumerate(CIFAR_LABELS):
        if label in file_name:
            cls = i
            break
    if cls == -1:
        raise Exception("Unknown class")
    rgb = np.hstack((rgb,cls))
    print_csv(rgb)
    # pixels = [f[0] for f in list(img.getdata())]
    

    # outfile = glob_files+"out"
    # np.save(outfile, dataset)

def print_csv(row):
    for v in row[:-1]:
        print(v,end=",")
    print(row[-1])

for file in sys.argv[1:]:
    dir_to_dataset(file)