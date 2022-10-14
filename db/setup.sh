psql -f install.sql -U postgres
PGPASSWORD=101601630 psql -d node2022 -f structure.sql -U mr
PGPASSWORD=101601630 psql -d node2022 -f data.sql -U mr
