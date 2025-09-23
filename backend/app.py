from flask import Flask, request, jsonify
from extensions import db
from models import User, ConfigModel
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres.qyrvdajoynnksaqpllzg:kJrTBsY7oZ1dC2nB@aws-1-us-east-2.pooler.supabase.com:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)

    with app.app_context():
        db.create_all()

    # ------------------ USERS ------------------ #
    @app.route("/api/users", methods=["POST"])
    def create_or_login_user():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if user:
            # If user exists, check password
            if user.password != password:
                return jsonify({"error": "Invalid credentials"}), 400
            # Login success → return existing user
            return jsonify(user.to_dict()), 200
        else:
            # Create new user
            new_user = User(email=email, password=password, progress_step=1)
            db.session.add(new_user)
            db.session.commit()
            return jsonify(new_user.to_dict()), 201

    @app.route("/api/users", methods=["GET"])
    def list_users():
        return jsonify([u.to_dict() for u in User.query.all()])

    @app.route("/api/users/<int:user_id>", methods=["GET"])
    def get_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())

    @app.route("/api/users/<int:user_id>", methods=["PUT"])
    def update_user(user_id):
        user = User.query.get_or_404(user_id)
        data = request.json
        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        db.session.commit()
        return jsonify(user.to_dict())

    ### 🔹 NEW: Update only progress_step
    @app.route("/api/users/<int:user_id>/progress", methods=["PUT"])
    def update_progress(user_id):
        user = User.query.get_or_404(user_id)
        data = request.json
        if "progress_step" in data:
            user.progress_step = data["progress_step"]
            db.session.commit()
        return jsonify(user.to_dict())

    # ------------------ CONFIG ------------------ #
    @app.route("/api/config", methods=["GET"])
    def get_config():
        configs = ConfigModel.query.all()
        result = {"page2": [], "page3": []}   # always initialize
        for c in configs:
            if c.page in result:              # ignore bad rows
                result[c.page].append(c.field)
        return jsonify(result)


    @app.route("/api/config", methods=["POST"])
    def save_config():
        data = request.json
        if not data:
            return jsonify({"error": "No config data"}), 400

        ConfigModel.query.delete()
        for page, fields in data.items():
            for f in fields:
                db.session.add(ConfigModel(page=page, field=f))
        db.session.commit()

        return jsonify(data)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)
