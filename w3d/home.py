from flask import (
    Blueprint, flash, url_for, render_template
)
from . import utils
from os.path import join, dirname, realpath

bp = Blueprint('home', __name__)

@bp.route('/')
def index():
    drinks = utils.get_drinks()
    return render_template('home/home.html')