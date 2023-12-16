## HappyGames Project 설정
1. package.json 설정 (/src/main/haapyus_front) <br>
   로컬 - "proxy": "http://14.40.22.144:8081", <br>
   배포 - "proxy": "http://:14.40.22.144:8080",

2. env.production (/src/main/haapyus_fron) <br>
   로컬 - REACT_APP_WEBSOCKET_URL=ws://14.40.22.144:8081/ws <br>
   배포 - REACT_APP_WEBSOCKET_URL=ws://14.40.22.144:8080/ws <br>

3. application.propertis <br>
   로컬- spring.profiles.active=dev <br>
   배포- spring.profiles.active=prod