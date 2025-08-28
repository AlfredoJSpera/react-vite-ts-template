#!/bin/bash

# This script removes specific extension-related files and edits vite.config.ts to not load the content script on build. 
# It's a quick alternative to replacing/editing the files manually.

# Exit if any command fails
set -e

delete_file() {
	local file_to_delete=$1
	echo -e "\033[32m[Deleting file] ${file_to_delete}\033[0m"
	rm -f "${file_to_delete}"
}

echo -e "Removing firefox extension functionality..."
echo -e "\033[31mWARNING: This script is intended to be run only once, immediately after cloning the repository.\033[0m"
echo -e "\033[31mIf you have made changes to any of the listed files, do NOT run this script. Please apply changes manually instead.\033[0m"
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
	echo "Aborted."
	exit 1
fi

#? MANUAL CHANGES: Delete the following files
delete_file src/components/DisplayH1sInPage.tsx
delete_file src/utils/sendContentScriptMessage.ts
delete_file src/types/contentScriptTypes.ts
delete_file src/contentScript.ts
delete_file public/manifest.json

echo -e "\033[34m[Removing npm package] @types/firefox-webext-browser\033[0m"
npm remove @types/firefox-webext-browser

echo -e "\033[33m[Updating file] vite.config.ts\033[0m"
if [ -f vite.config.ts ]; then
	#? MANUAL CHANGES: Remove the lines between the comments "Browser Content Script Only" and "---------------------"
	sed -i '/\/\/! Browser Content Script Only/,/\/\/! ---------------------/d' vite.config.ts
else
	echo "[ERROR]vite.config.ts not found."
fi

echo -e "Done! Remember to delete this script!"
