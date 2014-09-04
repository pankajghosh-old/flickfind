import requests, json
from pprint import pformat
from external_api import do_search_from_rottentomatoes

def get_imdb_rating(movie_url):
	imdb_id = movie_url.split('/')[-1]
	omdb_url = "http://www.omdbapi.com/?i=%s&t="%imdb_id
	res = json.loads(requests.get(omdb_url).content)
	print res['imdbRating']

def get_movie_list_from_rotten_tomatoes():
	request_url = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=2edcmcm6zhzqv7bnvq99275j&q=apocalypse"
	res = json.loads(requests.get(request_url).content)
	print 'results count', res['total']
	for movie_dict in res['movies']:
		print 'critics score', movie_dict['ratings'].get('critics_score', 0)
		print 'critics rating', movie_dict['ratings'].get('critics_rating', None)
		print 'audience score', movie_dict['ratings'].get('audience_score', 0)
		print 'audience rating', movie_dict['ratings'].get('audience_rating', None)
		print 'title', movie_dict['title']
		# print 'imdb_id', movie_dict.get('alternate_ids', {}).get('imdb', None)
		# print 'detailed url poster', movie_dict.get('posters', {}).get('detailed', None)
		# print 'profile url poster', movie_dict.get('posters', {}).get('profile', None)

def test_external_api_by_search_term(search_term):
	res = do_search_from_rottentomatoes(search_term)
	print pformat(res)

def create_tables():
	pass

if __name__ == '__main__':
	# url = "http://www.imdb.com/title/tt0111161"
	# get_imdb_rating(url)
	# get_movie_list_from_rotten_tomatoes()
	test_external_api_by_search_term("french")