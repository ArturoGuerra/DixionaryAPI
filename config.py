import json

with open('config.json', 'r') as f:
    config = json.load(f)

dbname = config['dbname']
dbuser = config['dbuser']
dbpass = config['dbpass']
dbhost = config['dbhost']
