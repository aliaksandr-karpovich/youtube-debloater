NAME    := youtube-subscriptions-cleaner
VERSION := $(shell jq -r .version manifest.json)
BUILD   := build
ZIP     := $(BUILD)/$(NAME)-v$(VERSION).zip
FILES   := manifest.json content.js styles.css icon48.png icon128.png

.PHONY: package clean

package: $(ZIP)

$(ZIP): $(FILES) | $(BUILD)
	rm -f $@
	zip -j $@ $(FILES)

$(BUILD):
	mkdir -p $@

clean:
	rm -rf $(BUILD)