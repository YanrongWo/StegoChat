import os
from flask import Flask
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=tmpl_dir)

import routes