import os
import flask
from flask.ext.restful import Api

def setup_resources(app):
	api = Api(app)
	from movie import MoviePosterResource
	api.add_resource(MoviePosterResource, '/movie_poster')

def initialize_app():
	from model import db
	app = flask.Flask(__name__)
	app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
	db.init_app(app)

	setup_resources(app)

	return app