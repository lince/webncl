function handler (evt)
	event.post {
        class  = 'ncl',
        type   = 'presentation',
        action = 'stop',
    }
end

event.register(handler)
