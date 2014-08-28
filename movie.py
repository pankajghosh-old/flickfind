from flask.ext.restful import Resource, Api, reqparse
import requests
import flask

parser = reqparse.RequestParser()
parser.add_argument('url', type=str)

class MoviePosterResource(Resource):
	def get(self):
		from model import MoviePoster
		from main import db
		args = parser.parse_args()
		url = args['url']
		print 'MoviePosterResource get', url
		rows = db.session.query(MoviePoster).filter(MoviePoster.url == url)
		if rows.count():
			print 'found url in database', rows.count()
			movie_poster = rows.first()
			poster = movie_poster.poster
		else:
			print 'did not find url in database', url
			poster = self._get_poster_and_insert_into_db(url)
		response = flask.make_response(poster)
		response.mimetype = 'image/jpeg'
		return response


	def put(self):
		args = parser.parse_args()
		url = args['url']
		print 'MoviePosterResource put', url
		return self._get_poster_and_insert_into_db(url)

	def _get_poster_and_insert_into_db(self, url):
		from model import MoviePoster
		from main import db
		poster = requests.get(url).content
		new_poster_obj = MoviePoster(url, poster)
		db.session.add(new_poster_obj)
		db.session.commit()
		return poster

def setup_resources(app):
	api = Api(app)
	from movie import MoviePosterResource
	api.add_resource(MoviePosterResource, '/movie_poster')