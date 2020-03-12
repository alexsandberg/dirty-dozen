from flask import Flask, render_template, request, jsonify, abort
from dotenv import find_dotenv, load_dotenv
import requests
from .states import state_center
import xml.etree.ElementTree as ET


def create_app():

    # set up environment variables using dotenv
    ENV_FILE = find_dotenv()
    if ENV_FILE:
        load_dotenv(ENV_FILE)

    app = Flask(__name__)

    def sort_entries(facilities):
        return sorted(facilities, key=lambda facilities: facilities['CO2E_EMISSION'], reverse=True)

    def format_co2_str(facilities):
        for facility in facilities:
            facility['CO2E_EMISSION'] = f"{facility['CO2E_EMISSION']:,}"
        return facilities

    def parent_company_info(id):

        # call API to get parent company info using facility id
        resp = requests.get(
            f'https://data.epa.gov/efservice/V_PARENT_COMPANY_INFO/FACILITY_ID/{id}/json')

        # return json response
        return resp.json()

    def build_epa_api_request(state_code, year, gas_code):
        url = 'https://enviro.epa.gov/enviro/efservice/V_GHG_EMITTER_SECTOR'

        if state_code != 'all':
            url += f'/state/{state_code}'

        if year != 'all':
            url += f'/year/{year}'

        if gas_code != 'all':
            url += f'/GAS_CODE/{gas_code}'

        return url

    @app.route('/')
    def home():
        return render_template('pages/home.html')

    @app.route('/form')
    def form():

        # store data
        state = request.args.get('state')

        if state == 'all':
            state_code = 'all'
            state_name = 'United States'
        else:
            state_code, state_name = state.split('_')

        gas_code = request.args.get('gas')
        year = request.args.get('year')

        # build base API request url
        url = build_epa_api_request(state_code, year, gas_code)

        # get facilities by state and year
        # query starts with high CO2E limit and goes lower if necessary to get top 12
        # limit is higher if searching all states
        if state == 'all':
            limit = 15000000
        else:
            limit = 500000
        while True:

            # get entries count before requesting actual data
            resp = requests.get(f'{url}/CO2E_EMISSION/>/{limit}/count')
            root = ET.fromstring(resp.text)
            count = int(root[0].text)
            print('COUNT: ', count)

            if count < 12:
                limit /= 5
            else:
                resp = requests.get(f'{url}/CO2E_EMISSION/>/{limit}/json')
                facilities = resp.json()
                break

        data = {
            'state': state_code,
            'state_name': state_name,
            'state_geo': state_center[state_code],
            'year': year,
            'gas': gas_code,
            'entries': format_co2_str(sort_entries(facilities)[0:12])
        }

        return render_template('pages/results.html', data=data), 200

    @app.route('/about')
    def about():
        return render_template('pages/about.html')

    return app
