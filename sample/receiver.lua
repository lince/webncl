function on_message(message)
	print (message)
end


broker.init('http://200.18.98.24:8161/demo/amq')
broker.register('topic://test', on_message)
