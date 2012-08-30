local number = ''
local width, height = canvas:attrSize()
local inputLabel = 'How old are you?'
local cursor = true
local isInput = true

function isnan(value)
	return value ~= value
end
function drawInput()
	-- draw background
	canvas:attrColor('gray')
	canvas:drawRect('fill',0,0,width,height)
	
	-- draw 'label'
	canvas:attrFont('vera', height/3)
	canvas:attrColor('black')
	textSize = canvas:measureText(inputLabel)
	beginX = width*0.03
	beginY = height/3
	canvas:drawText(beginX,beginY, inputLabel)
	
	-- draw 'text box'
	canvas:attrColor('black')
	beginX = (textSize+beginX)*1.05
	beginY = height/4
	canvas:drawRect('fill', beginX, beginY, width*0.95 -beginX, height/1.8)
	canvas:attrColor('white')
	canvas:drawRect('fill', beginX+4, beginY+4, width*0.95 -beginX-8, height/1.8 -8)
	
	-- draw text inside the text box
	canvas:attrColor('black')
	canvas:attrFont('times', height/3)
	beginX = beginX*1.03
	beginY = height/3
	local text = number
	if cursor == true then
		text = text  .. '|'
	end
	canvas:drawText(beginX,beginY, text)
	
end

function drawOutput()
	canvas:attrColor('gray')
	canvas:drawRect('fill',0,0,width,height)
	
	-- draw 'label'
	canvas:attrFont('vera', height/3)
	canvas:attrColor('black')
	local text = 'So, you are ' .. number .. ' years old.'
	textSize = canvas:measureText(text)
	beginX = (width-textSize)/2
	beginY = height/3
	canvas:drawText(beginX,beginY, text)
end

function cursorTimer()
	cursor = not cursor
	if isInput then
		drawInput()
		canvas:flush()
		event.timer(1000, cursorTimer)
	end
end

function handlerKey(evt)
	if evt.class ~= 'key' then return end
    if evt.type ~= 'press' then return end
    local key = _G.tonumber(evt.key)
    if not isnan(key) then
    	number = number .. key
   		print (number)
    elseif evt.key == 'ENTER' then
    	isInput = false
    	drawOutput()
    	canvas:flush()
    	event.post({class='ncl', type='attribution', action='start', name='age', value=number})
    	event.post({class='ncl', type='attribution', action='stop', name='age', value=number})
    end
end

drawInput()
canvas:flush()
event.register(handlerKey)
event.timer(1000, cursorTimer)