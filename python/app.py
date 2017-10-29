import config
from flask import Flask, request

from __customlib.database import Database
from __customlib.file import File
from __customlib.regression import Regression

from __modules.income import Income
from __modules.wealth import Wealth
from __modules.general import General

from __controllers.upload import Upload
from __controllers.data import Data

# initialize database
db = Database(config.DATABASE[u'user'],
    config.DATABASE[u'password'],
    config.DATABASE[u'host'],
    config.DATABASE[u'dbname'])

# migrata database
db.migrate()

# initialize custom libs
clib_file = File()
clib_regression = Regression()

# initialize several modules
income = Income(db)
wealth = Wealth(db)
general = General(db)

# init modules variable and register to controller if needed
modules = {
    'income': income,
    'wealth': wealth,
    'general': general
}

# initialize controller
ctrl_upload = Upload(modules)
ctrl_data = Data(modules)

# configure flask
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER

# define all available routes
@app.route('/upload', methods=['POST'])
def upload():
    params = {
        'request': request,
        'upload_folder': app.config['UPLOAD_FOLDER'],
        'lib_file': clib_file
    }

    return ctrl_upload.submit_file(params)

@app.route('/top-10', methods=['GET'])
def top_10():
    params = {
        'request': request,
        'type': 10
    }

    return ctrl_data.retrieve(params)

@app.route('/bottom-50', methods=['GET'])
def bottom_50():
    params = {
        'request': request,
        'type': 50
    }

    return ctrl_data.retrieve(params)

@app.route('/wealth-inequality', methods=['GET'])
def wealth_inequality():
    params = {
        'request': request,
        'type': 'wealth'
    }

    return ctrl_data.inequality(params)

@app.route('/income-inequality', methods=['GET'])
def income_inequality():
    params = {
        'request': request,
        'type': 'income'
    }

    return ctrl_data.inequality(params)

@app.route('/saving-capacity', methods=['POST'])
def saving_capacity():
    params = {
        'request': request
    }

    return ctrl_data.saving_capacity(params)

@app.route('/predict-wealth', methods=['POST'])
def predict_wealth():
    params = {
        'request': request,
        'type': 'wealth',
        'regression': clib_regression
    }
    return ctrl_data.prediction(params)

@app.route('/predict-income', methods=['POST'])
def predict_income():
    params = {
        'request': request,
        'type': 'income',
        'regression': clib_regression
    }
    return ctrl_data.prediction(params)

if __name__ == '__main__':
    app.run()
