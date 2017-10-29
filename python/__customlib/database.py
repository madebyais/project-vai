import mysql.connector

class Database:

    def __init__(self, user, password, host, database):
        self.conn = mysql.connector.connect(user=user, password=password,
                      host=host,
                      database=database)
        self.cursor = self.conn.cursor()

    def execute(self, query, opts):
        self.cursor = self.conn.cursor()
        self.cursor.execute(query, opts)
        return self.cursor

    def execute_insert(self, query, opts):
        self.cursor = self.conn.cursor()
        self.cursor.execute(query, opts)
        self.conn.commit()
        self.cursor.close()

    def close(self):
        self.cursor.close()

    def migrate(self):
        print '[DATABASE] Creating tbl_data ...'
        query = ("CREATE TABLE IF NOT EXISTS `tbl_data` ("
                "`id` int NOT NULL AUTO_INCREMENT, "
                "`year` int(4) NOT NULL, "
                "`income_top_10` numeric(12,12) NOT NULL, "
                "`wealth_top_10` numeric(12,12) NOT NULL, "
                "`income_bottom_50` numeric(12,12) NOT NULL, "
                "`wealth_bottom_50` numeric(12,12) NOT NULL, "
                "PRIMARY KEY (`id`) "
            ") DEFAULT CHARSET=utf8;")

        self.cursor = self.conn.cursor()
        self.cursor.execute(query)
        self.conn.commit()
        self.cursor.close()
        print '[DATABASE] tbl_data has been created successfully.'
