h, w = canvas:attrSize()
print (h)


blender = canvas:new('images/blender.png')

canvas:compose(100,100,blender)