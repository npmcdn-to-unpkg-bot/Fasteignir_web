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
        message='You can contact me by sending me an email.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='This webpage is based on a software that crawls the Icelandic housing market and records '+
        ' information which again is shown with the help of a highly advanced javascript software.'
    )

@app.route('/get')
def get():
    results = Fasteignir.query.order_by(Fasteignir.ID.desc())[0:1000]
    return jsonify({'success': True, 
                    'houses': [{'Tegund': item.tegund, 'staerd': str(item.staerd), 'Herbergi': str(item.herbergi), 'Heimilisfang': item.address, 
                                'byggingar_ar': item.byggingarar, 'skrad': str(item.skrad_a_vef), 'Fasteignamat': '{:,.0f} kr'.format(item.fasteignamat), 'Brunabotamat': '{:,.0f} kr'.format(item.brunabotamat), 
                                'Verd': '{:,.0f} kr'.format(item.Verd), 'Seld': item.Seld} for item in results]})
