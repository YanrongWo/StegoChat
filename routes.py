from flask import request, render_template, g, redirect, Response, make_response, jsonify, url_for, session, escape
from __init__ import app


@app.route("/", methods=["GET"])
def index():
	return render_template("index.html")