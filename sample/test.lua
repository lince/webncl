h, w = canvas:attrSize()
print (h)
canvas:drawLine(0,0,50,50)

valor = 0

function handler (evt)
	if evt.class == 'user' then
		print (evt.v)
		if valor < 10 then
			valor = valor + 1
			event.post({class = 'user', v = valor} )
		end
		print ('after post')
	end
end

event.register(handler)
event.post({class = 'user', v = valor} )
