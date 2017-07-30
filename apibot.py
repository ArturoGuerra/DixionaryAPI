from flask import *
from models import *
import logging
import json
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('dixionaryapi')
app = Flask(__name__)

def dixionary():
    try:
        full_string = False
        logger.info(f"Request Address: {request.remote_addr}")
        if "Full_String" in request.headers:
            if request.headers['Full_String'].lower() == 'true':
                full_string = True
        try:
            message = request.data.decode("utf-8")
        except Exception as e:
            logger.error(e)
            message = None
        if isinstance(message, str):
            logger.info(f"Request Info: {message}")
            splitmsg = str(message).split(' ')
            return_message = list()
            full_return_msg = list()
            for word in splitmsg:
                try:
                    vord = Dixionary.get(Dixionary.word == word.lower()).vord
                except:
                    vord = None
                if vord:
                    full_return_msg.append(vord)
                    return_message.append(vord)
                else:
                    full_return_msg.append(word)

            if len(return_message) > 0:
                if full_string:
                    logger.info(f"Sending: {full_return_msg}")
                    return jsonify(full_return_msg)
            logger.info(f"Sending: {return_message}")
            return jsonify(return_message)
        else:
            abort(400)
    except Exception as e:
        logger.error(e)
        abort(406)

def add_vord():
    logger.info(request.data)

def remove_vord():
    logger.info(request.data)

def list_vords():
    try:
        apikey = Apikeys.select().where(Apikeys.apikey == request.text)
    except Exception:
        apikey = None
    if not apikey:
        abort(404)
    vords = list(Dixionary.select())
    vord_list = dict()
    for vord in vords:
        vord_list[vord.vord] = vord.word
    return jsonify(vord_list)

app.add_url_rule("/dixionary", view_func=dixionary, methods=['GET'])
app.add_url_rule("/dixionary/vords", view_func=list_vords, methods=['GET'])
app.add_url_rule("/dixionary/addvord/{key}", view_func=add_vord, methods=['POST'])
app.add_url_rule("/dixionary/delvord/{key}", view_func=remove_vord, methods=['DELETE'])
