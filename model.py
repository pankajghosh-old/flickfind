from flask.ext.sqlalchemy import SQLAlchemy
import requests

db=None

if not db:
	print 'initializing db'
	db = SQLAlchemy()

class MoviePoster(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String(255))
	poster = db.Column(db.Binary)

	def __init__(self, url, poster):
		self.url = url
		self.poster = poster

	def __repr__(self):
		return '<MoviePoster %r>'%self.url

	@classmethod
	def get(cls, url):
		rows = db.session.query(cls).filter(cls.url == url)
		if rows.count():
			# print 'found url in database', rows.count()
			movie_poster = rows.first()
			poster = movie_poster.poster
		else:
			# print 'did not find url in database', url
			poster = cls.put(url)
		return poster

	@classmethod
	def put(cls, url):
		poster = requests.get(url).content
		new_poster_obj = cls(url, poster)
		db.session.add(new_poster_obj)
		db.session.commit()
		return poster

class SearchTerms(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	term = db.Column(db.String(80))

	def __init__(self, term):
		self.term = term
	
	def __repr__(self):
		return '<Term %r>' % self.term


	def get():
		pass

	@classmethod
	def post(cls, new_term):
		if new_term and not SearchTerms.query.filter_by(term=new_term).count():
			new_term_obj = SearchTerms(new_term)
			db.session.add(new_term_obj)
			db.session.commit()
