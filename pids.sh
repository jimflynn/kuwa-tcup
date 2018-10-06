#!/bin/bash

# This script lists the PIDs of processes listening on ports used by Kuwa/TCUP.
# You may have to sudo this script.
# Use sudo kill -9 to terminate processes if required. 

function show {
   name=''
   if [ "$2" != "" ]
   then
	case $2 in
		3000)
			name="(Sponsor)"
			;;
		3001)
			name="(Sponsor UI)"
			;;
		3002)
			name="(Sponsor)"
			;;
		3003)
			name="(StorageManager)"
			;;
		3005)
			name="(Registrar)"
			;;
		3006)
			name="(Registrar Back-end)"
			;;
		3010)
			name="(Directory)"
			;;
		3011)
			name="(Directory Client)"
			;;
		3015)
			name="(Faucet)"
			;;
		3020)
			name="(BasicIncome)"
			;;
		3021)
			name="(BasicIncome https)"
			;;
		*)
			;;
  	esac
      	echo "PID $1 is on port $2 $name"
   fi
}

echo -e "\nPIDs of processes listening on ports 3000 to 3021:\n"
for i in {3000..3021}
do
    #netstat -ltnp | grep -w "$i" | cut -d 'N' -f 2 | cut -d '/' -f 1 | cut -d ' ' -f 7
    show $(netstat -ltnp | grep -w "$i" | cut -d 'N' -f 2 | cut -d '/' -f 1 | cut -d ' ' -f 7) $i
done
echo ''


