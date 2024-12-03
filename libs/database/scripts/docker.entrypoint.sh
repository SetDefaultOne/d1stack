#!/bin/sh

SERVERS_JSON_PATH="/pgadmin4/servers.json"

cat << EOF > $SERVERS_JSON_PATH
{
    "Servers": {
        "1": {
            "Name": "postgres",
            "Group": "Servers",
            "Host": "postgres",
            "Port": 5432,
            "MaintenanceDB": "postgres",
            "Username": "${POSTGRES_USER}",
            "SSLMode": "prefer"
        }
    }
}
EOF

exec /entrypoint.sh
