
-- MONKEY: guarda a imagem, posicao inicial e dimensoes
local img = canvas:new('test_lua/exemplo_03/monkey.png')
local dx, dy = img:attrSize()
local monkey = { im=img, x=10, y=10, dx=dx, dy=dy }

-- BANANA: guarda a imagem, posicao inicial e dimensoes
local img = canvas:new('test_lua/exemplo_03/banana.png')
local dx, dy = img:attrSize()
local banana = { im=img, x=150, y=150, dx=dx, dy=dy }

-- Funcao de redesenho:
-- chamada a cada tecla pressionada
-- primeiro o fundo, depois a banana e por fim o macaco
function redraw ()
	canvas:attrColor('black')
	--canvas:drawRect('fill', 0,0, canvas:attrSize()) 
	canvas:compose(banana.x, banana.y, banana.im)
	canvas:compose(monkey.x, monkey.y, monkey.im)
	canvas:flush()
end

-- Funcao de colisao:
-- chamada a cada tecla pressionada
-- checa se o macaco esta em cima da banana
function collide (A, B)
	local ax1, ay1 = A.x, A.y
	local ax2, ay2 = ax1+A.dx, ay1+A.dy
	local bx1, by1 = B.x, B.y
	local bx2, by2 = bx1+B.dx, by1+B.dy

	if ax1 > bx2 then
		return false
	elseif bx1 > ax2 then
		return false
	elseif ay1 > by2 then
		return false
	elseif by1 > ay2 then
		return false
	end

	return true
end

local IGNORE = false

-- Funcao de tratamento de eventos:
function handler (evt)
	if IGNORE then
		return
	end

	-- apenas eventos de tecla me interessam
	if evt.class == 'key' and evt.type == 'press'
	then
		-- apenas as setas movem o macaco
		if evt.key == 'CURSOR_UP' then
			monkey.y = monkey.y - 10
		elseif evt.key == 'CURSOR_DOWN' then
			monkey.y = monkey.y + 10
		elseif evt.key == 'CURSOR_LEFT' then
			monkey.x = monkey.x - 10
		elseif evt.key == 'CURSOR_RIGHT' then
			monkey.x = monkey.x + 10
		end

        -- testa se o macaco esta em cima da banana
		if collide(monkey, banana) then
			-- caso esteja, sinaliza que a ancora de FIM esta ocorrendo
			event.post {
                class  = 'ncl',
                type   = 'presentation',
                label  = 'fim',
                action = 'start',
            }
			-- e ignora os eventos posteriores
			IGNORE = true
		end
	end

    -- redesenha a tela toda
    redraw()
end

event.register(handler)
