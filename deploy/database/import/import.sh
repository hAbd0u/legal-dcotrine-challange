#!/bin/bash
DB='legal-doctrine'
COLLECTION='laws'

mongoimport --db=$DB --collection=$COLLECTION --drop --file=/data/import/laws.json
