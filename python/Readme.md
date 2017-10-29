INEQUALITY CALCULATOR
---------------------

### REQUIREMENTS

Please make sure that you have `Python 2.7.10` in your system.

```
$ sudo pip install --egg -t . mysql-connector-python-rf
$ sudo pip install -t . Flask
$ sudo pip install -t . numpy scipy scikit-learn
```

### HOW-TO

1. Please make sure that all packages have been installed.
2. Change database config in `database.py` according to your environment
3. Start the application by running this command `python app.py`, the application will listen to port `:5000`.

### FEATURES

```
POST  /upload                   | POST  http://localhost:5000/upload   
GET   /top-10                   | GET   http://localhost:5000/top-10
GET   /bottom-50                | GET   http://localhost:5000/bottom-50
GET   /wealth-inequality        | GET   http://localhost:5000/wealth-inequality
GET   /income-inequality        | GET   http://localhost:5000/income-inequality
POST  /saving-capacity          | POST  http://localhost:5000/saving-capacity
POST  /predict-wealth           | POST  http://localhost:5000/predict-wealth
POST  /predict-income           | POST  http://localhost:5000/predict-income
```
