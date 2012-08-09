valor = 0

function handler (evt)
	if evt.class == 'user' then
		print (evt.v)
		if valor < 500 then
			valor = valor + 1
			event.post({class = 'user', v = valor} )
		end
		print ('after post')
	end
end

event.register(handler)
event.post({class = 'user', v = valor} )
