"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, request, jsonify
from Fasteignir.models import Fasteignir, Fasteignir_changes
from Fasteignir import app

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )

@app.route('/get')
def get():
    results = Fasteignir.query.order_by(Fasteignir.skrad_a_vef.desc())[0:15]
    return jsonify({'success': False, 'houses': [{'id': item.ID, 'url': item.url} for item in results]})
