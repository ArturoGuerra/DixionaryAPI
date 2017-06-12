import json

class Config():
    def __init__(self):
       with open('config.json', 'r') as f:
        self.__config = json.load(f)
    @property
    def dbname(self):
        return self.__config['dbname']
    @property
    def dbuser(self):
        return self.__config['dbuser']
    @property
    def dbpass(self):
        return self.__config['dbpass']
    @property
    def dbhost(self):
        return self.__config['dbhost']
