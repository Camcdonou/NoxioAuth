echo [-- Shutdown Tomcat Server --]
/home/inferno/Tomcat/bin/shutdown.sh

echo [-- Compile Assets --]
java -jar /home/inferno/dev/NoxioAsset/dist/NoxioAssetConverter.jar shaders /home/inferno/dev/NoxioAsset/asset/shader/
java -jar /home/inferno/dev/NoxioAsset/dist/NoxioAssetConverter.jar models /home/inferno/dev/NoxioAsset/asset/model/basic/

echo [-- Copy Assets --]
rm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/shader.js
rm /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/basic.js
cp /home/inferno/dev/NoxioAsset/asset/shader.js /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/shader.js
cp /home/inferno/dev/NoxioAsset/asset/model/basic.js /home/inferno/dev/NoxioAuth/noxioauth-core/src/main/webapp/js/app/game/asset/basic.js

echo [-- Build WAR --]
mvn clean install

echo [-- Copy WAR --]
rm /home/inferno/Tomcat/webapps/noxioauth.war
cp /home/inferno/dev/NoxioAuth/noxioauth-core/target/NoxioAuth-1.0.war /home/inferno/Tomcat/webapps/noxioauth.war

echo [-- Start Tomcat Server --]
/home/inferno/Tomcat/bin/startup.sh

