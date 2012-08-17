canvas:drawLine(0,0,50,50)

blender = canvas:new('images/crop.png')


blender:attrCrop(50,50,100,100)
canvas:compose(0,0,blender)
canvas:flush()
