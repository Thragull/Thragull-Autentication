"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(__file__), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
app.config["JWT_SECRET_KEY"] = "My#JwT#4ut3nt1c4t10n#Pr0j3ct"
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Habilitar CORS para todas las rutas
CORS(app)

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)

app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

@app.route('/api/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Body must contain something'}), 400
    if 'email' not in body or 'password' not in body:
        return jsonify({'msg': 'Body must include email and password'}), 400
    user = User.query.filter_by(email=body['email']).first()
    if user is not None:
        return jsonify({'msg': 'User already exists'}), 400
    user = User()
    user.email = body['email']
    encrypted_password = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    user.password = encrypted_password

    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'User created successfully'}), 201


@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Body must contain something'}), 400
    if 'email' not in body or 'password' not in body:
        return jsonify({'msg': 'Body must include email and password'}), 400
    user = User.query.filter_by(email=body['email']).first()
    if user is None:
        return jsonify({'msg': 'There is no user registered with this email'}), 404
    if not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({'msg': 'Incorrect Email or Password'}), 400
    token = create_access_token(identity=user.email)
    return jsonify({'msg': 'Loggin successfull', 'token': token, 'user': user.email}), 200

@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    logged_user = get_jwt_identity()
    user=User.query.filter_by(email=logged_user).first()
    if user is None:
        return jsonify({'msg': 'User not found'}), 404
    return jsonify({'msg': 'Access Granted for {}'.format(user),
                    'user': user.serialize()}), 200

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
