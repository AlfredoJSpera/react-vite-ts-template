#!/bin/bash

# This script replaces specific theme-related files with their counterparts from a "WithoutCustomThemes" directory. 
# It's a quick alternative to replacing the files manually.

# Exit if any command fails
set -e

replaced_files=()

replace_files() {
	local file_location=$1
	local file_name=$2
	local file_to_replace="${file_location}/${file_name}"
	
	echo -e "\033[32m[Replacing file] ${file_to_replace}\033[0m"
	rm -f "${file_to_replace}"
	mv "${file_location}/WithoutCustomThemes/${file_name}" "${file_to_replace}"
	
	replaced_files+=("${file_to_replace}")
	
	if [ -d "${file_location}/WithoutCustomThemes" ] && [ ! "$(ls -A "${file_location}/WithoutCustomThemes")" ]; then
		echo -e "\033[34m[Deleting directory] ${file_location}/WithoutCustomThemes\033[0m"
		rmdir "${file_location}/WithoutCustomThemes"
	fi
}

echo -e "Removing user-defined theming functionality..."
echo -e "\033[31mWARNING: This script is intended to be run only once, immediately after cloning the repository.\033[0m"
echo -e "\033[31mIf you have made changes to any of the listed files, do NOT run this script. Please apply changes manually instead.\033[0m"
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
	echo "Aborted."
	exit 1
fi

#? MANUAL CHANGES: Replace these files with their counterpart without custom themes in the /WithoutCustomThemes directories
replace_files ./public theme-loader.js
replace_files ./src/components ThemeSwitcher.tsx
replace_files ./src/hooks useTheme.ts
replace_files ./src/hooks useThemeContext.ts
replace_files ./src/theme ThemeContext.ts
replace_files ./src/theme ThemeProvider.tsx

#? MANUAL CHANGES: Update imports for all changed files (remove one `../` and `WithoutCustomThemes/` from imports)
for file in "${replaced_files[@]}"; do
	# Regex for the imports:
	# `../../*;` --> `../*;`
	# `/WithoutCustomThemes/*;` --> `/*;`
	echo -e "\033[33m[Updating imports] ${file}\033[0m"
	sed -i -E "s|\.\./\.\./([^;]*);|../\1;|g; s|/WithoutCustomThemes/([^;]*);|/\1;|g" "${file}"
done

echo -e "Done! Remember to delete this script!"