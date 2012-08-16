h, w = canvas:attrSize()
print (h)

canvas:drawRect('frame', 0,0,498,498)
blender = canvas:new('images/blender.png')

canvas:compose(100,100,blender)

canvas:flush()