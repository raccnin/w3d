from flask import (
    Blueprint, flash, url_for, render_template
)

bp = Blueprint('home', __name__)

@bp.route('/')
def index():
    return render_template('home/home.html')