from flask import Flask
import os


def create_app():
	app = Flask(__name__)
	
	from . import main
	
	app.register_blueprint(main.bp)
	
	return app
