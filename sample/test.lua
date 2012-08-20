
local x,y = canvas:attrSize()
print (x)

blender = canvas:new('images/blender.png')
x,y = blender:attrSize()
print (x)
canvas:compose(0,0,blender)
blender:attrCrop(49,45,102,96)
canvas:compose(120,45,blender)
canvas:compose(150,45,blender)
canvas:flush()
