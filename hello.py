import os
import json
import requests

import flask
from flask import Flask

app = Flask(__name__)
cache = {}

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

@app.route('/links')
def links():
        global cache
        title = flask.request.args.get('title','gorilla')
        if (title in cache) and (len(cache[title]) > 10):
                rr = cache[title]
        else:
                r = requests.get('http://www.myapifilms.com/imdb?title=%s&exactFilter=0&limit=10'%(title,))
                rr = r.text
                cache[title] = rr
	r1 = flask.make_response(rr)
	r1.mimetype = 'application/json'
	return r1

if __name__ == '__main__':
    app.run(debug=True)
