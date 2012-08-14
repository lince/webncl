local counter = 0
local counterEvt = {
    class = 'ncl',
    type  = 'attribution',
    name  = 'counter',
}

function handler (evt)
    if evt.class == 'user' then
    	print (evt.time)
    end
    
    if evt.class ~= 'ncl' then return end
    if evt.type ~= 'attribution' then return end
    if evt.name ~= 'inc' then return end

    counter = counter + evt.value
    print (counter)
    

    event.post {
        class  = 'ncl',
        type   = 'attribution',
        name   = 'inc',
        action = 'stop',
        value  = counter,
    }

	event.post({class = 'user', time=4})
    counterEvt.value = counter
    counterEvt.action = 'start'; event.post(counterEvt)
    counterEvt.action = 'stop';  event.post(counterEvt)
end

event.register(handler)
