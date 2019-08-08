echo [-- Shutdown Tomcat Server --]
/home/inferno/Tomcat/bin/shutdown.sh

echo [-- Compile Assets --]
java -jar /home/inferno/dev/NoxioAsset/dist/NoxioAssetConverter.jar shaders /home/inferno/dev/NoxioAsset/asset/shader/
java -jar /home/inferno/dev/NoxioAsset/dist/NoxioAssetConverter.jar materials /home/inferno/dev/NoxioAsset/asset/material/
java -jar /home/inferno/dev/NoxioAsset/dist/NoxioAssetConverter.jar models /home/inferno/dev/NoxioAsset/asset/model/

echo [-- Run Verfire --]
java -jar /home/inferno/dev/NoxioAsset/dist/NoxioAssetConverter.jar verfire /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/util/verfire.js /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/index.html

echo [-- Copy Assets --]
rm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/shader.js
rm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/material.js
rm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/model.js
rm -r /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/img/game/*
rm -r /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/audio/*
cd /home/inferno/dev/NoxioAsset/asset/texture/
find . -iname '*.png' | cpio -pdm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/img/game
cd /home/inferno/dev/NoxioAsset/asset/audio/
find . -iname '*.wav' | cpio -pdm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/audio
cd /home/inferno/dev/NoxioAuth
cp /home/inferno/dev/NoxioAsset/asset/shader.js /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/shader.js
cp /home/inferno/dev/NoxioAsset/asset/material.js /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/material.js
cp /home/inferno/dev/NoxioAsset/asset/model.js /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/model.js

echo [-- Build WAR --]
mvn clean install

echo [-- Copy WAR --]
rm /home/inferno/Tomcat/webapps/nxc.war
cp /home/inferno/dev/NoxioAuth/noxioauth-core/target/NoxioAuth-1.0.war /home/inferno/Tomcat/webapps/nxc.war

echo [-- Start Tomcat Server --]
/home/inferno/Tomcat/bin/startup.sh

