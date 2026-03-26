#!/usr/bin/env bash
set -e

node generate_pdf.js
git add -A
git reset "$(git commit-tree HEAD^{tree} -m "Add CV")"
git push --force
echo "Done. Branch reset to a single commit: 'Add CV'"
