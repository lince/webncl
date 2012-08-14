local x = 0
local END = 50

canvas:attrColor('red')

while x < END do
	canvas:drawRect('fill',x,x,4,4)
	x = x+ 5
	
end