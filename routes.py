from flask import request, render_template, g, redirect, Response, make_response, jsonify, url_for, session, escape
from __init__ import app

from gevent.queue import Queue
import gevent
import json

subscriptions = []

# From http://flask.pocoo.org/snippets/116/
class ServerSentEvent(object):

    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data : "data",
            self.event : "event",
            self.id : "id"
        }

    def encode(self):
        if not self.data:
            return ""
        lines = ["%s: %s" % (v, k) 
            for k, v in self.desc_map.iteritems() if k]
    
        return "%s\n\n" % "\n".join(lines)

@app.route("/", methods=["GET"])
def index():
	return render_template("index.html")

@app.route("/publishMessage", methods=["POST"])
def publishMessage():
    user = request.form['sender']
    message_type = request.form['type'] # text, stego-image
    content = request.form['content']

    message_dict = { "sender": user, "type": message_type, "content": content }

    def push(msg):
        for s in subscriptions[:]:
            print msg
            s.put(msg)

    gevent.spawn(push, json.dumps(message_dict))

    return 'OK'
    
@app.route('/subscribeToChat', methods=["GET", "POST"])
def subscribeToChat():
    def genMessages():
        q = Queue()
        subscriptions.append(q)
        try:
            while True:
                result = q.get()
                ev = ServerSentEvent(str(result))
                yield ev.encode()
        except GeneratorExit: # Or maybe use flask signals
            subscriptions.remove(q)
    return Response(genMessages(), mimetype="text/event-stream")
