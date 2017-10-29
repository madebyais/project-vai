class General:

    def __init__(self, db):
        self.db = db
        self.QUERY_ALL = "SELECT * FROM tbl_data WHERE year >= %s and year <= %s"

    def get_data(self, init_year = 1962, end_year = 2014):
        query = self.QUERY_ALL
        temp_data = self.db.execute(query, (init_year, end_year))

        data = []
        for item in temp_data:
            data.append([item[0], float(item[1]), float(item[2]), float(item[3]), float(item[4]), float(item[5])])

        self.db.close()

        return data

    def insert_data(self, query, opts):
        self.db.execute_insert(query, opts)
