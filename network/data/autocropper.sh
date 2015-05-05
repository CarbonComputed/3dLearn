#!/bin/sh

ctr=0
for file in $*
do
    dir=$(dirname "${file}")
    echo "Cropping" $file "$dir/$ctr-000.png"
    convert -trim -border 10x10x10x10 $file "$dir/$ctr-000.png"
    ((ctr++))
done