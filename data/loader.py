__author__ = 'kmcarbone16'
from PIL import Image
from numpy import genfromtxt
import gzip, cPickle
from glob import glob
import numpy as np
import pandas as pd

width = 300
height = 300

def load_vertices(obj_files):
    objs = []
    print(glob(obj_files))
    for file_count,file_name in enumerate( sorted(glob(obj_files),key=len) ):
        array = []
        with open(file_name, "r") as ins:
            for line in ins:
                params = line.strip().split(" ")
                if len(params) >= 4 and line[0] != "#" and params[0] != "f" and params[0] == 'v':
                    v1,v2,v3 = float(params[1]),float(params[2]),float(params[3])
                    print round(v1),round(v2),round(v3)
                    array.append(v1)
                    array.append(v2)
                    array.append(v2)
                    # f.write(params[0]+" "+str(round(v1))+" "+str(round(v2))+" "+str(round(v3))+"\n")
                # else:
                #     f.write(line)
        objs.append(np.matrix(array))
    return np.array(objs)

def dir_to_dataset(glob_files, loc_train_labels=""):
    print("Gonna process:\n\t %s"%glob_files)
    dataset = []
    for file_count, file_name in enumerate( sorted(glob(glob_files),key=len) ):
        image = Image.open(file_name)
        img = Image.open(file_name).convert('LA') #tograyscale
        img = img.resize((width, height), Image.BILINEAR)
        pixels = [f[0] for f in list(img.getdata())]
        dataset.append(pixels)
        # if file_count % 1000 == 0:
        print("\t %s files processed"%file_count)
    # outfile = glob_files+"out"
    # np.save(outfile, dataset)
    if len(loc_train_labels) > 0:
        df = load_vertices(loc_train_labels)
        return np.array(dataset), np.array(df)
    else:
        return np.array(dataset)
import os
new_path = os.path.join(
    os.path.split(__file__)[0],
    "..",
    "data",
    "*.obj"
)
new_path2 = os.path.join(
    os.path.split(__file__)[0],
    "..",
    "data",
    "*.png"
)
Data, y = dir_to_dataset(new_path2,new_path)
# Data and labels are read

train_set_x = Data[:15]
val_set_x = np.array([])
test_set_x = np.array([])
train_set_y = y[0,0]
print train_set_y.shape

val_set_y = np.array([])
test_set_y = np.array([])
# Divided dataset into 3 parts. I had 6281 images.

train_set = train_set_x, train_set_y
val_set = val_set_x, val_set_y
test_set = test_set_x, val_set_y

dataset = [train_set, val_set, test_set]

f = gzip.open('file.pkl.gz','wb')
cPickle.dump(dataset, f, protocol=2)
f.close()