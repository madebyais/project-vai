from sklearn import linear_model

class Regression:

    def calculate(self, values):
        regr = linear_model.LinearRegression()

        # split the values into two series instead a list of tuples
        x, y = zip(*values)
        max_x = max(x)
        min_x = min(x)

        # split the values in train and data.
        train_data_X = map(lambda x: [x], list(x))
        train_data_Y = list(y)

        # feed the linear regression with the train data to obtain a model.
        regr.fit(train_data_X, train_data_Y)

        # check that the coeffients are the expected ones.
        m = regr.coef_[0]
        b = regr.intercept_

        result = {
            'm': m,
            'b': b
        }

        return result

    def predict(self, year, m, b):
        return m * year + b
