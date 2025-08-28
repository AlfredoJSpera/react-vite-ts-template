#!/bin/bash

# This script removes all directories called "WithoutCustomThemes".
# It's a quick alternative to deleting the files manually.

# Exit if any command fails
set -e

delete_directory() {
	local directory_to_delete=$1
	echo -e "\033[32m[Deleting directory] ${directory_to_delete}/WithoutCustomThemes\033[0m"
	rm -rf "${directory_to_delete}/WithoutCustomThemes"
}

echo -e "Removing only predefined themes functionality..."
echo -e "\033[31mWARNING: This script is intended to be run only once, immediately after cloning the repository.\033[0m"
echo -e "\033[31mIf you have made changes to any of the listed files, do NOT run this script. Please apply changes manually instead.\033[0m"
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
	echo "Aborted."
	exit 1
fi

#? MANUAL CHANGES: Delete the "/WithoutCustomThemes" directories in these paths
delete_directory ./public
delete_directory ./src/components
delete_directory ./src/hooks
delete_directory ./src/theme

echo -e "Done! Remember to delete this script!"

