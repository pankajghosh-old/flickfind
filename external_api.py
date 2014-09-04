import json
import os
import requests

def do_search_from_myapi_films(search_term):
	r = requests.get('http://www.myapifilms.com/imdb?title=%s&exactFilter=0&limit=10'%(search_term,))
	response = json.loads(r.text)
	return_list = []
	for request_movie_dict in response:
		new_movie_dict = {}
		if request_movie_dict['urlPoster']:
			# print 'url', jj['urlPoster']
			new_movie_dict['urlPoster'] = '/movie_poster?url='+request_movie_dict['urlPoster']
			new_movie_dict['urlIMDB'] = request_movie_dict['urlPoster']
			new_movie_dict['rating'] = request_movie_dict['rating']
			new_movie_dict['title'] = request_movie_dict['title']

			return_list.append(new_movie_dict)
	return return_list

def get_imdb_rating(imdb_id):
	omdb_url = "http://www.omdbapi.com/?i=tt%s&t="%imdb_id
	res = json.loads(requests.get(omdb_url).content)
	return res['imdbRating']

def get_imdb_url_from_id(imdb_id):
	return "http://www.imdb.com/title/tt%s"%imdb_id

def get_rottentomatoes_key():
	return os.environ['RT_API_KEY']

def do_search_from_rottentomatoes(search_term):
	rt_api_key = get_rottentomatoes_key()
	request_url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=%s&q=%s"%(rt_api_key, search_term)
	res = json.loads(requests.get(request_url).content)
	return_list = []

	for request_movie_dict in res['movies']:
		new_movie_dict = {}

		imdb_id = request_movie_dict.get('alternate_ids', {}).get('imdb', None)
		poster_url = request_movie_dict.get('posters', {}).get('detailed', None)

		critics_score = request_movie_dict['ratings'].get('critics_score', 0)
		critics_rating = request_movie_dict['ratings'].get('critics_rating', None)
		audience_score = request_movie_dict['ratings'].get('audience_score', 0)
		audience_rating = request_movie_dict['ratings'].get('audience_rating', None)

		if imdb_id and (critics_rating or audience_rating):
			new_movie_dict['urlPoster'] = '/movie_poster?url='+poster_url
			new_movie_dict['urlIMDB'] = get_imdb_url_from_id(imdb_id)
			new_movie_dict['imdb_rating'] = get_imdb_rating(imdb_id)
			new_movie_dict['title'] = request_movie_dict['title']
			new_movie_dict['critics_score'] = critics_score
			new_movie_dict['critics_rating'] = critics_rating
			new_movie_dict['audience_score'] = audience_score
			new_movie_dict['audience_rating'] = audience_rating

			return_list.append(new_movie_dict)
	return return_list
