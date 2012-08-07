
-- RUNNER: guarda a imagem, posicao inicial e dimensoes
local img = canvas:new('runner.png')
local dx, dy = img:attrSize()
local runner = { img=img, frame=0, x=50-dx/2, y=10, dx=dx, dy=dy }

-- Funcao de redesenho:
-- chamada a cada ciclo de animacao
local dx, dy = canvas:attrSize()
local INI, END = 50, dx-58
function redraw ()
	-- fundo
	--canvas:attrColor('black')
	--canvas:drawRect('fill', 0,0, dx,dy)

	-- linha de largada e chegada
	canvas:attrColor('white')
	canvas:drawRect('fill', INI,0, 8,dy)
	canvas:drawRect('fill', END,0, 8,dy)

	-- corredor
	local dx2 = runner.dx/2
    runner.img:attrCrop(runner.frame*dx2,0, dx2,runner.dy)
	canvas:compose(runner.x, runner.y, runner.img)
	canvas:flush()
end

-- Funcao de tratamento de eventos:
function handler (evt)
	-- a animacao comeca no *start* e eh realimentada por eventos da classe *user*
	if (evt.class == 'ncl' and evt.type == 'presentation' and evt.action == 'start') or
	   (evt.class == 'user') then
		local now = event.uptime()

		-- movimenta o corredor caso tempo ja tenha passado
		if evt.time then
			local dt = now - evt.time
			runner.x = runner.x + dt/50
		end

		-- caso nao tenha chegado a linha de chegada, continua dando ciclos a animacao
		if runner.x < END then
			event.post('in', { class='user', time=now })
		end

		-- muda o frame do corredor a cada 5 pixels
		runner.frame = math.floor(runner.x/5) % 2

		redraw()
	end
end

event.register(handler)
