import requests, json

def get_imdb_rating(movie_url):
	imdb_id = movie_url.split('/')[-1]
	omdb_url = "http://www.omdbapi.com/?i=%s&t="%imdb_id
	res = json.loads(requests.get(omdb_url).content)
	print res['imdbRating']


if __name__ == '__main__':
	url = "http://www.imdb.com/title/tt0111161"
	get_imdb_rating(url)