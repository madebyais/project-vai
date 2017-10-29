class Income:

    def __init__(self, db):
        self.db = db
        self.QUERY_ALL = "SELECT year, income_top_10, income_bottom_50 FROM tbl_data WHERE year >= %s and year <= %s"
        self.QUERY_TOP_10 = "SELECT year, income_top_10 FROM tbl_data WHERE year >= %s and year <= %s"
        self.QUERY_BOTTOM_50 = "SELECT year, income_bottom_50 FROM tbl_data WHERE year >= %s and year <= %s"

    def set_query(self, query_type):
        if query_type == 'all':
            return self.QUERY_ALL
        elif query_type == '10' or query_type == 10:
            return self.QUERY_TOP_10
        elif query_type == '50' or query_type == 50:
            return self.QUERY_BOTTOM_50
        else:
            return self.QUERY_ALL

    def get_data(self, query_type, init_year = 1962, end_year = 2014):
        query = self.set_query(query_type)
        temp_data = self.db.execute(query, (init_year, end_year))

        data = []
        for item in temp_data:
            if len(item) == 3:
                data.append([item[0], float(item[1]), float(item[2])])
            else:
                data.append([item[0], float(item[1])])

        self.db.close()

        return data
