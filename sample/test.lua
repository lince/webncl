crop = canvas:new('images/crop.png')
--cima
crop:attrCrop(0,0,50,50)
canvas:compose(30,0,crop)

crop:attrCrop(50,0,50,50)
canvas:compose(30,10,crop)

crop:attrCrop(0,0,50,50)
canvas:compose(30,20,crop)
------------------------
--esquerda
crop:attrCrop(0,0,50,50)
canvas:compose(0,30,crop)

crop:attrCrop(50,0,50,50)
canvas:compose(10,30,crop)

crop:attrCrop(0,0,50,50)
canvas:compose(20,30,crop)
------------------------
--centro
crop:attrCrop(50,0,50,50)
canvas:compose(30,30,crop)
--------------------------
canvas:flush()
