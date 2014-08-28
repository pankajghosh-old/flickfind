from main import db, api
from flask.ext.restful import Resource, Api

class MoviePoster(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String(255))
	poster = db.Column(db.Binary)

	def __init__(self, url, poster):
		self.url = url
		self.poster = poster

	def __repr__(self):
		return '<MoviePoster %r>'%self.url

class MoviePosterResource(Resource):
	def get(self, url):
		pass

	def put(self, url):
		poster = requests.get(url).content
		new_poster_obj = MoviePoster(url, poster)
		db.session.add(new_poster_obj)
		db.session.commit()
