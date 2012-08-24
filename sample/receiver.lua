function on_message(message)
	w, h = canvas:attrSize()
	canvas:attrColor ('black', 1)
	canvas:drawRect('fill', 0, 0, w, h) 
	canvas:attrColor ('white', 1)
	print ('Mensagem:' .. message)
	canvas:drawText(0,0, message)
	canvas:flush()
end


broker.init('http://lince.dc.ufscar.br/demo/amq')
broker.register('topic://test', on_message)
