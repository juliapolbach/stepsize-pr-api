FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE stepsize

ADD 00-init.sh /docker-entrypoint-initdb.d/
ADD 01-schema.sql /scripts/
ADD 02-insert-data.sql /scripts/
