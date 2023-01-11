#!/bin/bash

# Location of the script
ME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# assume we are in buildScripts
ROOT_DIR="$( dirname "$ME_DIR" )"

cd "${ROOT_DIR}/src-diagrams"

# find all mermaid files in this directory
for diagram in $(ls -1 *.mmd*) ; do

    # create the output name (everything before .mmd)
    outputName=$(basename ${diagram/\.mmd*//} )

    # build the png from the mermaid diagrams
    npx mmdc --scale 2 --input ${diagram} \
      --outputFormat png \
      --output "${ROOT_DIR}/docs-other/diagrams/${outputName}.png"
done
