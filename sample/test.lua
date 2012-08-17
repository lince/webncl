canvas:drawLine(0,0,50,50)
canvas:flush()
blender = canvas:new('images/crop.png')


corte = blender:attrCrop(0,0,50,50)
canvas:compose(0,0,corte)
canvas:flush()
