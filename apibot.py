from japronto import Application
from models import *
import logging
import json
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('dixionaryapi')

async def dixionary(request):
    try:
        full_string = False
        logger.info(f"Request Address: {request.remote_addr}")
        logger.debug(f"Route used: {request.route}")
        logger.debug(request.headers)
        if "Full_String" in request.headers:
            if request.headers['Full_String'].lower() == 'true':
                full_string = True
        message = request.text
        if isinstance(message, str):
            logger.info(f"Request Info: {message}")
            splitmsg = message.split(' ')
            return_message = list()
            for word in splitmsg:
                try:
                    vord = Dixionary.get(Dixionary.word == word.lower()).vord
                except:
                    vord = None
                if vord:
                    idx = splitmsg.index(word)
                    splitmsg[idx].replace(word, vord)
                    return_message.append(vord)
            if len(return_message) > 0:
                logger.info(f"Sending: {return_message}")
                if full_string:
                    return request.Response(code=200, json=splitmsg, encoding='utf-8')
            return request.Response(code=200, json=return_message, encoding='utf-8')
        else:
            return request.Response(code=400)
    except Exception as e:
        logger.error(e)
        return request.Response(code=406)
async def add_vord(request):
    logger.info(request.text)

async def remove_vord(request):
    logger.info(request.text)

app = Application()
router = app.router
router.add_route("/dixionary", dixionary, method='GET')
router.add_route("/dixionary/addvord/{key}", add_vord, method='POST')
router.add_route("/dixionary/addvord/{key}", remove_vord, method='DELETE')

app.run()
