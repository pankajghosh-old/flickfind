import json

import requests
import flask

cache = {}

from init_app import initialize_app
app = initialize_app()

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

if __name__ == '__main__':
    app.run(debug=True)
