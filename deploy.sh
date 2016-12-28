echo [-- Shutdown Tomcat Server --]
/home/inferno/Tomcat/bin/shutdown.sh

echo [-- Build WAR --]
mvn clean install

echo [-- Copy WAR --]
rm /home/inferno/Tomcat/webapps/noxioauth.war
cp noxioauth-core/target/NoxioAuth-1.0.war /home/inferno/Tomcat/webapps/noxioauth.war

echo [-- Start Tomcat Server --]
/home/inferno/Tomcat/bin/startup.sh

