print(canvas:measureText("teste"));
canvas:drawText(0,0, "teste");
canvas:drawLine(20,20, 100, 100);
canvas:attrColor('aqua', 0.5);
canvas:drawRect("fill",20,20, 150, 150);

canvas:drawRect("frame", 40,40, 100, 100);
canvas:attrClip(50,50,100,100);
canvas:drawLine(0,0, 200, 200);

