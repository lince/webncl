
local x,y = canvas:attrSize()


blender = canvas:new('images/blender.png')
x,y = blender:attrSize()

canvas:compose(0,0,blender)
blender:attrCrop(0,0,60,60)
canvas:compose(130,0,blender)
blender:attrCrop(0,0,50,50)
canvas:compose(200,45,blender)
canvas:flush()
