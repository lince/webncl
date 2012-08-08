valor = 0

function handler (evt)
	if evt.class == 'user' then
		print (evt.v)
		valor = valor + 1
		event.post({class = 'user', v = valor} )
		print ('after post')
	end
end

event.register(handler)
event.post({class = 'user', v = valor} )
