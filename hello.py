import os
import json

import requests
import flask
from flask.ext.sqlalchemy import SQLAlchemy

app = flask.Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

cache = {}
imgcache = {}

class SearchTerms(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	term = db.Column(db.String(80))

	def __init__(self, term):
		self.term = term
	
	def __repr__(self):
		return '<Term %r>' % self.term

@app.route('/')
def hello():
	# return "dog"
	return open("main.html", 'r').read()

@app.route('/api')
def api():
	data = json.dumps({"a":"b"})
	r = flask.make_response( data )
	r.mimetype = 'application/json'
	return r

@app.route('/img')
def img():
        global imgcache
        l = flask.request.args.get('url',None)
        if l:
                if l in imgcache:
                        c = imgcache[l]
                else:
                        c = requests.get(l).content
                        imgcache[l] = c
                r1 = flask.make_response(c)
                r1.mimetype = 'image/jpeg'
                return r1
        else:
                return "provide parameter: url"

@app.route('/links')
def links():
        global cache
        title = flask.request.args.get('title','gorilla')
        if (title in cache) and (len(cache[title]) > 10):
                rr = cache[title]
        else:
                r = requests.get('http://www.myapifilms.com/imdb?title=%s&exactFilter=0&limit=10'%(title,))
                rc = r.text
                j = json.loads(rc)
                for jj in j:
            		if jj['urlPoster']:
	            		jj['urlPoster'] = '/img?url='+jj['urlPoster']
                rr = json.dumps(j)
                cache[title] = rr
	r1 = flask.make_response(rr)
	r1.mimetype = 'application/json'
	return r1

@app.route('/terms')
def terms():
	all_terms_dict = [{'term':term.term} for term in SearchTerms.query.all()]
	# print all_terms_dict
	r1 = flask.make_response(json.dumps(all_terms_dict))
	r1.mimetype = 'application/json'
	return r1

@app.route('/addsearchterm', methods = ['POST'])
def addsearchterm():
	new_term = flask.request.args.get('term',None)
	if new_term and not SearchTerms.query.filter_by(term=new_term).count():
		new_term_obj = SearchTerms(new_term)
		db.session.add(new_term_obj)
		db.session.commit()
	return 'OK'

if __name__ == '__main__':
    app.run(debug=True)
