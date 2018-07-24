#!/usr/bin/expect -f
exec rm -rf cordovaClient/www >@stdout
exec npm run build >@stdout
spawn ssh carlos@alpha.kuwa.org
expect "assword:"
send "#changethisfirst\r"
expect "$"
send  "rm -rf /var/www/html/client/*\r"
expect "$"
send "exit\r"
expect "$"

spawn scp -r cordovaClient/www/. carlos@alpha.kuwa.org:/var/www/html/client
expect "assword:"
send "#changethisfirst\r"
expect "$"