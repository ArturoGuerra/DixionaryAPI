from apibot import app, logger

if __name__ == "__main__":
    logger.info("Debug Mode")
    app.run(host="0.0.0.0", port="8080", debug=True)
