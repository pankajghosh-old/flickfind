from main import db

class MovieModel(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	poster = db.Column(db.Binary)

