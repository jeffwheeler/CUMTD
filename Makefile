# This Makefile very closely based off of the WebOS Makefile written by Avdi
# Grimm at http://avdi.org/devblog/2009/10/17/my-webos-makefile/. I learned a
# decent amount reproducing it; thanks!

APPNAME      = com.jeffwheeler.cumtd
VERSION      = 1.0.2
DEVICE       = emulator
PACKAGEFILE  = $(APPNAME)_$(VERSION)_all.ipk
M4           = m4
PACKAGE      = palm-package
INSTALL      = palm-install
INSTALLFLAGS = -d $(DEVICE)
LAUNCH       = palm-launch
LAUNCHFLAGS  = $(INSTALLFLAGS)

default: package

package: $(PACKAGEFILE)

install: package
	$(INSTALL) $(INSTALLFLAGS) $(PACKAGEFILE)

remove:
	$(INSTALL) $(INSTALLFLAGS) --remove $(APPNAME)

launch: install
	$(LAUNCH) $(LAUNCHFLAGS) $(APPNAME)

$(PACKAGEFILE): appinfo.json framework_config.json app/*/*/* app/*/* stylesheets/*.css icon.png index.html sources.json stops.js
	$(PACKAGE) $(PACKAGEFLAGS) .

stops.js: dump/stops.html scripts/format_stops.py
	python scripts/format_stops.py < $< > $@

appinfo.json: appinfo.json.m4 Makefile
	$(M4) $(M4FLAGS) -DAPPNAME=$(APPNAME) -DVERSION=$(VERSION) $< > $@

