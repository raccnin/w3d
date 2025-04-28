from flask import (
    Blueprint, flash, url_for, render_template
)
from werkzeug.exceptions import abort 

from . import utils
from os.path import join, dirname, realpath

bp = Blueprint('drinks', __name__, url_prefix='/drinks')

@bp.route('/<int:drink_id>')
def drink_page(drink_id):
    drinks = utils.get_drinks()

    if drink_id not in drinks:
        abort(404, f"Drink ID {drink_id} does not exist")

    drink_data = drinks[drink_id]

    return render_template('drinks/drink_page.html', drink_data=drink_data)