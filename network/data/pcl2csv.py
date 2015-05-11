import sys
import pickle
import numpy as np




def unpickle(file):
    fo = open(file, 'rb')
    dic = pickle.load(fo)
    fo.close()
    return dic

data = unpickle(sys.argv[1])
print data

ndata = data['data']
labels = np.array(data['labels']).reshape(ndata.shape[0],1)
final = np.hstack((ndata,labels))
# np.savetxt("cifar-10-1", final, delimiter=",")