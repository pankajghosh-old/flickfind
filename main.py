import os
import json

import requests
import flask
from flask.ext.sqlalchemy import SQLAlchemy

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

cache = {}

from movie import setup_resources
setup_resources(app)

@app.route('/')
def hello():
	return open("main.html", 'r').read()

@app.route('/ping')
def ping():
	data = json.dumps({"a":"b"})
	r = flask.make_response( data )
	r.mimetype = 'application/json'
	return r

@app.route('/links')
def links():
	global cache
	title = flask.request.args.get('title','gorilla')
	print 'fetching links for title: ', title
	if (title in cache) and (len(cache[title]) > 10):
		rr = cache[title]
		print 'using cache to get links for title: ', title
	else:
		print 'cache hit miss. getting links from imdb for title: ', title    		
		r = requests.get('http://www.myapifilms.com/imdb?title=%s&exactFilter=0&limit=10'%(title,))
		rc = r.text
		j = json.loads(rc)
		return_list = []
		for jj in j:
			if jj['urlPoster']:
				# print 'url', jj['urlPoster']
				jj['urlPoster'] = '/movie_poster?url='+jj['urlPoster']
				return_list.append(jj)
		rr = json.dumps(return_list)
		cache[title] = rr
	r1 = flask.make_response(rr)
	r1.mimetype = 'application/json'
	return r1

# def get_imdb_rating(movie_url):
# 	print 'getting rating for movie', movie_url
# 	imdb_id = movie_url.split('/')[-1]
# 	omdb_url = "http://www.omdbapi.com/?i=%s&t="%imdb_id
# 	res = json.loads(requests.get(omdb_url).content)
# 	return res['imdbRating']


@app.route('/terms')
def terms():
	from model import SearchTerms, MoviePoster

	all_terms_dict = [{'term':term.term} for term in SearchTerms.query.all()]
	r1 = flask.make_response(json.dumps(all_terms_dict))
	r1.mimetype = 'application/json'
	return r1

@app.route('/addsearchterm', methods = ['POST'])
def addsearchterm():
	from model import SearchTerms, MoviePoster

	new_term = flask.request.args.get('term',None)
	if new_term and not SearchTerms.query.filter_by(term=new_term).count():
		new_term_obj = SearchTerms(new_term)
		db.session.add(new_term_obj)
		db.session.commit()
	return 'OK'

if __name__ == '__main__':
    app.run(debug=True)
