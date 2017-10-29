from flask import json

class Data:

    def __init__(self, modules):
        self.modules = modules

    def check_year(self, init, end):
        if init is None or end is None:
            return False
        return True

    def generate_year(self, init, end):
        init_year = int(init)
        end_year = int(end)

        list_year = []
        while (init_year <= end_year):
            list_year.append(init_year)
            init_year = init_year + 1

        return list_year

    def generate_period(self, init, end):
        init_year = int(init)
        end_year = int(end)

        list_period = []
        while (init_year < end_year):
            next_year = init_year + 1
            list_period.append([init_year, next_year])
            init_year = init_year + 1

        return list_period

    def iszero(self, a):
        return abs(a)<1e-9

    def calculate_gcf(self, a, b):
        if self.iszero(b):
            return a

        return self.calculate_gcf(b, a % b)

    def retrieve(self, params):
        init_year = params['request'].args.get('init')
        end_year = params['request'].args.get('end')
        query_type = params['type']

        if not self.check_year(init_year, end_year):
            return 'Please enter `init` and `end` as parameters.'

        list_year = self.generate_year(init_year, end_year)
        list_income_data = self.modules['income'].get_data(query_type, init_year, end_year)
        list_wealth_data = self.modules['wealth'].get_data(query_type, init_year, end_year)

        list_income = []
        list_wealth = []

        for item in list_income_data:
            list_income.append(item[1])

        for item in list_wealth_data:
            list_wealth.append(item[1])

        res_json = {
            'year': list_year,
            'income': list_income,
            'wealth': list_wealth
        }

        return json.dumps(res_json)

    def inequality(self, params):
        init_year = params['request'].args.get('init')
        end_year = params['request'].args.get('end')
        query_type = params['type']

        if not self.check_year(init_year, end_year):
            return 'Please enter `init` and `end` as parameters.'

        list_year = self.generate_year(init_year, end_year)

        list_data = []
        list_data = self.modules[query_type].get_data('all', init_year, end_year)

        factor = []
        for item in list_data:
            factor.append(self.calculate_gcf(float(item[2]), float(item[1])))

        res_json = {
            'year': list_year,
            'factor': factor
        }

        return json.dumps(res_json)

    def saving_capacity(self, params):
        request_data = params['request'].json
        init_year = request_data[u'init']
        end_year = request_data[u'end']
        group = request_data[u'group']

        if not self.check_year(init_year, end_year):
            return 'Please enter `init` and `end` as parameters.'

        list_data = self.modules['general'].get_data(init_year, end_year)
        list_data_temp = {}

        for item in list_data:
            list_data_temp[item[1]] = item

        list_period = self.generate_period(init_year, end_year)
        list_saving_capacity = []

        for period in list_period:
            x = period[0]
            y = period[1]
            total = 0

            if group == 10 or group == 50:
                total = (list_data_temp[y][3] - list_data_temp[x][3]) / list_data_temp[x][2]
            else:
                total = (list_data_temp[y][5] - list_data_temp[x][5]) / list_data_temp[x][4]

            list_saving_capacity.append(float(total))

        res_json = {
            'group': group,
            'period': list_period,
            'saving_capacity': list_saving_capacity
        }

        return json.dumps(res_json)

    def prediction(self, params):
        request_data = params['request'].json
        n_year = request_data[u'years']
        group = request_data[u'group']
        query_type = params['type']

        list_data = self.modules[query_type].get_data(group)

        values = []
        for item in list_data:
            values.append((item[0], float(item[1])))

        coef = params['regression'].calculate(values)

        i = 1
        prediction = []
        while (i <= n_year):
            year = 2014 + i
            p = params['regression'].predict(year, coef[u'm'], coef[u'b'])
            prediction.append(p)
            i = i + 1


        res_json = {
            'group': group,
            'prediction': prediction
        }

        return json.dumps(res_json)
