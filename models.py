from app import db
from datetime import datetime


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # Profile information
    name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=True)
    role = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    
    # Image URLs
    avatar_url = db.Column(db.Text, nullable=True)
    background_url = db.Column(db.Text, nullable=True)
    
    # Settings
    include_cover = db.Column(db.Boolean, default=True)
    social_media_position = db.Column(db.String(10), default='right')  # 'left' or 'right'
    
    # Social media usernames
    twitter = db.Column(db.String(100), nullable=True)
    github = db.Column(db.String(100), nullable=True)
    linkedin = db.Column(db.String(100), nullable=True)
    instagram = db.Column(db.String(100), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert the profile to a dictionary for JSON responses"""
        return {
            'id': self.id,
            'name': self.name,
            'lastName': self.last_name,
            'role': self.role,
            'city': self.city,
            'country': self.country,
            'avatarURL': self.avatar_url,
            'background': self.background_url,
            'includeCover': self.include_cover,
            'socialMediaPosition': self.social_media_position,
            'twitter': self.twitter,
            'github': self.github,
            'linkedin': self.linkedin,
            'instagram': self.instagram,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Profile {self.name} {self.last_name}>'