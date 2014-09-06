import json
import os
from flask.ext.restful import Api
import requests
import flask

def setup_resources(app):
	api = Api(app)
	from movie import MoviePosterResource, SearchTermsResource, SearchResultsResource
	api.add_resource(MoviePosterResource, '/movie_poster')
	api.add_resource(SearchTermsResource, '/search_terms')
	api.add_resource(SearchResultsResource, '/search_results')

def initialize_app():
	from model import db
	app = flask.Flask(__name__, static_url_path = "", static_folder="")
	app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
	db.app = app
	db.init_app(app)

	#create any new tables
	db.create_all()
	return app

app = initialize_app()
setup_resources(app)

@app.route('/')
def root():
	return app.send_static_file('main.html')

@app.route('/ping')
def ping():
	data = json.dumps({"a":"b"})
	r = flask.make_response( data )
	r.mimetype = 'application/json'
	return r

if __name__ == '__main__':
    app.run(debug=True)
