from flask import Flask, render_template
from dotenv import find_dotenv, load_dotenv


def create_app():

    # set up environment variables using dotenv
    ENV_FILE = find_dotenv()
    if ENV_FILE:
        load_dotenv(ENV_FILE)

    app = Flask(__name__)

    @app.route('/')
    def home():
        return render_template('pages/home.html')

    return app
