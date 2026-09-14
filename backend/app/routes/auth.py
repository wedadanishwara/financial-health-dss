from flask import request, jsonify
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
from app import db
from app.models.user import User
from app.routes import auth_bp

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validation
        if not data or not all(key in data for key in ['email', 'password', 'confirmPassword', 'fullName']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        full_name = data.get('fullName', '').strip()
        
        # Validate email
        try:
            validate_email(email)
        except EmailNotValidError as e:
            return jsonify({'message': 'Invalid email address'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already registered'}), 409
        
        # Validate password
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters long'}), 400
        
        if password != confirm_password:
            return jsonify({'message': 'Passwords do not match'}), 400
        
        # Validate full name
        if len(full_name) < 2:
            return jsonify({'message': 'Full name must be at least 2 characters long'}), 400
        
        # Create new user
        user = User(full_name=full_name, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        data = request.get_json()
        
        # Validation
        if not data or not all(key in data for key in ['email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500
