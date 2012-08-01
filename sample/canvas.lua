Canvas = [];

Canvas:attrSize()
	libCanvas.attrSize(self);
	
end

Canvas:attrColor(r, g, b, a, mode)
	libCanvas.attrColor(self, r, g, b, a, mode);
	
end

Canvas:attrClip(x, y, w, h)
	libCanvas.attrClip(self, x, y, w, h);
	
end

Canvas:drawLine(x1, y1, x2, y2)
	libcanvas.drawLine(self, x1, y1, x2, y2)

end

Canvas:drawRect(x, y, w, h)
	libCanvas.drawRect(self, x, y, w, h);

end

Canvas:attrText(face,size,style)
	libCanvas.attrText(self,face,size,style);
	
end

Canvas:drawText(x, y, text)
	libCanvas.drawText(self, x, y, text);
	
end

Canvas:measureText(text)
	libCanvas.measureText(self, text);
	
end

Canvas:attrCrop(ctxDestiny, x, y, w, h)
	libCanvas.attrCrop(self, x, y, w, h);
	
end

Canvas:compose(ctxDestiny)
	libCanvas.compose(self, ctxDestiny);
	
end

canvas = libCanvas.init();
--------------------------------------

canvas:drawLine(0,0,50,50);

