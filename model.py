from flask.ext.sqlalchemy import SQLAlchemy
import requests
import json

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
			return movie_poster.poster
		else:
			# print 'did not find url in database', url
			return cls.put(url)

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

	@classmethod
	def get_all(cls):
		return SearchTerms.query.all()

	@classmethod
	def post(cls, new_term):
		if new_term and not SearchTerms.query.filter_by(term=new_term).count():
			new_term_obj = SearchTerms(new_term)
			db.session.add(new_term_obj)
			db.session.commit()

class SearchResults(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	search_term = db.Column(db.String(80))
	search_results = db.Column(db.Binary)

	def __init__(self, search_term, search_results):
		self.search_term = search_term
		self.search_results = search_results

	def __repr__(self):
		return '<SearchResults %r>'%self.search_term

	@classmethod
	def get(cls, search_term):
		rows = db.session.query(cls).filter(cls.search_term == search_term)
		if rows.count():
			print 'getting results from database for search term', search_term
			search_results = rows.first()
			return search_results.search_results
		else:
			return cls.put(search_term)

	@classmethod
	def put(cls, search_term):
		from external_api import do_search_from_myapi_films, do_search_from_rottentomatoes
		return_list = do_search_from_rottentomatoes(search_term)
		search_results_jobs_dump = json.dumps(return_list)

		new_search_result_obj = cls(search_term, search_results_jobs_dump)
		db.session.add(new_search_result_obj)
		db.session.commit()
		return search_results_jobs_dump
