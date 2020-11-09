rm -rf build
rm -rf build.tar.gz
npm run build
tar -zcvf build.tar.gz build
