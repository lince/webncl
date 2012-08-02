print(canvas:measureText("teste"));
canvas:drawText(0,0, "teste");
canvas:drawLine(20,20, 100, 100);
canvas:attrColor(255,0,0,1);
canvas:drawRect("fill",20,20, 100, 100);
canvas:attrColor('blue',0.8);
canvas:drawRect("frame", 40,40, 100, 100);
canvas:attrClip(50,50,100,100);
canvas:drawLine(0,0, 200, 200);

