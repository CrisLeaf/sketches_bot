from flask import Flask


def create_app():
	app = Flask(__name__)
	
	from . import application
	
	app.register_blueprint(application.bp)
	
	return app
