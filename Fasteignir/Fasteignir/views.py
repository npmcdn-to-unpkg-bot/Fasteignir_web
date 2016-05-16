"""
Routes and views for the flask application.
"""
import os
import json
from datetime import datetime
from flask import request, jsonify, session, redirect, render_template, send_from_directory
from Fasteignir.models import Fasteignir, Fasteignir_changes
from Fasteignir import app
from functools import wraps

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    if 'profile' not in session:
      # Redirect to Login page here
      return redirect('/')
    return f(*args, **kwargs)

  return decorated

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

# Here we're using the /callback route.
@app.route('/callback')
def callback_handling():
  env = os.environ
  code = request.args.get('code')

  json_header = {'content-type': 'application/json'}

  token_url = "https://{domain}/oauth/token".format(domain='blago.eu.auth0.com')

  token_payload = {
    'client_id':     'wKZQqy9iZXSKjpzQAQxThFMtYRz1IVu7',
    'client_secret': 'EnO0SS7JBCPImkqCtr_dcpBcZEAkgd9ap9sWEPBzx_GTospEUisa2qI7XlFo6qPM',
    'redirect_uri':  'http://h2553182.stratoserver.net/callback',
    'code':          code,
    'grant_type':    'authorization_code'
  }

  token_info = requests.post(token_url, data=json.dumps(token_payload), headers = json_header).json()

  user_url = "https://{domain}/userinfo?access_token={access_token}" \
      .format(domain='blago.eu.auth0.com', access_token=token_info['access_token'])

  user_info = requests.get(user_url).json()

  # We're saving all user information into the session
  session['profile'] = user_info

  # Redirect to the User logged in page that you want here
  # In our case it's /dashboard
  return redirect('/about')

@app.route("/dashboard")
@requires_auth
def dashboard():
    return render_template('about.html', user=session['profile'])