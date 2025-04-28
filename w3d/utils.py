import json
from flask import g
import os
from os.path import join, dirname

def read_json(path_to_json):

    with open(path_to_json, 'r') as file:
        data = json.load(file)

    return data

def load_drinks():
    drink_dir = join(dirname(__file__), 'static', 'drinks')
    json_paths = os.listdir(drink_dir)
    drinks = {}
    for json_path in json_paths:
        json_path = join(drink_dir, json_path)
        drink_data = read_json(json_path)
        drinks[drink_data['id']] = drink_data
    
    return drinks

def get_drinks():

    if 'drinks' not in g:
        drinks = load_drinks()
        g.drinks = drinks

    return g.drinks