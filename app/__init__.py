from flask import Flask, render_template, request, jsonify
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

    @app.route('/form', methods=['POST'])
    def form():

        # get request body
        body = request.get_json()

        # store data
        state = body['state']
        year = body['year']

        return jsonify(body)

    return app
