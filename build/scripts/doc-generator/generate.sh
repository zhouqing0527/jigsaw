#!/bin/bash
scriptDir=$(cd `dirname $0`; pwd);
home=$scriptDir/../../..
output=$1

if [ "$output" == "" ]; then
    echo "ERROR: need an output dir"
    exit 1
fi
mkdir -p $output

# if output is not an absolute dir...
cd $output
output=`pwd`

compodoc -V >/dev/null
if [ "$?" != "0" ]; then
    npm install -g @compodoc/compodoc@1.0.9
fi

cd $home
rm -fr $output/documentation.json $output/fragments
compodoc src/jigsaw -p tsconfig.json --silent --disableSourceCode --disableGraph \
    --disableCoverage --disablePrivate --disableInternal --disableLifeCycleHooks \
    --disableRoutesGraph --exportFormat json --output $output
if [ "$?" != "0" ]; then
    echo "ERROR: cannot generate documentation(json)!"
    exit 1
fi

cd $scriptDir
node json-parser.js $output
if [ "$?" != "0" ]; then
    echo "ERROR: parse documentation error!"
    exit 1
fi

node comp-data-relationship-svg-parser.js
if [ "$?" != "0" ]; then
    echo "ERROR: component data relationiship error!"
    exit 1
fi