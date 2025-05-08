from flask import (
    Blueprint, render_template
)
from . import utils

bp = Blueprint('home', __name__)

@bp.route('/')
def index():
    utils.get_drinks()
    return render_template('home/home.html')

@bp.route('/about')
def about():
    utils.get_drinks()
    return render_template('home/about.html')