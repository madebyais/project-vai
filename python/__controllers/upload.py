import os
import csv
from werkzeug.utils import secure_filename

class Upload:

    def __init__(self, modules):
        self.modules = modules

    def import_data(self, file_loc):
        list_data = []
        with open(file_loc, 'r') as f:
            for line in f.readlines():
                temp_data = line.strip().split(';')
                if temp_data[0] != 'year':
                    data = {
                        'year': temp_data[0],
                        'income_top_10': temp_data[1],
                        'wealth_top_10': temp_data[2],
                        'income_bottom_50': temp_data[3],
                        'wealth_bottom_50': temp_data[4]
                    }
                    list_data.append(data)

        add_query = "INSERT INTO tbl_data (year, income_top_10, wealth_top_10, income_bottom_50, wealth_bottom_50) VALUES (%(year)s, %(income_top_10)s, %(wealth_top_10)s, %(income_bottom_50)s, %(wealth_bottom_50)s)"
        for item in list_data:
            self.modules['general'].insert_data(add_query, item)

        print 'All data have been imported. :)'

    def submit_file(self, params):
        req = params['request']
        lib_file = params['lib_file']

        if req.method == 'POST':
            if 'csvfile' not in req.files:
                return '1 - Please upload a file using POST method with `csvfile` as the key.'

            file_data = req.files['csvfile']
            if file_data.filename == '':
                return '2 - Please upload a file using POST method with `csvfile` as the key.'

            if file_data and lib_file.allowed_file(file_data.filename):
                filename = secure_filename(file_data.filename)
                file_data.save(os.path.join(params['upload_folder'], filename))

                self.import_data(os.path.join(params['upload_folder'], filename))
                return 'File has been uploaded and imported to database sucessfully.'
            else:
                return 'File type is not allowed. Only accept CSV file.'

        return ' ---Please upload a file using POST method with `csvfile` as the key.'
