from flask.ext.restful import Resource, reqparse
import requests
import flask
from model import MoviePoster

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

