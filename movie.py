from flask.ext.restful import Resource, reqparse
import flask
from model import MoviePoster, SearchTerms
import json

class MoviePosterResource(Resource):
	_parser = None

	def _get_request_parser(self):
		if not self._parser:
			self._parser = reqparse.RequestParser()
			self._parser.add_argument('url', type=str)
		return self._parser
	request_parser = property(_get_request_parser)

	def get(self):
		args = self.request_parser.parse_args()
		url = args['url']
		# print 'MoviePosterResource get', url
		poster = MoviePoster.get(url)
		response = flask.make_response(poster)
		response.mimetype = 'image/jpeg'
		return response


	def put(self):
		args = self.request_parser.parse_args()
		url = args['url']
		# print 'MoviePosterResource put', url
		return MoviePoster.put(url)

class SearchTermsResource(Resource):
	_parser = None

	def _get_request_parser(self):
		if not self._parser:
			self._parser = reqparse.RequestParser()
			self._parser.add_argument('term', type=str)
		return self._parser
	request_parser = property(_get_request_parser)

	def get(self):
		all_terms_dict = [{'term':term.term} for term in SearchTerms.query.all()]
		response = flask.make_response(json.dumps(all_terms_dict))
		response.mimetype = 'application/json'
		return response

	def post(self):
		args = self.request_parser.parse_args()
		new_term = args['term']

		SearchTerms.post(new_term)
		return 'OK'


