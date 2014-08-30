from flask.ext.restful import Resource, reqparse
import flask
from model import MoviePoster, SearchTerms
import json

parser = reqparse.RequestParser()
parser.add_argument('url', type=str)


class MoviePosterResource(Resource):
	def get(self):
		args = parser.parse_args()
		url = args['url']
		# print 'MoviePosterResource get', url
		poster = MoviePoster.get(url)
		response = flask.make_response(poster)
		response.mimetype = 'image/jpeg'
		return response


	def put(self):
		args = parser.parse_args()
		url = args['url']
		# print 'MoviePosterResource put', url
		return MoviePoster.put(url)

st_parser = reqparse.RequestParser()
st_parser.add_argument('term', type=str)

class SearchTermsResource(Resource):
	def get(self):
		all_terms_dict = [{'term':term.term} for term in SearchTerms.query.all()]
		response = flask.make_response(json.dumps(all_terms_dict))
		response.mimetype = 'application/json'
		return response

	def post(self):
		args = st_parser.parse_args()
		new_term = args['term']

		SearchTerms.post(new_term)
		return 'OK'


