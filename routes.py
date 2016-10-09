from flask import request, render_template, g, redirect, Response, make_response, jsonify, url_for, session, escape
from __init__ import app

from gevent import Queue

subscriptions = []

@app.route("/", methods=["GET"])
def index():
	return render_template("index.html")

@app.route("/publishMessage", methods=["GET", "POST"])
def publishMessage():
	user = request.args.get('sender')
	message_type = request.args.get('type') # text, stego-image
	content = request.args.get('content')

	message_dict = { "sender": user, "type": message_type, "content": content }

	for s in subscriptions:
		s.put(s)


def subscribeToChat():
	def genMessages():
        q = Queue()
        subscriptions.append(q)
        try:
            while True:
                result = q.get()
                yield jsonify(result)
        except GeneratorExit: # Or maybe use flask signals
            subscriptions.remove(q)

    return Response(genMessages(), mimetype="text/event-stream")
