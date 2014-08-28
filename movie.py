from flask.ext.restful import Resource, Api

class MoviePosterResource(Resource):
	def get(self, url):
		from model import MoviePoster
		from main import db
		print 'MoviePosterResource get', url
		rows = db.session.query(MoviePoster).filter(MoviePoster.url == url)
		if rows:
			print 'found url in database', url
			movie_poster = rows.first()
			poster = movie_poster.poster
		else:
			print 'did not find url in database', url
			poster = self.put(url)
		response = flask.make_response(poster)
		response.mimetype = 'image/jpeg'
		return response


	def put(self, url):
		from model import MoviePoster
		from main import db
		print 'MoviePosterResource put', url
		poster = requests.get(url).content
		new_poster_obj = MoviePoster(url, poster)
		db.session.add(new_poster_obj)
		db.session.commit()
		return poster

def setup_resources(app):
	api = Api(app)
	from movie import MoviePosterResource
	api.add_resource(MoviePosterResource, '/movie_poster/<string:url>')