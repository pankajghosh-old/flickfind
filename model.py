from main import db

class MoviePoster(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String(255))
	poster = db.Column(db.Binary)

	def __init__(self, url, poster):
		self.url = url
		self.poster = poster

	def __repr__(self):
		return '<MoviePoster %r>'%self.url


class SearchTerms(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	term = db.Column(db.String(80))

	def __init__(self, term):
		self.term = term
	
	def __repr__(self):
		return '<Term %r>' % self.term
