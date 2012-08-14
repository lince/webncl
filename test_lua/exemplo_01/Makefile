all:
	markdown README > tmp.html
	cat ../header.html tmp.html > ../../out/tutorial/exemplo_01.html
	rm tmp.html
	cp state.png ../../out/tutorial/
	cd .. ; zip -r ../out/tutorial/exemplo_01.zip exemplo_01/ -x \*.swp -x *Makefile
