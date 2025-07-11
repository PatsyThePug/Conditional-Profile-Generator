import os
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import logging

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# initialize the app with the extension
db.init_app(app)

with app.app_context():
    # Import models here so they are registered with SQLAlchemy
    import models
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/profiles', methods=['GET', 'POST'])
def profiles():
    if request.method == 'POST':
        # Save profile data
        data = request.get_json()
        profile = models.Profile(
            name=data.get('name'),
            last_name=data.get('lastName'),
            role=data.get('role'),
            city=data.get('city'),
            country=data.get('country'),
            avatar_url=data.get('avatarURL'),
            background_url=data.get('background'),
            include_cover=data.get('includeCover', True),
            social_media_position=data.get('socialMediaPosition', 'right'),
            twitter=data.get('twitter'),
            github=data.get('github'),
            linkedin=data.get('linkedin'),
            instagram=data.get('instagram')
        )
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({'id': profile.id, 'message': 'Profile saved successfully'})
    
    else:
        # Get all profiles
        profiles = models.Profile.query.all()
        return jsonify([profile.to_dict() for profile in profiles])

@app.route('/api/profiles/<int:profile_id>', methods=['GET', 'PUT', 'DELETE'])
def profile_detail(profile_id):
    profile = models.Profile.query.get_or_404(profile_id)
    
    if request.method == 'GET':
        return jsonify(profile.to_dict())
    
    elif request.method == 'PUT':
        # Update profile
        data = request.get_json()
        profile.name = data.get('name', profile.name)
        profile.last_name = data.get('lastName', profile.last_name)
        profile.role = data.get('role', profile.role)
        profile.city = data.get('city', profile.city)
        profile.country = data.get('country', profile.country)
        profile.avatar_url = data.get('avatarURL', profile.avatar_url)
        profile.background_url = data.get('background', profile.background_url)
        profile.include_cover = data.get('includeCover', profile.include_cover)
        profile.social_media_position = data.get('socialMediaPosition', profile.social_media_position)
        profile.twitter = data.get('twitter', profile.twitter)
        profile.github = data.get('github', profile.github)
        profile.linkedin = data.get('linkedin', profile.linkedin)
        profile.instagram = data.get('instagram', profile.instagram)
        
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(profile)
        db.session.commit()
        return jsonify({'message': 'Profile deleted successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
