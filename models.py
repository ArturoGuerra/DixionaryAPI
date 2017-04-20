from peewee import *
import pymysql
import config

my_db = MySQLDatabase(
    config.dbname,
    host=config.dbhost,
    port=3306,
    user=config.dbuser,
    password=config.dbpass,
    charset='utf8mb4')
class BaseModel(Model):
    class Meta:
        database = my_db
class Apikeys(BaseModel):
    apikey = CharField(null=False, primary_key=True)
    keyowner = CharField(null=False)

class Dixionary(BaseModel):
    word = CharField(null=False, primary_key=True)
    vord = CharField(null=False)
