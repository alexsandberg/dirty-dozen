from flask import Flask, render_template, request, jsonify
from dotenv import find_dotenv, load_dotenv
import requests


def create_app():

    # set up environment variables using dotenv
    ENV_FILE = find_dotenv()
    if ENV_FILE:
        load_dotenv(ENV_FILE)

    app = Flask(__name__)

    def sort_entries(facilities):
        return sorted(facilities, key=lambda facilities: facilities['CO2E_EMISSION'], reverse=True)

    def parent_company_info(id):

        # call API to get parent company info using facility id
        resp = requests.get(
            f'https://data.epa.gov/efservice/V_PARENT_COMPANY_INFO/FACILITY_ID/{id}/json')

        # return json response
        return resp.json()

    @app.route('/')
    def home():
        return render_template('pages/home.html')

    @app.route('/form', methods=['POST'])
    def form():

        # get request body
        body = request.get_json()

        # store data
        state = body['state']
        state_name = body['stateName']
        year = body['year']

        # get facilities by state and year
        # query starts with high CO2E limit and goes lower if necessary to get top 12
        limit = 500000
        while True:
            resp = requests.get(
                f'https://enviro.epa.gov/enviro/efservice/V_GHG_EMITTER_SECTOR/state/{state}/CO2E_EMISSION/>/{limit}/year/=/{year}/json')

            facilities = resp.json()

            if len(facilities) < 12:
                limit /= 10
            else:
                break

        data = {
            'state': state,
            'state_name': state_name,
            'year': year,
            'entries': sort_entries(facilities)[0:12]
        }

        print('DATA: ', data)

        return jsonify({
            'success': True,
            'data': data
        })

    return app
