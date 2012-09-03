width, height = canvas:attrSize()

function drawBackGround()
	canvas:attrColor('black')
	canvas:drawRect('fill',0,0,width,height)
end

function drawMessage(text)
	canvas:attrFont('garamond', height/3)
	canvas:attrColor('yellow')
	textSize = canvas:measureText(text)
	beginX = (width-textSize)/2
	beginY = height/3
	canvas:drawText(beginX,beginY, text)
end


function handlerText(evt)
	print (evt)
	if evt.class ~= 'ncl' then return end
    if evt.type ~= 'presentation' then return end
    if evt.action ~= 'start' then return end
    if evt.label == 'luaArea1' then
    	text1()
    elseif evt.label == 'luaArea2' then
    	text2()
    elseif evt.label == 'luaArea3' then
    	text3()
    end
end

function handlerEnd(evt)
	print (evt)
	if evt.class ~= 'ncl' then return end
    if evt.type ~= 'presentation' then return end
    if evt.action ~= 'stop' then return end
    if evt.label ~= 'luaArea3' then end
   	drawBackGround()
   	canvas:flush()
end


function text1()
	drawBackGround()
	drawMessage('This text is being drawed by a Lua Script');
	canvas:flush()
end

function text2()
	drawBackGround()
	drawMessage('And the script is synchronized with the video');
	canvas:flush()
end

function text3()
	drawBackGround()
	drawMessage('Pretty cool, hein?');
	canvas:flush()
end


drawBackGround()
canvas:flush()
event.register(handlerText)
event.register(handlerEnd)
