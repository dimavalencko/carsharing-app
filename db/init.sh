#!/bin/bash
set -e

echo "🚀 Starting database initialization in Docker..."
echo "=================================================="

until pg_isready -U postgres -h localhost; do
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 2
done

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    \i /docker-entrypoint-initdb.d/init-all-databases.sql;
EOSQL

echo "✅ All databases created successfully!"
echo "=================================================="