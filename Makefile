#
# Use
# make CLOSURE_COMPILER=/path/to/closure/compiler.jar
#
# LINCE (c) 2012
# danilod100 at gmail.com
#

CLOSURE_COMPILER=~/bin/compiler.jar
JSPATH=js
SPATH=$(JSPATH)/src
FILES=$(wildcard $(SPATH)/*.js) $(wildcard $(SPATH)/formatter/*.js) $(wildcard $(SPATH)/parser/*.js) $(wildcard $(SPATH)/player/*.js) $(wildcard $(SPATH)/parser/tags/*.js) \
					$(wildcard $(SPATH)/lua/*.js) $(wildcard $(SPATH)/loader/*.js)
MINFILE=$(JSPATH)/webncl.min.js
DEBFILE=$(JSPATH)/webncl.deb.js

all: $(MINFILE) $(DEBFILE)

min: $(MINFILE)
mindeb: $(DEBFILE)

clean:
	rm -rf $(MINFILE)
	rm -rf $(DEBFILE)

$(MINFILE):	$(FILES)
	java -jar $(CLOSURE_COMPILER) --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $(MINFILE) $(FILES)

$(DEBFILE):	$(FILES)
	cat $(FILES) > $(DEBFILE)
