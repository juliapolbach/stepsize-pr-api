#!/usr/bin/env bash

mysql -u root -proot stepsize < /scripts/01-schema.sql
mysql -u root -proot stepsize < /scripts/02-insert-data.sql
