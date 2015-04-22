
import numpy as np

minx = 999999
maxx = -999999

miny = 999999
maxy = -999999

minz = 999999
maxz = -999999




vertices = []
verts = []

import sys



with open(sys.argv[1], "r") as ins:
    array = []
    ctr = 0
    for line in ins:
        params = line.strip().split(" ")
        print(ctr)
        if len(params) > 0 and params[0] == "v":
            v1,v2,v3 = float(params[1]),float(params[2]),float(params[3])
            minx = min(v1,minx)
            maxx = max(v1,maxx)

            miny = min(v2,minx)
            maxy = max(v2,maxx)

            minz = min(v3,minx)
            maxz = max(v3,maxx)
            verts.append(np.array([v1,v2,v3]))
            vertices.append((params[0],[v1,v2,v3]))
            print("params",params)
            # print round(v1),round(v2),round(v3)
            # f.write(params[0]+" "+str(round(v1))+" "+str(round(v2))+" "+str(round(v3))+"\n")
        else:
            print "line",line
            vertices.append(("l",line))
            # f.write(line)
        ctr += 1
    ins.close()
print ctr,"lines read"
verts = np.array(verts)
center = np.mean(verts[:,-3:], axis=0)
maxd = max((maxx - minx),(maxy - miny),(maxz - minz))
center[0] = (center[0] - minx)/maxd
center[1] = (center[1] - miny)/maxd
center[2] = (center[2] - minz)/maxd
scale = 100
center *= scale
print center

with open(sys.argv[2],"w") as f:
        # array = []
        # ctr = 0
        # for line in ins:
        #     params = line.strip().split(" ")
        #     print(ctr)
        #     if len(params) >= 4 and line[0] != "#" and params[0] != "f":

        #         vertices.pop(0)
        #         # print round(v1),round(v2),round(v3)
        #         f.write(params[0]+" "+str(round(v1))+" "+str(round(v2))+" "+str(round(v3))+"\n")
        #     else:
        #         # f.write(line)
        #     ctr += 1
    for l in vertices:
        if l[0] == "v":

            nx = (l[1][0] - minx)/maxd
            ny = (l[1][1] - miny)/maxd
            nz = (l[1][2] - minz)/maxd
            nx *= scale
            ny *= scale
            nz *= scale
            f.write(l[0]+" "+str(nx-center[0])+" "+str(ny-center[1])+" "+str(nz-center[2])+"\n")
        else:
            f.write(l[1])

    f.close()
