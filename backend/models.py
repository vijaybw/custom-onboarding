from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    about = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(50), nullable=True)
    zip = db.Column(db.String(20), nullable=True)
    birthdate = db.Column(db.String(20), nullable=True)
    progress_step = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class ConfigModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    page = db.Column(db.String(10), nullable=False)  # "page2" or "page3"
    field = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {"page": self.page, "field": self.field}
