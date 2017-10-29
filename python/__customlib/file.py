ALLOWED_EXTENSIONS = set(['csv'])

class File:

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
