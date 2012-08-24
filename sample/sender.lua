function timerFunc(evt)
	time = event.uptime()
	msn = 'Mensagem enviada: ' .. time
	broker.post('topic://test', msn)
	event.timer(200, timerFunc)
end

broker.init('http://lince.dc.ufscar.br/demo/amq')
broker.post('topic://test', 'Primeira Mensagem!')
event.timer(200, timerFunc)
