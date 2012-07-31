canvas = [];

canvas:attrSize()
	libCanvas.attrSize(self);
	
end

canvas:attrColor(r, g, b, a, mode)
	libCanvas.attrColor(self, r, g, b, a, mode);
	
end

canvas:attrClip(x, y, w, h)
	libCanvas.attrClip(self, x, y, w, h);
	
end

canvas:drawLine(x1, y1, x2, y2)
	libcanvas.drawLine(self, x1, y1, x2, y2)

end

canvas:drawRect(x, y, w, h)
	libCanvas.drawRect(self, x, y, w, h);

end

canvas:attrText(face,size,style)
	libCanvas.attrText(self,face,size,style);
	
end

canvas:drawText(x, y, text)
	libCanvas.drawText(self, x, y, text);
	
end

canvas:measureText(text)
	libCanvas.measureText(self, text);
	
end

canvas:attrCrop(ctxDestiny, x, y, w, h)
	libCanvas.attrCrop(self, x, y, w, h);
	
end

canvas:compose(ctxDestiny)
	libCanvas.compose(self, ctxDestiny);
	
end

canvas = libCanvas.init(ctx);
--------------------------------------

