--print (1+3);
ketEvent = { class='key', type='press', key='BLUE' };
event.post(ketEvent);
persistent.set('teste', 'teste', 5);
a = persistent.get('teste.teste');
print (a);

function handler (evt)
	print('handler in lua called');
	if evt.class == 'ncl' then
		if evt.type == 'presentation' then
			if evt.action == 'start' then
				print ('will post a event');
				event.post {class='ncl', type='presentation', action='stop'};
			end
		end
	end
end

event.register(handler)
