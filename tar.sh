#!/bin/sh
# Copyright Eric Moynihan
cd ./release/linux-unpacked
tar -cvzf ../newlogic-linux-$1.tar.gz *
